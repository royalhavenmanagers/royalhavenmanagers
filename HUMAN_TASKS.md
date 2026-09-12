# Human Tasks Guide: Email Deliverability & Domain Verification

> **Note**: Antigravity has already implemented and tested the code fixes for **Dynamic Article Social Sharing Previews** and **Resilient Email Dispatching**.  
> The tasks below are administrative settings that require your personal account access on **Resend** and **Supabase**.

---

### Task 1: Enable Client Auto-Confirmation Emails (Resend Domain Setup)

#### Why is this needed?
When a prospective client fills out the **Contact / Consultation form**, the system sends an instant notification to your admin email (`royalhavenrealtyproperty@gmail.com`) AND dispatches an automated confirmation email to the client.
Currently, Resend is using the default test address:
`onboarding@resend.dev`

Under Resend's anti-spam security policy, test sandbox accounts are strictly prohibited from emailing external client addresses (e.g. `@gmail.com`, `@yahoo.com`). Resend blocks external emails until your domain is verified.

#### Step-by-Step Instructions:
1. Go to your Resend dashboard: **[https://resend.com/domains](https://resend.com/domains)**
2. Click the **Add Domain** button.
3. Enter your domain: `royalhaven.com.ng` (or a subdomain like `mail.royalhaven.com.ng`).
4. Select your region (leave default: US East or Europe).
5. Resend will display **3 DNS records**:
   * **DKIM record** (Type: `TXT` or `CNAME`)
   * **SPF record** (Type: `TXT`)
   * **Tracking / Return-path** (Type: `MX` or `CNAME`)
6. Log into your domain registrar (where you bought `royalhaven.com.ng`, e.g., Namecheap, Whogohost, GoDaddy, or Cloudflare DNS):
   * Go to **DNS Management / Advanced DNS**.
   * Add the 3 records exactly as shown in Resend.
7. Return to Resend and click **Verify DNS Records**. (Usually verifies within 2–10 minutes).
8. Once verified, update your Vercel environment variable:
   * Go to your **Vercel Dashboard** $\rightarrow$ **Royal Haven Project** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
   * Edit `RESEND_SENDER_EMAIL` to:
     ```
     Royal Haven Inquiries <inquiries@royalhaven.com.ng>
     ```
     *(or `<noreply@royalhaven.com.ng>`)*
   * Click **Save**.
9. Redeploy the latest commit on Vercel.

Once verified, confirmation emails will automatically deliver to 100% of clients who submit inquiries on your website!

---

### Task 2: Supabase Auth Email Settings (Owner Portal & Password Resets)

#### Why is this needed?
If you want property owners who sign up to receive Supabase verification emails or if someone clicks **"Forgot Password?"**, Supabase must know your live domain to route verification links back to the site.

#### Step-by-Step Instructions:
1. Go to your Supabase Project Dashboard:  
   **[https://supabase.com/dashboard/project/pspftbflzfkbpndvhike/auth/url-configuration](https://supabase.com/dashboard/project/pspftbflzfkbpndvhike/auth/url-configuration)**
2. In **Site URL**, set:
   ```text
   https://www.royalhaven.com.ng
   ```
3. In **Redirect URLs**, click **Add URL** and add each of the following:
   * `https://www.royalhaven.com.ng`
   * `https://www.royalhaven.com.ng/*`
   * `https://www.royalhaven.com.ng/portal`
   * `https://www.royalhaven.com.ng/#portal`
4. Click **Save**.
5. *(Optional Custom SMTP)*: If you want Supabase password resets to bypass the free 3-emails-per-hour limit, go to **Authentication $\rightarrow$ SMTP Settings**, enable **Custom SMTP**, and enter your Resend SMTP credentials (Host: `smtp.resend.com`, Port: `465`, User: `resend`, Pass: your Resend API Key).

---

### Task 3: Test Article Social Sharing on WhatsApp / Twitter

Now that the dynamic social sharing engine is live:
1. Open any article on the website (e.g. `https://www.royalhaven.com.ng/?article=key-things-about-tenant-screening-lagos-ogun#blog`).
2. Click the **WhatsApp** or **Copy Link** button.
3. The link generated will be:
   ```text
   https://www.royalhaven.com.ng/article/key-things-about-tenant-screening-lagos-ogun
   ```
4. Paste this link into a WhatsApp chat or test it on [https://www.opengraph.xyz](https://www.opengraph.xyz).
5. WhatsApp and social bots will now render the **article cover image**, article title, and summary!
