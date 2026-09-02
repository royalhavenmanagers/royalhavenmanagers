// Zero-dependency Supabase REST API client using native browser fetch

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("your_project_url"));

const getHeaders = () => ({
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=representation"
});

export const supabaseApi = {
  isAvailable: () => isConfigured,

  fetchPosts: async () => {
    if (!isConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=date.desc`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`Supabase error: ${res.statusText}`);
      const data = await res.json();
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        coverImage: item.cover_image || item.coverImage,
        author: item.author,
        date: item.date,
        readTime: item.read_time || item.readTime,
        status: item.status,
        summary: item.summary,
        content: item.content
      }));
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
      return null;
    }
  },

  insertPost: async (post) => {
    if (!isConfigured) return null;
    try {
      const payload = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        cover_image: post.coverImage,
        author: post.author,
        date: post.date,
        read_time: post.readTime,
        status: post.status,
        summary: post.summary,
        content: post.content
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Supabase insert error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.error("Error inserting to Supabase:", err);
      return null;
    }
  },

  updatePost: async (post) => {
    if (!isConfigured) return null;
    try {
      const payload = {
        title: post.title,
        slug: post.slug,
        category: post.category,
        cover_image: post.coverImage,
        author: post.author,
        date: post.date,
        read_time: post.readTime,
        status: post.status,
        summary: post.summary,
        content: post.content
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Supabase update error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.error("Error updating in Supabase:", err);
      return null;
    }
  },

  deletePost: async (id) => {
    if (!isConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`Supabase delete error: ${res.statusText}`);
      return true;
    } catch (err) {
      console.error("Error deleting from Supabase:", err);
      return false;
    }
  }
};
