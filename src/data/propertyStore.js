import { supabaseApi } from './supabaseApi';

const STORAGE_KEY = "royalhaven_properties";

export const propertyStore = {
  // Synchronous read (starts with empty array: no default properties)
  getProperties: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  },

  // Async load that checks Supabase first, then syncs local storage
  fetchPropertiesAsync: async () => {
    if (supabaseApi.isAvailable()) {
      const cloudProps = await supabaseApi.fetchProperties();
      if (cloudProps && Array.isArray(cloudProps)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProps));
        return cloudProps;
      }
    }
    return propertyStore.getProperties();
  },

  saveProperty: async (propData) => {
    const properties = propertyStore.getProperties();
    const isEditing = Boolean(propData.id);

    let savedProp;
    if (isEditing) {
      savedProp = {
        ...propData,
        updatedAt: new Date().toISOString()
      };
      const idx = properties.findIndex(p => p.id === propData.id);
      if (idx !== -1) {
        properties[idx] = savedProp;
      } else {
        properties.unshift(savedProp);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

      if (supabaseApi.isAvailable()) {
        supabaseApi.updateProperty(savedProp);
      }
    } else {
      savedProp = {
        ...propData,
        id: `prop-${Date.now()}`,
        slug: propData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        createdAt: new Date().toISOString()
      };
      properties.unshift(savedProp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

      if (supabaseApi.isAvailable()) {
        supabaseApi.insertProperty(savedProp);
      }
    }

    return savedProp;
  },

  deleteProperty: async (id) => {
    let properties = propertyStore.getProperties();
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

    if (supabaseApi.isAvailable()) {
      supabaseApi.deleteProperty(id);
    }
    return true;
  }
};
