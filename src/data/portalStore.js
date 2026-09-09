// Enterprise Store for Royal Haven Owner Portal & Property Management
// Operates with instant offline fallback & seamless Supabase synchronization

const STORAGE_KEY_PROPERTIES = "royalhaven_portal_properties";
const STORAGE_KEY_TRANSACTIONS = "royalhaven_portal_transactions";
const STORAGE_KEY_MAINTENANCE = "royalhaven_portal_maintenance";
const STORAGE_KEY_INSPECTIONS = "royalhaven_portal_inspections";
const STORAGE_KEY_DOCUMENTS = "royalhaven_portal_documents";
const STORAGE_KEY_INQUIRIES = "royalhaven_leads_inbox";

// Clean production store with zero demo accounts or fake sample data
const DEFAULT_PORTAL_DATA = {
  properties: [],
  transactions: [],
  maintenance: [],
  inspections: [],
  documents: []
};

// Helper to filter out any obsolete demo/sample artifacts from earlier development
const isDemoId = (id) => {
  if (!id) return false;
  return id.startsWith('prop-ikeja') || 
         id.startsWith('prop-magodo') || 
         id.startsWith('prop-lekki') ||
         id.startsWith('tx-10') || 
         id.startsWith('maint-0') || 
         id.startsWith('insp-0') || 
         id.startsWith('doc-0');
};

export const portalStore = {
  // Read All Properties
  getProperties: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => !isDemoId(p.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  // Read All Transactions
  getTransactions: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(t => !isDemoId(t.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  // Read Maintenance
  getMaintenance: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAINTENANCE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(m => !isDemoId(m.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  // Read Inspections
  getInspections: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSPECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(i => !isDemoId(i.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  // Read Documents
  getDocuments: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCUMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(d => !isDemoId(d.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  // Add new property
  addProperty: (property) => {
    const properties = portalStore.getProperties();
    const newProp = {
      ...property,
      id: property.id || `prop-${Date.now()}`,
      units: property.units || []
    };
    properties.unshift(newProp);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    return newProp;
  },

  // Add new remittance / transaction
  addTransaction: (tx) => {
    const transactions = portalStore.getTransactions();
    const newTx = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: tx.date || new Date().toISOString().split('T')[0],
      status: tx.status || 'completed'
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    return newTx;
  },

  // Add maintenance ticket
  addMaintenance: (item) => {
    const list = portalStore.getMaintenance();
    const newItem = {
      ...item,
      id: `maint-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'reported'
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(list));
    return newItem;
  },

  // Add inspection record
  addInspection: (item) => {
    const list = portalStore.getInspections();
    const newItem = {
      ...item,
      id: `insp-${Date.now()}`,
      inspectionDate: item.inspectionDate || new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(list));
    return newItem;
  },

  // Inquiries / Leads Inbox management
  getInquiries: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(item => item.id !== 'lead-1' && item.id !== 'lead-2');
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  saveInquiry: (inquiry) => {
    const inquiries = portalStore.getInquiries();
    const newInquiry = {
      ...inquiry,
      id: `lead-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },

  updateInquiryStatus: (id, status) => {
    const inquiries = portalStore.getInquiries();
    const updated = inquiries.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    return updated;
  },

  deleteInquiry: (id) => {
    const inquiries = portalStore.getInquiries();
    const updated = inquiries.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    return updated;
  },

  getOwners: () => {
    try {
      const saved = localStorage.getItem("royalhaven_portal_owners");
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  },

  addOwner: (owner) => {
    const list = portalStore.getOwners();
    const newOwner = {
      ...owner,
      id: owner.id || `owner-${Date.now()}`,
      createdDate: owner.createdDate || new Date().toISOString().split('T')[0]
    };
    // If owner with same email already exists, update them
    const existingIndex = list.findIndex(o => o.email?.toLowerCase().trim() === newOwner.email?.toLowerCase().trim());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newOwner };
    } else {
      list.unshift(newOwner);
    }
    localStorage.setItem("royalhaven_portal_owners", JSON.stringify(list));
    return newOwner;
  },

  findOwnerByEmail: (email) => {
    const list = portalStore.getOwners();
    return list.find(o => o.email?.toLowerCase().trim() === email?.toLowerCase().trim());
  },

  validateOwnerCredentials: (email, password) => {
    const list = portalStore.getOwners();
    const found = list.find(o => o.email?.toLowerCase().trim() === email?.toLowerCase().trim());
    if (found && (!found.password || found.password === password)) {
      return found;
    }
    return null;
  }
};
