// Vercel Serverless Function endpoint for /api/portal-sync
// Enables instant real-time synchronization between laptop and mobile devices
// Uses Supabase Service Role Key to bypass RLS and keep all devices in sync

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pspftbflzfkbpndvhike.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGZ0YmZsemZrYnBuZHZoaWtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODM2OTM2NCwiZXhwIjoyMTAzOTQ1MzY0fQ.yWCyoBwRha4RX-l7Ta4QaKwdd5GVEy3eEkV9eGcNVL4';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
});

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve latest synchronized portal state
  if (req.method === 'GET') {
    try {
      // 1. Fetch latest shared state from audit_logs
      const logRes = await fetch(
        `${SUPABASE_URL}/rest/v1/audit_logs?entity_type=eq.portal_state&entity_id=eq.latest&order=created_at.desc&limit=1`,
        { headers: getHeaders() }
      );

      let sharedState = null;
      if (logRes.ok) {
        const logs = await logRes.json();
        if (logs && logs.length > 0 && logs[0].details) {
          sharedState = logs[0].details;
        }
      }

      // 2. Fetch profiles directly from Supabase to ensure all registered owners are included
      let cloudProfiles = [];
      try {
        const profRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
          headers: getHeaders()
        });
        if (profRes.ok) {
          cloudProfiles = await profRes.json();
        }
      } catch (profErr) {
        console.warn('Profile fetch notice:', profErr.message);
      }

      return res.status(200).json({
        success: true,
        data: sharedState,
        profiles: cloudProfiles,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Portal sync GET error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Persist updated state from laptop or mobile
  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { 
        properties, 
        transactions, 
        inspections, 
        documents, 
        maintenance, 
        owners, 
        onboardingSubmissions,
        newOwner
      } = payload || {};

      // 1. If a new owner is registering, auto-confirm their account in Supabase Auth
      if (newOwner && newOwner.email) {
        try {
          const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            headers: getHeaders()
          });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            const existingUser = usersData.users?.find(
              u => u.email?.toLowerCase().trim() === newOwner.email.toLowerCase().trim()
            );

            if (existingUser) {
              if (!existingUser.email_confirmed_at) {
                await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${existingUser.id}`, {
                  method: 'PUT',
                  headers: getHeaders(),
                  body: JSON.stringify({ email_confirm: true })
                });
              }
            } else if (newOwner.password) {
              const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                  email: newOwner.email.toLowerCase().trim(),
                  password: newOwner.password,
                  email_confirm: true,
                  user_metadata: {
                    full_name: newOwner.fullName,
                    phone: newOwner.phone,
                    role: 'property_owner',
                    bank_name: newOwner.bankName,
                    account_number: newOwner.accountNumber,
                    account_name: newOwner.accountName
                  }
                })
              });
              if (createRes.ok) {
                const createdData = await createRes.json();
                if (createdData?.id) {
                  await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
                    method: 'POST',
                    headers: { ...getHeaders(), 'Prefer': 'resolution=merge-duplicates' },
                    body: JSON.stringify({
                      id: createdData.id,
                      email: newOwner.email.toLowerCase().trim(),
                      full_name: newOwner.fullName,
                      phone: newOwner.phone || '',
                      role: 'property_owner',
                      bank_name: newOwner.bankName || '',
                      account_number: newOwner.accountNumber || '',
                      account_name: newOwner.accountName || newOwner.fullName,
                      assigned_properties: []
                    })
                  });
                }
              }
            }
          }
        } catch (authErr) {
          console.warn('Auto-confirm notice:', authErr.message);
        }
      }

      // 2. Persist full state snapshot to Supabase audit_logs
      const stateSnapshot = {
        properties: properties || [],
        transactions: transactions || [],
        inspections: inspections || [],
        documents: documents || [],
        maintenance: maintenance || [],
        owners: owners || [],
        onboardingSubmissions: onboardingSubmissions || [],
        updatedAt: new Date().toISOString()
      };

      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/audit_logs?entity_type=eq.portal_state&entity_id=eq.latest&limit=1`,
        { headers: getHeaders() }
      );
      const existingLogs = checkRes.ok ? await checkRes.json() : [];

      if (existingLogs && existingLogs.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/audit_logs?id=eq.${existingLogs[0].id}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({
            details: stateSnapshot,
            created_at: new Date().toISOString()
          })
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            action: 'sync_state',
            entity_type: 'portal_state',
            entity_id: 'latest',
            details: stateSnapshot
          })
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Portal state synchronized to cloud successfully.',
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Portal sync POST error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
