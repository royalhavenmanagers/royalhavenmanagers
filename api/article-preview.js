// Vercel Serverless Function to dynamically inject Open Graph & Twitter meta tags
// for article social shares (WhatsApp, Twitter/X, Facebook, LinkedIn, iMessage, Telegram, etc.)

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
    summary: "Conducting thorough multi-stage background checks and document verification is the single most effective way to protect your rental income and property integrity."
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
    summary: "Routine inspections, proactive maintenance, and transparent financial remittance prevent asset decay while optimizing long-term rental income."
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
    summary: "Accurate survey reports and valuation audits support informed decision-making, secure bank financing, and prevent land boundary disputes."
  }
];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pspftbflzfkbpndvhike.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGZ0YmZsemZrYnBuZHZoaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjkzNjQsImV4cCI6MjEwMzk0NTM2NH0.OmVIINkXoqf9bnJQp9TQNfrimOnyOwskhpqIi9QnYm4';

async function fetchArticleFromSupabase(targetSlug) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const encoded = encodeURIComponent(targetSlug);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?or=(slug.eq.${encoded},id.eq.${encoded})&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return {
          id: item.id,
          title: item.title,
          slug: item.slug || item.id,
          category: item.category || 'Real Estate Insight',
          coverImage: item.cover_image || item.coverImage,
          author: item.author || 'Royal Haven Realty & Property Managers Ltd.',
          date: item.date,
          readTime: item.read_time || item.readTime || '5 min read',
          summary: item.summary || item.title
        };
      }
    }
  } catch (err) {
    console.warn('Supabase article fetch notice:', err.message);
  }
  return null;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  // Extract slug from query parameters or URL path
  let slug = req.query?.slug;
  if (!slug && req.url) {
    const match = req.url.match(/\/articles?\/([^?&#]+)/);
    if (match) {
      slug = match[1];
    }
  }

  if (slug) {
    slug = decodeURIComponent(slug).trim().replace(/^articles?\//, '');
  }

  // 1. Look up article in DEFAULT_ARTICLES
  let article = null;
  if (slug) {
    article = DEFAULT_ARTICLES.find(
      a => a.slug.toLowerCase() === slug.toLowerCase() || a.id.toLowerCase() === slug.toLowerCase()
    );

    // 2. If not found in defaults, query Supabase
    if (!article) {
      article = await fetchArticleFromSupabase(slug);
    }
  }

  const siteDomain = 'https://www.royalhaven.com.ng';

  // Fallback if article not found
  if (!article) {
    const fallbackTitle = "Royal Haven Realty & Property Managers Ltd. | Property Insights";
    const fallbackDesc = "Building Trust. Managing Excellence. Creating Value. Premier property management, tenant screening, and rent remittance across Nigeria.";
    const fallbackImage = `${siteDomain}/images/og-image.jpg`;

    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(fallbackTitle)}</title>
  <meta property="og:title" content="${escapeHtml(fallbackTitle)}">
  <meta property="og:description" content="${escapeHtml(fallbackDesc)}">
  <meta property="og:image" content="${fallbackImage}">
  <meta property="og:url" content="${siteDomain}">
  <meta name="twitter:card" content="summary_large_image">
  <script>window.location.replace('/#blog');</script>
</head>
<body style="background:#08080A;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
  <h2>Royal Haven Realty & Property Managers Ltd.</h2>
  <p><a href="/#blog" style="color:#D4AF37;">Click here to browse our real estate articles</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(fallbackHtml);
  }

  // Ensure cover image is an absolute URL
  let coverImage = article.coverImage || `${siteDomain}/images/og-image.jpg`;
  if (coverImage.startsWith('/')) {
    coverImage = `${siteDomain}${coverImage}`;
  }

  const articleUrl = `${siteDomain}/article/${article.slug}`;
  const directAppUrl = `/?article=${encodeURIComponent(article.slug)}#blog`;
  const fullRedirectUrl = `${siteDomain}${directAppUrl}`;

  const title = `${article.title} | Royal Haven Realty`;
  const rawTitle = article.title;
  const description = article.summary || "Insightful real estate analysis, property management, and asset protection by Royal Haven Realty & Property Managers Ltd.";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(article.author || 'Royal Haven Realty & Property Managers Ltd.')}">
  <link rel="canonical" href="${articleUrl}">

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
  <meta property="og:site_name" content="Royal Haven Realty & Property Managers Ltd.">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(rawTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${coverImage}">
  <meta property="og:image:secure_url" content="${coverImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(rawTitle)}">
  <meta property="og:url" content="${articleUrl}">
  <meta property="article:published_time" content="${article.date || '2026-08-28'}">
  <meta property="article:section" content="${escapeHtml(article.category || 'Property Management')}">

  <!-- Twitter / X Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(rawTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${coverImage}">
  <meta name="twitter:image:alt" content="${escapeHtml(rawTitle)}">

  <!-- Instant Client-Side Redirection for Real Human Visitors -->
  <script>
    (function() {
      // Immediate seamless redirect into Royal Haven interactive reader modal
      window.location.replace(${JSON.stringify(directAppUrl)});
    })();
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${directAppUrl}">
  </noscript>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08080A;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 640px;
      width: 100%;
      background: #121217;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      text-align: left;
    }
    .image-wrap {
      width: 100%;
      height: 280px;
      position: relative;
      background: #000;
      overflow: hidden;
    }
    .image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(8, 8, 10, 0.85);
      color: #D4AF37;
      border: 1px solid #D4AF37;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content {
      padding: 28px;
    }
    h1 {
      font-size: 22px;
      line-height: 1.4;
      color: #FFFFFF;
      margin-bottom: 12px;
      font-family: Georgia, serif;
    }
    p {
      color: #94A3B8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%);
      color: #08080A;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      border-radius: 8px;
      text-decoration: none;
      text-transform: uppercase;
      transition: opacity 0.2s ease;
    }
    .btn:hover {
      opacity: 0.92;
    }
    .redirect-note {
      text-align: center;
      font-size: 12px;
      color: #64748B;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="image-wrap">
      <img src="${coverImage}" alt="${escapeHtml(rawTitle)}">
      <span class="badge">${escapeHtml(article.category || 'Insight')}</span>
    </div>
    <div class="content">
      <h1>${escapeHtml(rawTitle)}</h1>
      <p>${escapeHtml(description)}</p>
      <a href="${directAppUrl}" class="btn">Read Full Article on Royal Haven &rarr;</a>
      <div class="redirect-note">Opening Royal Haven interactive reader...</div>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache at edge for 10 minutes, serve stale up to 1 day
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
