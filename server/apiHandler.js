// Zero-dependency backend API handler for Brevo email dispatch and Supabase lead logging

export async function handleContactSubmission(body, env = process.env) {
  const { fullName, phone, email, propertyType, location, notes } = body;

  if (!fullName || !phone || !email) {
    return {
      status: 400,
      body: { success: false, error: 'Full name, phone, and email are required fields.' }
    };
  }

  const brevoApiKey = env.BREVO_API_KEY;
  const brevoSender = env.BREVO_SENDER_EMAIL || 'info@royalhaven.com.ng';
  const brevoReceiver = env.BREVO_RECEIVER_EMAIL || 'royalhavenrealtyproperty@gmail.com';

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

  let emailSent = false;
  let emailError = null;

  // 1. Dispatch Email via Brevo REST API
  if (brevoApiKey && !brevoApiKey.includes('your_')) {
    try {
      const emailPayload = {
        sender: {
          name: 'Royal Haven Website',
          email: brevoSender
        },
        to: [
          {
            email: brevoReceiver,
            name: 'Royal Haven Management'
          }
        ],
        replyTo: {
          email: email,
          name: fullName
        },
        subject: `New Property Management Inquiry: ${fullName} (${propertyType || 'General'})`,
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #08080A; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 20px; letter-spacing: 1px; font-family: serif;">ROYAL HAVEN REALTY & PROPERTY MANAGERS</h1>
              <p style="color: #94a3b8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Consultation Request</p>
            </div>
            <div style="padding: 28px; color: #1e293b;">
              <h2 style="color: #0f172a; font-size: 18px; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Client Details</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; width: 140px; font-weight: 600;">Full Name:</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 10px 0; color: #0f172a;"><a href="tel:${phone}" style="color: #B89025; text-decoration: none; font-weight: 600;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email Address:</td>
                  <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #B89025; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Service Required:</td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${propertyType || 'Property Management'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Property Location:</td>
                  <td style="padding: 10px 0; color: #0f172a;">${location || 'Not provided'}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #D4AF37;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Message / Requirements:</p>
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">${notes || 'No extra notes provided.'}</p>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              Sent automatically from royalhaven.com.ng inquiry system
            </div>
          </div>
        `
      };

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Brevo API Error:', res.status, errText);
        emailError = `Brevo returned ${res.status}: ${errText}`;
      } else {
        emailSent = true;
      }
    } catch (err) {
      console.error('Brevo network error:', err);
      emailError = err.message;
    }
  }

  // 2. Save Inquiry to Supabase (if configured)
  let dbSaved = false;
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
    try {
      const dbPayload = {
        name: fullName,
        phone: phone,
        email: email,
        service: propertyType,
        location: location || '',
        notes: notes || '',
        created_at: new Date().toISOString()
      };

      const dbRes = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(dbPayload)
      });

      if (dbRes.ok) {
        dbSaved = true;
      } else {
        console.warn('Supabase lead save notice:', dbRes.status, await dbRes.text());
      }
    } catch (dbErr) {
      console.warn('Supabase error logging lead:', dbErr.message);
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      emailSent,
      dbSaved,
      emailError,
      message: 'Consultation request received successfully.'
    }
  };
}
