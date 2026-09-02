# Royal Haven Project Tasks and Details

This file lists what is done, what you need to provide, and how to set up the Brevo email and Supabase database.

---

## 1. What Has Been Built Already

- Website frontend with clean white and gold luxury style
- Navigation header with direct contact info and admin link
- Hero section refocused solely on **Property Management & Asset Protection**
- Enhanced typography contrast with distinct light & dark gold gradients (`text-gold-gradient-light`)
- About section with vision, mission, and core values (all sales/selling references removed)
- Services section with 8 focused property management services (including Facility & Maintenance Management)
- Management process section with 6-step workflow
- Leadership section with interactive photo switcher
- **4 Genuine Corporate & Brand Partners** integrated with logos:
  1. Habibi's Fitz
  2. Olamide Skin Beauty
  3. Swan Luxury
  4. Marvel Develops
- Client reviews section
- Public blog page with search and category filters
- Admin portal login at `royalhaven.com.ng/#admin`
- Consultation Modal hooked up to `/api/contact`
- **Backend API & Email Integration (Zero New Packages)**:
  - `server/apiHandler.js` handling Brevo transactional emails and Supabase lead logging via native fetch
  - Vite dev server middleware in `vite.config.js` for instant local testing
  - Zero-dependency production server in `server.js` (`npm run server`)
- Environment configuration file (`.env` and `.env.example`) for Brevo and Supabase keys

---

## 2. Details and Assets Needed From You

Please provide the following items when ready:

1. **CEO / Managing Director**: Full name and exact title
2. **Associate Partner**: Full name and exact title

---

## 3. Brevo (Sendinblue) Email Setup

To have all consultation requests automatically emailed to your team inbox via Brevo:

1. Sign up or log into [Brevo](https://app.brevo.com/)
2. Navigate to **Account** -> **SMTP & API Keys** -> [Generate API Key](https://app.brevo.com/settings/keys/api)
3. Paste the key into your `.env` file:
   ```env
   BREVO_API_KEY=xkeysib-your_real_key_here
   BREVO_SENDER_EMAIL=info@royalhaven.com.ng
   BREVO_RECEIVER_EMAIL=royalhavenrealtyproperty@gmail.com
   ```

---

## 4. Supabase Database Setup Details

To connect your blog and consultation leads to a free Supabase cloud database:

Step 1: Go to [supabase.com](https://supabase.com) and create a free project named `RoyalHaven`
Step 2: In Project Settings -> API, copy:
- **Project URL**
- **Project Anon Public Key**
Step 3: Paste them into `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### SQL Tables Setup for Supabase
In your Supabase dashboard, open the **SQL Editor**, paste this SQL code, and click **Run**:

```sql
-- 1. Blog Posts Table
create table if not exists posts (
  id text primary key,
  title text not null,
  slug text not null,
  category text not null,
  cover_image text,
  author text,
  date text,
  read_time text,
  status text default 'published',
  summary text,
  content text
);

alter table posts enable row level security;
create policy "Allow public read access" on posts for select using (true);
create policy "Allow all actions for admin" on posts for all using (true);

-- 2. Consultation Leads Table
create table if not exists inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text not null,
  service text,
  location text,
  notes text,
  created_at timestamptz default now()
);

alter table inquiries enable row level security;
create policy "Allow public insert" on inquiries for insert with check (true);
create policy "Allow admin read inquiries" on inquiries for select using (true);
```

---

## 5. Next Steps

1. Fill in the team member names (CEO and Associate Partner)
2. Add your Brevo API key and Supabase credentials to `.env`
3. Review the website and confirm!
