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
  },

  // --- Properties CRUD ---
  fetchProperties: async () => {
    if (!isConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=*&order=created_at.desc`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        // If table doesn't exist yet, return empty array without throwing
        return null;
      }
      const data = await res.json();
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        location: item.location,
        price: item.price,
        propertyType: item.property_type || item.propertyType,
        listingType: item.listing_type || item.listingType || 'For Rent',
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        coverImage: item.cover_image || item.coverImage,
        status: item.status || 'Available',
        description: item.description || ''
      }));
    } catch (err) {
      console.warn("Notice: Supabase properties table not yet reachable:", err.message);
      return null;
    }
  },

  insertProperty: async (prop) => {
    if (!isConfigured) return null;
    try {
      const payload = {
        id: prop.id,
        title: prop.title,
        slug: prop.slug,
        location: prop.location,
        price: prop.price,
        property_type: prop.propertyType,
        listing_type: prop.listingType || 'For Rent',
        bedrooms: prop.bedrooms ? parseInt(prop.bedrooms, 10) : 0,
        bathrooms: prop.bathrooms ? parseInt(prop.bathrooms, 10) : 0,
        cover_image: prop.coverImage,
        status: prop.status || 'Available',
        description: prop.description || ''
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/properties`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Supabase insert property error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn("Notice: Unable to insert to Supabase properties table:", err.message);
      return null;
    }
  },

  updateProperty: async (prop) => {
    if (!isConfigured) return null;
    try {
      const payload = {
        title: prop.title,
        slug: prop.slug,
        location: prop.location,
        price: prop.price,
        property_type: prop.propertyType,
        listing_type: prop.listingType || 'For Rent',
        bedrooms: prop.bedrooms ? parseInt(prop.bedrooms, 10) : 0,
        bathrooms: prop.bathrooms ? parseInt(prop.bathrooms, 10) : 0,
        cover_image: prop.coverImage,
        status: prop.status || 'Available',
        description: prop.description || ''
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/properties?id=eq.${prop.id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Supabase update property error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn("Notice: Unable to update Supabase properties table:", err.message);
      return null;
    }
  },

  deleteProperty: async (id) => {
    if (!isConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/properties?id=eq.${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`Supabase delete property error: ${res.statusText}`);
      return true;
    } catch (err) {
      console.warn("Notice: Unable to delete from Supabase properties table:", err.message);
      return false;
    }
  }
};

