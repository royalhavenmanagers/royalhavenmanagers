// Enterprise Store for Royal Haven Owner Portal & Property Management
// Operates with instant offline fallback & seamless Supabase synchronization

const STORAGE_KEY_PROPERTIES = "royalhaven_portal_properties";
const STORAGE_KEY_TRANSACTIONS = "royalhaven_portal_transactions";
const STORAGE_KEY_MAINTENANCE = "royalhaven_portal_maintenance";
const STORAGE_KEY_INSPECTIONS = "royalhaven_portal_inspections";
const STORAGE_KEY_DOCUMENTS = "royalhaven_portal_documents";
const STORAGE_KEY_INQUIRIES = "royalhaven_leads_inbox";
const STORAGE_KEY_ONBOARDING_SUBMISSIONS = "royalhaven_portal_onboarding_submissions";
const STORAGE_KEY_OWNERS = "royalhaven_portal_owners";

let isSyncing = false;
let syncDebounceTimer = null;

const notifyListeners = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('portalStoreUpdated', {
      detail: {
        properties: portalStore.getProperties(),
        transactions: portalStore.getTransactions(),
        inspections: portalStore.getInspections(),
        documents: portalStore.getDocuments(),
        maintenance: portalStore.getMaintenance(),
        owners: portalStore.getOwners(),
        onboardingSubmissions: portalStore.getOnboardingSubmissions()
      }
    }));
    window.dispatchEvent(new Event('storage'));
  }
};

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
  // Read All Properties (with deduplication)
  getProperties: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => !isDemoId(p.id));
          // Deduplicate by ID and by (name + owner)
          const seenIds = new Set();
          const seenKey = new Set();
          const deduplicated = [];
          for (const p of cleaned) {
            if (!p || !p.id) continue;
            const normKey = `${(p.name || '').toLowerCase().trim()}:::${(p.ownerEmail || p.ownerId || '').toLowerCase().trim()}`;
            if (seenIds.has(p.id) || (normKey !== ':::' && seenKey.has(normKey))) {
              continue;
            }
            seenIds.add(p.id);
            if (normKey !== ':::') seenKey.add(normKey);
            deduplicated.push(p);
          }
          if (deduplicated.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(deduplicated));
          }
          return deduplicated;
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

  // Add Document / Report
  addDocument: (doc) => {
    const list = portalStore.getDocuments();
    const newDoc = {
      ...doc,
      id: doc.id || `doc-${Date.now()}`,
      date: doc.date || new Date().toISOString().split('T')[0],
      fileSize: doc.fileSize || 'Digital Document'
    };
    list.unshift(newDoc);
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(list));
    notifyListeners();
    portalStore.pushToCloud();
    return newDoc;
  },

  deleteDocument: (id) => {
    const list = portalStore.getDocuments();
    const updated = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  // Add new property (Idempotent - avoids accidental duplication)
  addProperty: (property) => {
    const properties = portalStore.getProperties();
    const cleanName = (property.name || '').toLowerCase().trim();
    const cleanEmail = (property.ownerEmail || '').toLowerCase().trim();

    const existingIndex = properties.findIndex(p => 
      (property.id && p.id === property.id) ||
      (cleanName && p.name?.toLowerCase().trim() === cleanName && (!cleanEmail || p.ownerEmail?.toLowerCase().trim() === cleanEmail))
    );

    let result;
    if (existingIndex >= 0) {
      // Merge & update existing record rather than creating a duplicate
      properties[existingIndex] = {
        ...properties[existingIndex],
        ...property,
        units: property.units && property.units.length > 0 ? property.units : properties[existingIndex].units
      };
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
      result = properties[existingIndex];
    } else {
      const newProp = {
        ...property,
        id: property.id || `prop-${Date.now()}`,
        units: property.units || []
      };
      properties.unshift(newProp);
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
      result = newProp;
    }

    notifyListeners();
    portalStore.pushToCloud();
    return result;
  },

  // Update existing property & its units
  updateProperty: (id, updates) => {
    const properties = portalStore.getProperties();
    const updated = properties.map(p => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  deleteProperty: (id) => {
    const properties = portalStore.getProperties();
    const target = properties.find(p => p.id === id);
    const updated = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(updated));

    // Also unassign from owners so their profiles don't reference a deleted property
    if (target) {
      const owners = portalStore.getOwners();
      const updatedOwners = owners.map(o => {
        if (!o.assignedProperties || !Array.isArray(o.assignedProperties)) return o;
        return {
          ...o,
          assignedProperties: o.assignedProperties.filter(
            name => name && name.toLowerCase().trim() !== target.name.toLowerCase().trim() && name !== id
          )
        };
      });
      localStorage.setItem(STORAGE_KEY_OWNERS, JSON.stringify(updatedOwners));
    }
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  // Add new remittance / transaction
  addTransaction: (tx) => {
    const transactions = portalStore.getTransactions();
    const newTx = {
      ...tx,
      id: tx.id || `tx-${Date.now()}`,
      date: tx.date || new Date().toISOString().split('T')[0],
      status: tx.status || 'completed'
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    notifyListeners();
    portalStore.pushToCloud();
    return newTx;
  },

  // Delete remittance transaction
  deleteTransaction: (id) => {
    const transactions = portalStore.getTransactions();
    const updated = transactions.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  // Add maintenance ticket
  addMaintenance: (item) => {
    const list = portalStore.getMaintenance();
    const newItem = {
      ...item,
      id: `maint-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: item.status || 'reported'
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(list));
    notifyListeners();
    portalStore.pushToCloud();
    return newItem;
  },

  // Update maintenance ticket
  updateMaintenance: (id, updates) => {
    const list = portalStore.getMaintenance();
    const updated = list.map(m => (m.id === id ? { ...m, ...updates } : m));
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  deleteMaintenance: (id) => {
    const list = portalStore.getMaintenance();
    const updated = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
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
    notifyListeners();
    portalStore.pushToCloud();
    return newItem;
  },

  updateInspection: (id, updates) => {
    const list = portalStore.getInspections();
    const updated = list.map(i => (i.id === id ? { ...i, ...updates } : i));
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  deleteInspection: (id) => {
    const list = portalStore.getInspections();
    const updated = list.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
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
      const saved = localStorage.getItem(STORAGE_KEY_OWNERS);
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return list.map(o => ({
            ...o,
            assignedProperties: Array.from(new Set((o.assignedProperties || []).map(p => typeof p === 'string' ? p.trim() : '').filter(Boolean)))
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  addOwner: (owner, autoSyncCloud = true) => {
    const list = portalStore.getOwners();
    const sanitizedAssigned = Array.from(new Set((owner.assignedProperties || []).map(p => typeof p === 'string' ? p.trim() : '').filter(Boolean)));
    const newOwner = {
      ...owner,
      id: owner.id || `owner-${Date.now()}`,
      assignedProperties: sanitizedAssigned,
      createdDate: owner.createdDate || new Date().toISOString().split('T')[0]
    };
    // If owner with same email already exists, update them
    const existingIndex = list.findIndex(o => o.email?.toLowerCase().trim() === newOwner.email?.toLowerCase().trim());
    if (existingIndex >= 0) {
      const prevAssigned = list[existingIndex].assignedProperties || [];
      const mergedAssigned = Array.from(new Set([...prevAssigned, ...sanitizedAssigned].map(p => typeof p === 'string' ? p.trim() : '').filter(Boolean)));
      list[existingIndex] = { ...list[existingIndex], ...newOwner, assignedProperties: mergedAssigned };
    } else {
      list.unshift(newOwner);
    }
    localStorage.setItem(STORAGE_KEY_OWNERS, JSON.stringify(list));
    notifyListeners();
    if (autoSyncCloud) {
      portalStore.pushToCloud(newOwner);
    }
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
  },

  updateOwner: (id, updatedData) => {
    const list = portalStore.getOwners();
    const idx = list.findIndex(o => 
      (id && o.id === id) || 
      (updatedData.originalEmail && o.email?.toLowerCase().trim() === updatedData.originalEmail?.toLowerCase().trim()) ||
      (updatedData.email && o.email?.toLowerCase().trim() === updatedData.email?.toLowerCase().trim())
    );
    if (idx >= 0) {
      let finalAssigned = list[idx].assignedProperties || [];
      if (updatedData.assignedProperties) {
        finalAssigned = Array.from(new Set(updatedData.assignedProperties.map(p => typeof p === 'string' ? p.trim() : '').filter(Boolean)));
      }
      list[idx] = { 
        ...list[idx], 
        ...updatedData, 
        assignedProperties: finalAssigned 
      };
      localStorage.setItem(STORAGE_KEY_OWNERS, JSON.stringify(list));
      notifyListeners();
      portalStore.pushToCloud();
      return list[idx];
    }
    return null;
  },

  deleteOwner: (id) => {
    const list = portalStore.getOwners();
    const updated = list.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEY_OWNERS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  // Onboarding Submissions Queue
  getOnboardingSubmissions: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  addOnboardingSubmission: (sub) => {
    const list = portalStore.getOnboardingSubmissions();
    const newSub = {
      ...sub,
      id: sub.id || `sub-${Date.now()}`,
      date: sub.date || new Date().toISOString().split('T')[0],
      status: sub.status || 'pending'
    };
    list.unshift(newSub);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(list));
    notifyListeners();
    portalStore.pushToCloud();
    return newSub;
  },

  updateOnboardingSubmissionStatus: (id, status) => {
    const list = portalStore.getOnboardingSubmissions();
    const updated = list.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  approveOnboardingSubmission: (id) => {
    const list = portalStore.getOnboardingSubmissions();
    const sub = list.find(item => item.id === id);
    if (!sub) return null;

    const unitsCount = Math.max(1, parseInt(sub.unitsCount, 10) || 1);
    const targetRent = Number(sub.targetRent) || 0;
    const propId = `prop-${Date.now()}`;

    const newProperty = portalStore.addProperty({
      id: propId,
      name: sub.propertyName.trim(),
      address: sub.address?.trim() || '',
      city: sub.city || 'Lagos',
      state: sub.state || 'Lagos State',
      propertyType: sub.propertyType || 'Residential',
      status: 'active',
      ownerEmail: sub.ownerEmail || '',
      ownerId: sub.ownerId || '',
      unitsCount: unitsCount,
      notes: sub.notes || '',
      units: Array.from({ length: unitsCount }, (_, i) => ({
        id: `unit-${propId}-${i + 1}`,
        unitNumber: `Flat ${i + 1}`,
        floorPlanType: sub.propertyType || 'Apartment',
        rentAmount: targetRent,
        serviceCharge: 0,
        bedrooms: 3,
        bathrooms: 3,
        status: 'occupied',
        tenant: {
          fullName: 'Assigned Tenant',
          phone: '+234 800 000 0000',
          email: 'tenant@royalhaven.com.ng',
          leaseStart: new Date().toISOString().split('T')[0],
          leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentStatus: 'Paid'
        }
      }))
    });

    // Link to owner
    if (sub.ownerId || sub.ownerEmail) {
      const owners = portalStore.getOwners();
      const owner = owners.find(o => 
        (sub.ownerId && o.id === sub.ownerId) || 
        (sub.ownerEmail && o.email?.toLowerCase().trim() === sub.ownerEmail.toLowerCase().trim())
      );
      if (owner) {
        const assigned = owner.assignedProperties || [];
        if (!assigned.includes(newProperty.name)) {
          portalStore.updateOwner(owner.id, {
            assignedProperties: [...assigned, newProperty.name]
          });
        }
      }
    }

    // Mark submission approved
    const updated = list.map(item => item.id === id ? { ...item, status: 'approved', propertyId: propId } : item);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();

    return { property: newProperty, submission: sub };
  },

  deleteOnboardingSubmission: (id) => {
    const list = portalStore.getOnboardingSubmissions();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(updated));
    notifyListeners();
    portalStore.pushToCloud();
    return updated;
  },

  // -------------------------------------------------------------
  // Real-Time Cloud Synchronization Engine
  // -------------------------------------------------------------
  syncWithCloud: async () => {
    if (isSyncing) return false;
    isSyncing = true;

    try {
      const res = await fetch('/api/portal-sync', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        isSyncing = false;
        return false;
      }

      const json = await res.json();
      if (!json.success) {
        isSyncing = false;
        return false;
      }

      const cloudData = json.data;
      const cloudProfiles = json.profiles || [];
      let hasChanges = false;

      // 1. Sync Owners & Profiles
      const localOwners = portalStore.getOwners();
      const ownersMap = new Map();
      localOwners.forEach(o => {
        if (o.email) ownersMap.set(o.email.toLowerCase().trim(), o);
      });

      // Incorporate cloud state owners
      if (cloudData && Array.isArray(cloudData.owners)) {
        cloudData.owners.forEach(co => {
          if (!co || !co.email) return;
          const key = co.email.toLowerCase().trim();
          const existing = ownersMap.get(key);
          if (!existing) {
            ownersMap.set(key, co);
            hasChanges = true;
          } else {
            const mergedProps = Array.from(new Set([...(existing.assignedProperties || []), ...(co.assignedProperties || [])]));
            ownersMap.set(key, { ...co, ...existing, assignedProperties: mergedProps });
          }
        });
      }

      // Incorporate Supabase profiles
      cloudProfiles.forEach(cp => {
        if (!cp || !cp.email) return;
        const key = cp.email.toLowerCase().trim();
        const existing = ownersMap.get(key);
        if (!existing) {
          ownersMap.set(key, {
            id: cp.id,
            fullName: cp.full_name || 'Property Owner',
            email: cp.email,
            phone: cp.phone || '',
            role: cp.role || 'property_owner',
            bankName: cp.bank_name || '',
            accountNumber: cp.account_number || '',
            accountName: cp.account_name || cp.full_name || '',
            assignedProperties: cp.assigned_properties || [],
            createdDate: cp.created_at ? cp.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
          });
          hasChanges = true;
        } else {
          if (cp.assigned_properties && Array.isArray(cp.assigned_properties) && cp.assigned_properties.length > 0) {
            const mergedProps = Array.from(new Set([...(existing.assignedProperties || []), ...cp.assigned_properties]));
            ownersMap.set(key, { ...existing, assignedProperties: mergedProps });
          }
        }
      });

      const updatedOwnersList = Array.from(ownersMap.values());
      localStorage.setItem(STORAGE_KEY_OWNERS, JSON.stringify(updatedOwnersList));

      // 2. Sync Properties
      if (cloudData && Array.isArray(cloudData.properties)) {
        const localProps = portalStore.getProperties();
        const propsMap = new Map();
        localProps.forEach(p => propsMap.set(p.id, p));

        cloudData.properties.forEach(cp => {
          if (!cp || !cp.id) return;
          if (!propsMap.has(cp.id)) {
            propsMap.set(cp.id, cp);
            hasChanges = true;
          } else {
            const localP = propsMap.get(cp.id);
            propsMap.set(cp.id, {
              ...localP,
              ...cp,
              units: cp.units && cp.units.length > 0 ? cp.units : localP.units
            });
          }
        });
        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(Array.from(propsMap.values())));
      }

      // 3. Sync Transactions / Remittances
      if (cloudData && Array.isArray(cloudData.transactions)) {
        const localTx = portalStore.getTransactions();
        const txMap = new Map();
        localTx.forEach(t => txMap.set(t.id, t));

        cloudData.transactions.forEach(ct => {
          if (!ct || !ct.id) return;
          if (!txMap.has(ct.id)) {
            txMap.set(ct.id, ct);
            hasChanges = true;
          }
        });
        localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(Array.from(txMap.values())));
      }

      // 4. Sync Inspections
      if (cloudData && Array.isArray(cloudData.inspections)) {
        const localInsp = portalStore.getInspections();
        const inspMap = new Map();
        localInsp.forEach(i => inspMap.set(i.id, i));

        cloudData.inspections.forEach(ci => {
          if (!ci || !ci.id) return;
          if (!inspMap.has(ci.id)) {
            inspMap.set(ci.id, ci);
            hasChanges = true;
          }
        });
        localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(Array.from(inspMap.values())));
      }

      // 5. Sync Documents
      if (cloudData && Array.isArray(cloudData.documents)) {
        const localDocs = portalStore.getDocuments();
        const docsMap = new Map();
        localDocs.forEach(d => docsMap.set(d.id, d));

        cloudData.documents.forEach(cd => {
          if (!cd || !cd.id) return;
          if (!docsMap.has(cd.id)) {
            docsMap.set(cd.id, cd);
            hasChanges = true;
          }
        });
        localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(Array.from(docsMap.values())));
      }

      // 6. Sync Maintenance
      if (cloudData && Array.isArray(cloudData.maintenance)) {
        const localMaint = portalStore.getMaintenance();
        const maintMap = new Map();
        localMaint.forEach(m => maintMap.set(m.id, m));

        cloudData.maintenance.forEach(cm => {
          if (!cm || !cm.id) return;
          if (!maintMap.has(cm.id)) {
            maintMap.set(cm.id, cm);
            hasChanges = true;
          }
        });
        localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(Array.from(maintMap.values())));
      }

      notifyListeners();
      isSyncing = false;
      return true;
    } catch (err) {
      console.warn('Real-time cloud sync notice:', err.message);
      isSyncing = false;
      return false;
    }
  },

  // Push local state to cloud asynchronously (debounced)
  pushToCloud: (newOwnerPayload = null) => {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);

    syncDebounceTimer = setTimeout(async () => {
      try {
        const payload = {
          properties: portalStore.getProperties(),
          transactions: portalStore.getTransactions(),
          inspections: portalStore.getInspections(),
          documents: portalStore.getDocuments(),
          maintenance: portalStore.getMaintenance(),
          owners: portalStore.getOwners(),
          onboardingSubmissions: portalStore.getOnboardingSubmissions(),
          newOwner: newOwnerPayload
        };

        await fetch('/api/portal-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Cloud state push notice:', err.message);
      }
    }, 400);
  },

  seedDemoData: (demoOwnerId = 'owner-demo-adeleke', demoEmail = 'demo.landlord@royalhaven.com.ng') => {
    const demoPropName = 'Grand Imperial Court, Lekki Phase 1';
    const props = portalStore.getProperties();
    const existing = props.find(p => p.name === demoPropName || p.id === 'rh-demo-prop-lekki');
    
    if (!existing) {
      portalStore.addProperty({
        id: 'rh-demo-prop-lekki',
        name: demoPropName,
        address: 'Plot 14, Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos State',
        propertyType: 'Luxury Serviced Apartments',
        status: 'active',
        ownerId: demoOwnerId,
        ownerEmail: demoEmail,
        coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        unitsCount: 4,
        units: [
          {
            id: 'rh-unit-1',
            unitNumber: 'Flat 101 (3-Bed Luxury)',
            floorPlanType: '3-Bedroom Penthouse',
            rentAmount: 8000000,
            serviceCharge: 1200000,
            bedrooms: 3,
            bathrooms: 3,
            status: 'occupied',
            tenant: {
              fullName: 'Engr. Femi Alabi',
              phone: '+234 803 222 1100',
              email: 'femi.alabi@shell.com',
              leaseStart: '2025-12-01',
              leaseEnd: '2026-11-30',
              paymentStatus: 'Paid'
            }
          },
          {
            id: 'rh-unit-2',
            unitNumber: 'Flat 102 (3-Bed Serviced)',
            floorPlanType: '3-Bedroom Apartment',
            rentAmount: 8000000,
            serviceCharge: 1200000,
            bedrooms: 3,
            bathrooms: 3,
            status: 'occupied',
            tenant: {
              fullName: 'Barrister Chioma Okonkwo',
              phone: '+234 802 333 4455',
              email: 'chioma@okonkwolegal.ng',
              leaseStart: '2025-10-16',
              leaseEnd: '2026-10-15',
              paymentStatus: 'Paid'
            }
          },
          {
            id: 'rh-unit-3',
            unitNumber: 'Flat 201 (3-Bed Luxury)',
            floorPlanType: '3-Bedroom Apartment',
            rentAmount: 8500000,
            serviceCharge: 1200000,
            bedrooms: 3,
            bathrooms: 3,
            status: 'occupied',
            tenant: {
              fullName: 'Mr. David Adeleke',
              phone: '+234 814 555 7788',
              email: 'david@fintechafrica.io',
              leaseStart: '2026-03-01',
              leaseEnd: '2027-02-28',
              paymentStatus: 'Paid'
            }
          },
          {
            id: 'rh-unit-4',
            unitNumber: 'Flat 202 (3-Bed Penthouse)',
            floorPlanType: '3-Bedroom Penthouse',
            rentAmount: 8500000,
            serviceCharge: 1200000,
            bedrooms: 3,
            bathrooms: 3,
            status: 'occupied',
            tenant: {
              fullName: 'Dr. Olumide Bakare',
              phone: '+234 809 111 8899',
              email: 'o.bakare@lagosmed.org',
              leaseStart: '2026-04-15',
              leaseEnd: '2027-04-14',
              paymentStatus: 'Paid'
            }
          }
        ]
      });

      const monthsSeed = [
        { date: '2026-04-10', gross: 2750000, fee: 275000, maint: 0, net: 2475000 },
        { date: '2026-05-10', gross: 2750000, fee: 275000, maint: 45000, net: 2430000 },
        { date: '2026-06-10', gross: 2750000, fee: 275000, maint: 0, net: 2475000 },
        { date: '2026-07-10', gross: 2750000, fee: 275000, maint: 0, net: 2475000 },
        { date: '2026-08-10', gross: 2750000, fee: 275000, maint: 60000, net: 2415000 },
        { date: '2026-09-10', gross: 2750000, fee: 275000, maint: 0, net: 2475000 }
      ];

      monthsSeed.forEach((m, idx) => {
        portalStore.addTransaction({
          id: `rh-demo-tx-${idx + 1}`,
          propertyId: 'rh-demo-prop-lekki',
          propertyName: demoPropName,
          ownerEmail: demoEmail,
          type: 'owner_remittance',
          amount: m.net,
          referenceCode: `RH-REM-20260${idx + 4}`,
          date: m.date,
          status: 'completed',
          beneficiaryBank: 'Zenith Bank Plc',
          beneficiaryAccount: '1014589201',
          deductions: {
            grossRent: m.gross,
            managementFee: m.fee,
            maintenanceCost: m.maint,
            netRemitted: m.net
          }
        });
      });

      portalStore.addMaintenance({
        id: 'rh-demo-maint-1',
        propertyId: 'rh-demo-prop-lekki',
        propertyName: demoPropName,
        unitNumber: 'Flat 102',
        title: 'Industrial Water Purification Filter Cartridge Replacement',
        issue: 'Industrial Water Purification Filter Cartridge Replacement',
        description: 'Routine quarterly servicing of whole-building filtration membrane and carbon cartridge.',
        priority: 'medium',
        status: 'reported',
        reportedDate: '2026-09-14',
        actualCost: 35000,
        estimatedCost: 35000,
        contractor: 'Engr. Tunde Waterworks Ltd.',
        assignedContractor: 'Engr. Tunde Waterworks Ltd.'
      });

      const docs = portalStore.getDocuments();
      if (!docs.some(d => d.propertyId === 'rh-demo-prop-lekki')) {
        portalStore.addDocument({
          id: 'rh-demo-doc-1',
          propertyId: 'rh-demo-prop-lekki',
          propertyName: demoPropName,
          title: 'Certificate of Occupancy (C of O) & Building Plan',
          documentType: 'Title Deed',
          date: '2026-01-15',
          fileSize: '2.4 MB (PDF)',
          fileUrl: '#'
        });
        portalStore.addDocument({
          id: 'rh-demo-doc-2',
          propertyId: 'rh-demo-prop-lekki',
          propertyName: demoPropName,
          title: 'Q2 2026 Comprehensive Tenancy Audit & Remittance Statement',
          documentType: 'Financial Statement',
          date: '2026-06-30',
          fileSize: '1.8 MB (PDF)',
          fileUrl: '#'
        });
      }

      const insps = portalStore.getInspections();
      if (!insps.some(i => i.propertyId === 'rh-demo-prop-lekki')) {
        portalStore.addInspection({
          id: 'rh-demo-insp-1',
          propertyId: 'rh-demo-prop-lekki',
          propertyName: demoPropName,
          inspectorName: 'Engr. Babajide Fasola (Lead Facility Manager)',
          inspectionDate: '2026-08-20',
          overallCondition: 'Excellent',
          reportType: 'Quarterly Routine Audit',
          notes: 'Full structural inspection of Grand Imperial Court completed. Roof drainage cleared prior to heavy rainfall, electrical distribution panel tested with normal thermal signatures, and water pressure across all 4 units meets optimal residential standards.',
          photos: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
          ]
        });
      }
    }
  }
};

// Auto-sync initialization and background event listeners
if (typeof window !== 'undefined') {
  // 1. Initial background sync
  setTimeout(() => {
    portalStore.syncWithCloud();
  }, 100);

  // 2. Sync whenever window or mobile tab gains focus
  window.addEventListener('focus', () => {
    portalStore.syncWithCloud();
  });

  // 3. Sync on visibility change (mobile switching between apps/tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      portalStore.syncWithCloud();
    }
  });

  // 4. Periodic background sync every 20 seconds while tab is active
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      portalStore.syncWithCloud();
    }
  }, 20000);
}
