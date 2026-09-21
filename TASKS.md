# What Next To Do

### 1. Google Search Console & Rich Snippet Testing
Your canonical website is https://www.royalhaven.com.ng/
1. Go to https://search.google.com/search-console
2. In the top left property dropdown, click **Add Property**
3. Choose **URL prefix** and enter: `https://www.royalhaven.com.ng/`
4. In the left menu, click **Sitemaps**
5. In the box, type: `sitemap.xml` and click **Submit**
6. **Verify Google FAQ Rich Snippets**:
   - Go to Google's [Rich Results Test Tool](https://search.google.com/test/rich-results)
   - Enter `https://www.royalhaven.com.ng/` and click **Test URL**
   - Confirm that the `FAQPage` and `RealEstateAgent` structured data are detected with 0 errors.

### 2. Google Business Profile
1. Go to https://business.google.com/create
2. Name: `Royal Haven Realty & Property Managers Ltd.`
3. Category: Property Management Company
4. Service areas: Lagos State, Ogun State
5. Phone: `+234 815 378 5297`
6. Website: `https://www.royalhaven.com.ng/`
7. Complete the phone or video verification

### 3. Supabase Database Activation (Optional Cloud Sync)
*Note: The website already works seamlessly with full offline & persistent storage.*
If you want to sync all tables to your Supabase cloud SQL dashboard:
1. Go to https://supabase.com/dashboard/project/pspftbflzfkbpndvhike/sql/new
2. Open `supabase_schema_portal.sql` from the project root
3. Copy all lines and paste into the Supabase SQL editor box
4. Click **Run**

### 4. Enable Client Auto-Confirmation Emails (Resend Domain Setup)
To allow the consultation form to send automated confirmation emails to client inboxes:
1. Go to https://resend.com/domains
2. Click **Add Domain** and enter `royalhaven.com.ng`
3. Add the 3 DNS records provided by Resend to your domain registrar (Namecheap, Whogohost, GoDaddy, etc.)
4. Once verified, update `RESEND_SENDER_EMAIL` in your Vercel Environment Variables to `Royal Haven <inquiries@royalhaven.com.ng>`
*(See full detailed instructions in `HUMAN_TASKS.md`)*

### 5. Supabase Auth Redirect URLs (Owner Portal Reset Link)
1. Go to https://supabase.com/dashboard/project/pspftbflzfkbpndvhike/auth/url-configuration
2. Set **Site URL** to `https://www.royalhaven.com.ng`
3. Add Redirect URLs: `https://www.royalhaven.com.ng/*` and `https://www.royalhaven.com.ng/portal`
4. Click **Save**
