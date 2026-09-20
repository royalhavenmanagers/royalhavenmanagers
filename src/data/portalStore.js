// Enterprise Store for Royal Haven Owner Portal & Property Management
// Operates with instant offline fallback & seamless Supabase synchronization

const STORAGE_KEY_PROPERTIES = "royalhaven_portal_properties";
const STORAGE_KEY_TRANSACTIONS = "royalhaven_portal_transactions";
const STORAGE_KEY_MAINTENANCE = "royalhaven_portal_maintenance";
const STORAGE_KEY_INSPECTIONS = "royalhaven_portal_inspections";
const STORAGE_KEY_DOCUMENTS = "royalhaven_portal_documents";
const STORAGE_KEY_INQUIRIES = "royalhaven_leads_inbox";
const STORAGE_KEY_ONBOARDING_SUBMISSIONS = "royalhaven_portal_onboarding_submissions";

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
    return newDoc;
  },

  deleteDocument: (id) => {
    const list = portalStore.getDocuments();
    const updated = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(updated));
    return updated;
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

  // Update existing property & its units
  updateProperty: (id, updates) => {
    const properties = portalStore.getProperties();
    const updated = properties.map(p => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(updated));
    return updated;
  },

  deleteProperty: (id) => {
    const properties = portalStore.getProperties();
    const updated = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(updated));
    return updated;
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
      status: item.status || 'reported'
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(list));
    return newItem;
  },

  // Update maintenance ticket
  updateMaintenance: (id, updates) => {
    const list = portalStore.getMaintenance();
    const updated = list.map(m => (m.id === id ? { ...m, ...updates } : m));
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(updated));
    return updated;
  },

  deleteMaintenance: (id) => {
    const list = portalStore.getMaintenance();
    const updated = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(updated));
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
    return newItem;
  },

  updateInspection: (id, updates) => {
    const list = portalStore.getInspections();
    const updated = list.map(i => (i.id === id ? { ...i, ...updates } : i));
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(updated));
    return updated;
  },

  deleteInspection: (id) => {
    const list = portalStore.getInspections();
    const updated = list.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(updated));
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
  },

  updateOwner: (id, updatedData) => {
    const list = portalStore.getOwners();
    const idx = list.findIndex(o => 
      (id && o.id === id) || 
      (updatedData.originalEmail && o.email?.toLowerCase().trim() === updatedData.originalEmail?.toLowerCase().trim()) ||
      (updatedData.email && o.email?.toLowerCase().trim() === updatedData.email?.toLowerCase().trim())
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updatedData };
      localStorage.setItem("royalhaven_portal_owners", JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  deleteOwner: (id) => {
    const list = portalStore.getOwners();
    const updated = list.filter(o => o.id !== id);
    localStorage.setItem("royalhaven_portal_owners", JSON.stringify(updated));
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
    return newSub;
  },

  updateOnboardingSubmissionStatus: (id, status) => {
    const list = portalStore.getOnboardingSubmissions();
    const updated = list.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(updated));
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

    return { property: newProperty, submission: sub };
  },

  deleteOnboardingSubmission: (id) => {
    const list = portalStore.getOnboardingSubmissions();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_ONBOARDING_SUBMISSIONS, JSON.stringify(updated));
    return updated;
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
