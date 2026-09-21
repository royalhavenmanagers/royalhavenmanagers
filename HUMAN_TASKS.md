# Email Deliverability Setup

This guide explains how to set up custom domain emails so clients receive auto-confirmation emails directly from Royal Haven.

---

### Verify royalhaven.com.ng on Resend

1. Go to https://resend.com/domains
2. Click Add Domain
3. Enter royalhaven.com.ng
4. Resend will display three DNS records:
   - DKIM record
   - SPF record
   - Return-path record
5. Add these three records to your domain registrar DNS settings (Namecheap, Whogohost, GoDaddy, or Cloudflare)
6. Return to Resend and click Verify DNS Records
7. Once verified, open your Vercel Dashboard, go to Settings, then Environment Variables
8. Set RESEND_SENDER_EMAIL to:
   Royal Haven Inquiries <inquiries@royalhaven.com.ng>
9. Save and redeploy
