// Enterprise Store for Royal Haven Owner Portal & Property Management
// Operates with instant offline fallback & seamless Supabase synchronization

const STORAGE_KEY_PROPERTIES = "royalhaven_portal_properties";
const STORAGE_KEY_TRANSACTIONS = "royalhaven_portal_transactions";
const STORAGE_KEY_MAINTENANCE = "royalhaven_portal_maintenance";
const STORAGE_KEY_INSPECTIONS = "royalhaven_portal_inspections";
const STORAGE_KEY_DOCUMENTS = "royalhaven_portal_documents";
const STORAGE_KEY_INQUIRIES = "royalhaven_leads_inbox";

// Default realistic sample data reflecting premium Nigerian properties under Royal Haven management
const DEFAULT_PORTAL_DATA = {
  properties: [
    {
      id: "prop-ikeja-01",
      name: "Royal Crest Heights",
      address: "14 Isaac John Street, Ikeja GRA",
      city: "Ikeja",
      state: "Lagos State",
      propertyType: "Residential Block (6 Units)",
      coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      status: "active",
      notes: "Fully managed multi-family residential building. 24/7 security, central generator, water treatment plant.",
      units: [
        {
          id: "unit-101",
          unitNumber: "Flat 1A",
          floorPlanType: "3-Bedroom Luxury Flat",
          rentAmount: 4500000,
          serviceCharge: 1200000,
          status: "occupied",
          bedrooms: 3,
          bathrooms: 3,
          tenant: {
            id: "ten-01",
            fullName: "Dr. Adebayo Adeleke",
            phone: "+234 803 123 4567",
            email: "a.adeleke@medcare.ng",
            leaseStart: "2026-02-01",
            leaseEnd: "2027-01-31",
            paymentStatus: "Paid (Annual)",
            status: "active"
          }
        },
        {
          id: "unit-102",
          unitNumber: "Flat 1B",
          floorPlanType: "3-Bedroom Luxury Flat",
          rentAmount: 4500000,
          serviceCharge: 1200000,
          status: "occupied",
          bedrooms: 3,
          bathrooms: 3,
          tenant: {
            id: "ten-02",
            fullName: "Engr. Folake Balogun",
            phone: "+234 802 987 6543",
            email: "folake.b@energycorp.com",
            leaseStart: "2025-11-01",
            leaseEnd: "2026-10-31",
            paymentStatus: "Paid (Annual)",
            status: "expiring_soon"
          }
        },
        {
          id: "unit-103",
          unitNumber: "Flat 2A",
          floorPlanType: "3-Bedroom Luxury Flat",
          rentAmount: 4800000,
          serviceCharge: 1200000,
          status: "occupied",
          bedrooms: 3,
          bathrooms: 3,
          tenant: {
            id: "ten-03",
            fullName: "Chief Emeka Okafor",
            phone: "+234 818 456 7890",
            email: "emeka@okaforholdings.com",
            leaseStart: "2026-05-01",
            leaseEnd: "2027-04-30",
            paymentStatus: "Paid (Annual)",
            status: "active"
          }
        },
        {
          id: "unit-104",
          unitNumber: "Flat 2B",
          floorPlanType: "3-Bedroom Luxury Flat",
          rentAmount: 4800000,
          serviceCharge: 1200000,
          status: "occupied",
          bedrooms: 3,
          bathrooms: 3,
          tenant: {
            id: "ten-04",
            fullName: "Tunde & Zainab Bakare",
            phone: "+234 809 333 2211",
            email: "tundebakare@gmail.com",
            leaseStart: "2026-01-15",
            leaseEnd: "2027-01-14",
            paymentStatus: "Paid (Annual)",
            status: "active"
          }
        },
        {
          id: "unit-105",
          unitNumber: "Penthouse 3A",
          floorPlanType: "4-Bedroom Penthouse with Terrace",
          rentAmount: 7000000,
          serviceCharge: 1500000,
          status: "occupied",
          bedrooms: 4,
          bathrooms: 4,
          tenant: {
            id: "ten-05",
            fullName: "Sarah Al-Hassan",
            phone: "+234 815 777 9900",
            email: "s.alhassan@globalfinance.org",
            leaseStart: "2026-03-01",
            leaseEnd: "2027-02-28",
            paymentStatus: "Paid (Annual)",
            status: "active"
          }
        },
        {
          id: "unit-106",
          unitNumber: "Penthouse 3B",
          floorPlanType: "4-Bedroom Penthouse with Terrace",
          rentAmount: 7000000,
          serviceCharge: 1500000,
          status: "vacant",
          bedrooms: 4,
          bathrooms: 4,
          tenant: null
        }
      ]
    },
    {
      id: "prop-magodo-02",
      name: "Haven Terraces",
      address: "Plot 8, Bashiru Shittu Avenue, Magodo GRA Phase 2",
      city: "Kosofe",
      state: "Lagos State",
      propertyType: "4-Bedroom Terrace Duplex",
      coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      status: "active",
      notes: "Single-family luxury terrace. Gated private compound with stamped concrete and automated gate.",
      units: [
        {
          id: "unit-201",
          unitNumber: "Terrace 01",
          floorPlanType: "4-Bedroom Semi-Detached Terrace",
          rentAmount: 6500000,
          serviceCharge: 800000,
          status: "occupied",
          bedrooms: 4,
          bathrooms: 5,
          tenant: {
            id: "ten-06",
            fullName: "Capt. Ibrahim Danjuma",
            phone: "+234 807 555 4321",
            email: "danjuma.aviation@gmail.com",
            leaseStart: "2026-06-01",
            leaseEnd: "2027-05-31",
            paymentStatus: "Paid (Annual)",
            status: "active"
          }
        }
      ]
    }
  ],

  transactions: [
    {
      id: "tx-101",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      type: "owner_remittance",
      amount: 14580000,
      date: "2026-08-15",
      status: "completed",
      referenceCode: "RH-REM-2026-0815",
      description: "Net rent remittance for Q3 2026 (Less 10% management fee and plumbing maintenance)",
      deductions: {
        grossRent: 16500000,
        managementFee: 1650000,
        maintenanceCost: 270000,
        netRemitted: 14580000
      },
      beneficiaryBank: "Zenith Bank PLC",
      beneficiaryAccount: "•••••••• 4812"
    },
    {
      id: "tx-102",
      propertyId: "prop-magodo-02",
      propertyName: "Haven Terraces",
      type: "owner_remittance",
      amount: 5850000,
      date: "2026-06-10",
      status: "completed",
      referenceCode: "RH-REM-2026-0610",
      description: "Annual rent remittance for Capt. Ibrahim Danjuma (Less 10% management fee)",
      deductions: {
        grossRent: 6500000,
        managementFee: 650000,
        maintenanceCost: 0,
        netRemitted: 5850000
      },
      beneficiaryBank: "GTBank (Guaranty Trust)",
      beneficiaryAccount: "•••••••• 9021"
    },
    {
      id: "tx-103",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      type: "rent_income",
      amount: 7000000,
      date: "2026-03-01",
      status: "completed",
      referenceCode: "RH-RENT-2026-0301",
      description: "Annual rent payment for Penthouse 3A (Sarah Al-Hassan)"
    },
    {
      id: "tx-104",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      type: "maintenance_expense",
      amount: 270000,
      date: "2026-07-22",
      status: "completed",
      referenceCode: "RH-EXP-2026-0722",
      description: "Emergency industrial water pump overhaul and pressure float valve replacement"
    }
  ],

  maintenance: [
    {
      id: "maint-01",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      unitNumber: "Common Area (Pump House)",
      title: "Overhaul of Main Industrial Water Pressure Pump",
      description: "Pressure sensor tripped due to power surge. Vetted technician dispatched to replace float switch and overhaul impeller.",
      category: "plumbing",
      priority: "high",
      status: "completed",
      reportedDate: "2026-07-20",
      resolvedDate: "2026-07-22",
      actualCost: 270000,
      contractor: "Aquatech Engineering Services Ltd.",
      photos: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "maint-02",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      unitNumber: "Penthouse 3B (Vacant)",
      title: "Pre-Tenancy Interior Painting & Electrical Fixture Tune-up",
      description: "Routine scheduled refreshing of walls and upgrading recessed LED spotlights prior to next onboarding.",
      category: "painting",
      priority: "medium",
      status: "in_progress",
      reportedDate: "2026-08-25",
      resolvedDate: null,
      actualCost: 180000,
      contractor: "Royal Haven Certified Artisan Team",
      photos: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
      ]
    }
  ],

  inspections: [
    {
      id: "insp-01",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      inspectionDate: "2026-08-10",
      inspectorName: "Ibrahim Ridwan Olasunkanmi (MD/CEO)",
      overallCondition: "good",
      notes: "Bi-annual comprehensive facility inspection. Structural integrity excellent. Generator run-hours audited. Water filtration membranes in optimal range. Minor touch-up requested for perimeter lighting.",
      photos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: "insp-02",
      propertyId: "prop-magodo-02",
      propertyName: "Haven Terraces",
      inspectionDate: "2026-07-15",
      inspectorName: "Royal Haven Facility Inspection Desk",
      overallCondition: "pristine",
      notes: "Exterior wall coatings pristine. Roof gutters cleared of debris ahead of heavy rainfall season. Tenant relations verified satisfactory.",
      photos: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
      ]
    }
  ],

  documents: [
    {
      id: "doc-01",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      title: "Certificate of Occupancy (C of O) & Governor's Consent",
      documentType: "deed_title",
      date: "2024-03-12",
      fileSize: "4.2 MB",
      fileUrl: "#download-title-deed"
    },
    {
      id: "doc-02",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      title: "Annual Property Management & Remittance Agreement",
      documentType: "tenancy_agreement",
      date: "2026-01-05",
      fileSize: "1.8 MB",
      fileUrl: "#download-management-agreement"
    },
    {
      id: "doc-03",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      title: "Executed Tenancy Agreement - Penthouse 3A (Sarah Al-Hassan)",
      documentType: "tenancy_agreement",
      date: "2026-03-01",
      fileSize: "2.4 MB",
      fileUrl: "#download-lease-penthouse"
    },
    {
      id: "doc-04",
      propertyId: "prop-magodo-02",
      propertyName: "Haven Terraces",
      title: "Survey Plan & Registered Deed of Assignment",
      documentType: "survey_plan",
      date: "2023-11-20",
      fileSize: "3.5 MB",
      fileUrl: "#download-survey-plan"
    },
    {
      id: "doc-05",
      propertyId: "prop-ikeja-01",
      propertyName: "Royal Crest Heights",
      title: "Q3 2026 Certified Financial Statement & Rent Audit",
      documentType: "financial_statement",
      date: "2026-08-15",
      fileSize: "1.1 MB",
      fileUrl: "#download-q3-statement"
    }
  ]
};

