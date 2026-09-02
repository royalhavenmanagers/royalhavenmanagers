import { supabaseApi } from './supabaseApi';

// Initial verified articles based on Royal Haven Realty & Property Managers Ltd. profile
const DEFAULT_ARTICLES = [
  {
    id: "blog-1",
    title: "Key Things Property Owners in Lagos & Ogun State Must Know About Tenant Screening",
    slug: "key-things-about-tenant-screening-lagos-ogun",
    category: "Tenant Screening",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    author: "Ibrahim Ridwan Olasunkanmi (CEO & MD)",
    date: "2026-08-28",
    readTime: "4 min read",
    status: "published",
    summary: "Conducting thorough multi-stage background checks and document verification is the single most effective way to protect your rental income and property integrity.",
    content: `
### Protecting Your Investment Through Rigorous Vetting

For real estate owners across Lagos State, Ogun State, and surrounding environs, securing reliable tenants is essential to maintaining property value and guaranteeing consistent rental income.

#### Why Informal Screening Fails
Relying solely on informal interviews or verbal promises often leads to delayed rent remittances, unmanaged property damage, and legal complications.

#### The Royal Haven 4-Point Vetting Protocol
1. **Identity & Official Document Verification:** Confirming government-issued identification and legal standing.
2. **Employment & Income Audit:** Verifying stable employment or business registration to ensure rental affordability.
3. **Past Landlord & Character References:** Auditing past tenancy history for compliance and cleanliness.
4. **Custom Tenancy Agreement Drafting:** Structuring legally binding agreements that protect the landlord's asset rights.

By partnering with professional property managers, landlords ensure peace of mind knowing their property is in reliable hands.
`
  },
  {
    id: "blog-2",
    title: "How Professional Property Management Maximizes Rental Yield & Long-Term Asset Value",
    slug: "how-professional-property-management-maximizes-rental-yield",
    category: "Property Management",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    author: "Ibrahim Ridwan Olasunkanmi (CEO & MD)",
    date: "2026-08-25",
    readTime: "5 min read",
    status: "published",
    summary: "Routine inspections, proactive maintenance, and transparent financial remittance prevent asset decay while optimizing long-term rental income.",
    content: `
### Property Management Beyond Rent Collection

Many landlords assume property management is simply collecting annual rent. In reality, true property management is an active financial safeguard.

#### Preventative Maintenance vs. Reactive Repairs
Minor plumbing leaks or structural wear left uninspected can quickly escalate into major structural damage. Scheduled physical inspections preserve property standards and prevent costly emergency repairs.

#### Key Benefits of Professional Management
- **Prompt Rent Remittance:** Transparent accounting statements and direct remittance to property owners.
- **Vacancy Reduction:** Active marketing and quick turnover procedures to keep units occupied.
- **Regulatory Compliance:** Ensuring compliance with local state housing laws and estate rules.

At Royal Haven Realty & Property Managers Ltd., every property under our care is managed with the exact level of commitment as if it were our own.
`
  },
  {
    id: "blog-3",
    title: "The Importance of Accurate Estate Surveying and Valuation Reports Before Investing",
    slug: "importance-of-estate-surveying-and-valuation-reports",
    category: "Estate Surveying",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    author: "Royal Haven Valuation Team",
    date: "2026-08-20",
    readTime: "6 min read",
    status: "published",
    summary: "Accurate survey reports and valuation audits support informed decision-making, secure bank financing, and prevent land boundary disputes.",
    content: `
### Making Data-Driven Real Estate Investment Decisions

Whether purchasing residential duplexes, apartment complexes, or commercial office spaces, understanding the exact legal boundary and market value of an asset is crucial.

#### What an Estate Survey & Valuation Covers
- **Boundary Verification:** Confirming physical survey beacons against official land registry records.
- **Current Market Valuation:** Assessing rental income potential, comparable sales data, and structural condition.
- **Legal Protection:** Verifying title documents (Deed of Assignment, Governor's Consent, Certificate of Occupancy).

Professional estate surveying gives investors and property owners total confidence in their acquisitions.
`
  }
];

const STORAGE_KEY = "royalhaven_blog_posts";
const AUTH_KEY = "royalhaven_admin_auth";
const ADMIN_PASSWORD_KEY = "royalhaven_admin_password";
const DEFAULT_PASSWORD = "royalhaven2026";

export const blogStore = {
  getPosts: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading blog store:", e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
    return DEFAULT_ARTICLES;
  },

  // Async load that checks Supabase first, then syncs local storage
  fetchPostsAsync: async () => {
    if (supabaseApi.isAvailable()) {
      const cloudPosts = await supabaseApi.fetchPosts();
      if (cloudPosts && cloudPosts.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudPosts));
        return cloudPosts;
      }
    }
    return blogStore.getPosts();
  },

  getPublishedPosts: () => {
    const posts = blogStore.getPosts();
    return posts.filter(p => p.status === "published");
  },

  savePost: async (postData) => {
    const posts = blogStore.getPosts();
    let updated;
    let targetPost;
    
    if (postData.id) {
      // Edit existing
      targetPost = { ...postData, date: new Date().toISOString().split('T')[0] };
      updated = posts.map(p => p.id === postData.id ? targetPost : p);
      if (supabaseApi.isAvailable()) {
        supabaseApi.updatePost(targetPost);
      }
    } else {
      // Create new
      targetPost = {
        ...postData,
        id: `blog-${Date.now()}`,
        slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        date: new Date().toISOString().split('T')[0],
        readTime: `${Math.max(3, Math.ceil((postData.content || '').split(' ').length / 150))} min read`,
        status: postData.status || "published",
        author: postData.author || "Royal Haven Management Team"
      };
      updated = [targetPost, ...posts];
      if (supabaseApi.isAvailable()) {
        supabaseApi.insertPost(targetPost);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deletePost: async (id) => {
    const posts = blogStore.getPosts();
    const updated = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (supabaseApi.isAvailable()) {
      supabaseApi.deletePost(id);
    }
    return updated;
  },

  togglePublishStatus: async (id) => {
    const posts = blogStore.getPosts();
    let target;
    const updated = posts.map(p => {
      if (p.id === id) {
        target = { ...p, status: p.status === "published" ? "draft" : "published" };
        return target;
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (supabaseApi.isAvailable() && target) {
      supabaseApi.updatePost(target);
    }
    return updated;
  },

  // Auth Methods (Password-only with customizable password)
  isAuthenticated: () => {
    return localStorage.getItem(AUTH_KEY) === "true";
  },

  getAdminPassword: () => {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
  },

  login: (password) => {
    const currentPwd = blogStore.getAdminPassword();
    if (password && password.trim() === currentPwd.trim()) {
      localStorage.setItem(AUTH_KEY, "true");
      return { success: true };
    }
    return { success: false, error: "Incorrect admin password. Please try again." };
  },

  changePassword: (oldPassword, newPassword) => {
    const currentPwd = blogStore.getAdminPassword();
    if (!oldPassword || oldPassword.trim() !== currentPwd.trim()) {
      return { success: false, error: "Current password does not match." };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: "New password must be at least 6 characters." };
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    return { success: true, message: "Admin password successfully updated!" };
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
