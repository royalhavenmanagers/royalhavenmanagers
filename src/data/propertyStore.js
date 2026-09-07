import { supabaseApi } from './supabaseApi';

const STORAGE_KEY = "royalhaven_properties";

const DEFAULT_PROPERTIES = [
  {
    id: "prop-ikeja-01",
    title: "Royal Crest Heights - 3 Bedroom Luxury Apartment",
    slug: "royal-crest-heights-ikeja-gra",
    location: "Isaac John Street, Ikeja GRA, Lagos",
    price: "₦4,500,000 / annum",
    propertyType: "Luxury Apartment",
    listingType: "For Rent",
    bedrooms: 3,
    bathrooms: 3,
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    status: "Available",
    description: "Executive 3-bedroom serviced apartment with ensuite rooms, fitted kitchen, 24/7 security, dedicated transformer, and automated water treatment."
  },
  {
    id: "prop-magodo-02",
    title: "Haven Terraces - 4 Bedroom Semi-Detached Terrace",
    slug: "haven-terraces-magodo-gra-phase-2",
    location: "Bashiru Shittu Avenue, Magodo GRA Phase 2, Lagos",
    price: "₦6,500,000 / annum",
    propertyType: "Terrace Duplex",
    listingType: "For Rent",
    bedrooms: 4,
    bathrooms: 5,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    status: "Available",
    description: "Contemporary 4-bedroom terrace duplex in a serene gated close with stamped concrete floors, CCTV surveillance, private compound, and BQ."
  },
  {
    id: "prop-lekki-03",
    title: "Crown Court Residences - 5 Bedroom Detached Duplex",
    slug: "crown-court-residences-lekki-phase-1",
    location: "Off Admiralty Way, Lekki Phase 1, Lagos",
    price: "₦12,000,000 / annum",
    propertyType: "Detached Duplex",
    listingType: "For Rent",
    bedrooms: 5,
    bathrooms: 6,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    status: "Available",
    description: "Magnificent 5-bedroom detached home featuring a swimming pool, spacious family lounge, smart home automation, and 24-hour facility management."
  }
];

export const propertyStore = {
  // Synchronous read (defaults to verified showcase properties)
  getProperties: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_PROPERTIES;
    } catch {
      return DEFAULT_PROPERTIES;
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
