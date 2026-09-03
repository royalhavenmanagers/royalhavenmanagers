# What Next To Do

### 1. Google Search Console
Your canonical website is https://www.royalhaven.com.ng/
1. Go to https://search.google.com/search-console
2. In the top left property dropdown, click Add Property
3. Choose URL prefix and enter: https://www.royalhaven.com.ng/
4. If Google asks for an HTML tag verification, copy the code and send it here to be added
5. In the left menu, click Sitemaps
6. In the box, type: sitemap.xml
7. Click Submit

### 2. Google Business Profile
1. Go to https://business.google.com/create
2. Name: Royal Haven Realty & Property Managers Ltd.
3. Category: Property Management Company
4. Service areas: Lagos State, Ogun State
5. Phone: +234 815 378 5297
6. Website: https://www.royalhaven.com.ng/
7. Complete the phone or video verification

### 3. Resend Email Activation
1. Go to https://resend.com/api-keys
2. Create an API key named Royal Haven
3. Copy the key starting with re_
4. Paste it into your .env file as RESEND_API_KEY=re_your_key
5. If hosted online on Vercel or Netlify, also paste RESEND_API_KEY into your hosting environment variables

### 4. Supabase Database Activation
1. Go to https://supabase.com/dashboard/project/pspftbflzfkbpndvhike/sql/new
2. Open supabase_schema.sql from the project
3. Copy all lines and paste into the Supabase SQL box
4. Click Run