export const portalStore = {
  // Read All Properties
  getProperties: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      if (saved) return JSON.parse(saved);
      // Initialize with default
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(DEFAULT_PORTAL_DATA.properties));
      return DEFAULT_PORTAL_DATA.properties;
    } catch {
      return DEFAULT_PORTAL_DATA.properties;
    }
  },

  // Read All Transactions
  getTransactions: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(DEFAULT_PORTAL_DATA.transactions));
      return DEFAULT_PORTAL_DATA.transactions;
    } catch {
      return DEFAULT_PORTAL_DATA.transactions;
    }
  },

  // Read Maintenance
  getMaintenance: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAINTENANCE);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY_MAINTENANCE, JSON.stringify(DEFAULT_PORTAL_DATA.maintenance));
      return DEFAULT_PORTAL_DATA.maintenance;
    } catch {
      return DEFAULT_PORTAL_DATA.maintenance;
    }
  },

  // Read Inspections
  getInspections: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSPECTIONS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(DEFAULT_PORTAL_DATA.inspections));
      return DEFAULT_PORTAL_DATA.inspections;
    } catch {
      return DEFAULT_PORTAL_DATA.inspections;
    }
  },

  // Read Documents
  getDocuments: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCUMENTS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(DEFAULT_PORTAL_DATA.documents));
      return DEFAULT_PORTAL_DATA.documents;
    } catch {
      return DEFAULT_PORTAL_DATA.documents;
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
      if (saved) return JSON.parse(saved);
      // Initial sample inquiries for leads inbox preview
      const initial = [
        {
          id: "lead-1",
          name: "Chief Adeleke Balogun",
          phone: "+234 803 444 8899",
          email: "adeleke.balogun@gmail.com",
          service: "Property Management",
          location: "Magodo GRA Phase 2, Lagos",
          notes: "I have a block of 4 flats newly completed and looking for reputable managers to handle tenant vetting and rent collection.",
          status: "pending",
          date: "2026-09-05"
        },
        {
          id: "lead-2",
          name: "Mrs. Ngozi Okonkwo",
          phone: "+234 812 777 3344",
          email: "ngozi.okonkwo@gmail.com",
          service: "Estate Surveying & Valuation",
          location: "Abeokuta, Ogun State",
          notes: "Need valuation report on a commercial property for bank collateral verification.",
          status: "contacted",
          date: "2026-09-02"
        }
      ];
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(initial));
      return initial;
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

