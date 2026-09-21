import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, Eye, FileText, ArrowLeft, Image as ImageIcon, Save, KeyRound, 
  ShieldCheck, Home, Upload, MapPin, Tag, DollarSign, BedDouble, Bath, Sparkles,
  Inbox, Phone, Mail, Calendar, Send, Users, Copy, BarChart3, TrendingUp, Activity, RefreshCw, RotateCcw, ExternalLink, Building2, Wrench, Paperclip,
  ClipboardCheck, FolderArchive, Download
} from 'lucide-react';
import { blogStore } from '../data/blogStore';
import { propertyStore } from '../data/propertyStore';
import { portalStore } from '../data/portalStore';
import { analyticsStore } from '../data/analyticsStore';
import { compressImageFile } from '../utils/imageCompressor';
import { supabase, authApi } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AdminPortal({ onReturnHome }) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Primary navigation: 'articles', 'properties', 'inquiries', 'remittances', 'maintenance', 'vault', 'inspections', 'owners', 'traffic', 'security'
  const [activeModule, setActiveModule] = useState('articles');

  // Articles State
  const [posts, setPosts] = useState([]);
  const [articleSubTab, setArticleSubTab] = useState('list'); // 'list' or 'editor'
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    category: 'Property Management',
    coverImage: '',
    author: 'Ibrahim Ridwan Olasunkanmi (CEO & MD)',
    status: 'published',
    summary: '',
    content: ''
  });

  // Properties State
  const [properties, setProperties] = useState([]);
  const [propertySubTab, setPropertySubTab] = useState('list'); // 'list' or 'editor'
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    location: '',
    price: '',
    propertyType: 'Residential Duplex',
    listingType: 'For Rent',
    bedrooms: '',
    bathrooms: '',
    coverImage: '',
    status: 'Available',
    description: ''
  });

  // Image Upload Processing State
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Change Password State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Leads / Inquiries State
  const [inquiries, setInquiries] = useState([]);

  // Owner Remittances State
  const [remittances, setRemittances] = useState([]);
  const [showAddRemittanceModal, setShowAddRemittanceModal] = useState(false);
  const [remittanceFormData, setRemittanceFormData] = useState({
    propertyName: '',
    propertyId: '',
    grossRent: '',
    managementFee: '',
    maintenanceCost: '',
    beneficiaryBank: '',
    beneficiaryAccount: '',
    description: ''
  });

  // Owner Accounts State
  const [owners, setOwners] = useState([]);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [isSubmittingOwner, setIsSubmittingOwner] = useState(false);
  const [ownerFormData, setOwnerFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    assignedProperty: ''
  });
  const [createdOwnerCreds, setCreatedOwnerCreds] = useState(null);
  const [editingOwner, setEditingOwner] = useState(null);
  const [showEditOwnerModal, setShowEditOwnerModal] = useState(false);

  // Property Onboarding Wizard & Submissions Queue State
  const [onboardingSubmissions, setOnboardingSubmissions] = useState([]);
  const [showOnboardPropertyModal, setShowOnboardPropertyModal] = useState(false);
  const [isSubmittingOnboard, setIsSubmittingOnboard] = useState(false);
  const [activatedPropertyData, setActivatedPropertyData] = useState(null);
  const [onboardPropertyForm, setOnboardPropertyForm] = useState({
    ownerMode: 'existing', // 'existing' | 'new'
    ownerId: '',
    newOwnerName: '',
    newOwnerEmail: '',
    newOwnerPhone: '',
    newOwnerPassword: '',
    newOwnerBank: '',
    newOwnerAccount: '',
    propertyName: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos State',
    propertyType: 'Residential Apartment',
    unitsCount: 1,
    targetRent: '',
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    leaseStart: new Date().toISOString().split('T')[0],
    leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Managed Portal Properties (Units & Tenants)
  const [managedProperties, setManagedProperties] = useState([]);
  const [editingUnitsProp, setEditingUnitsProp] = useState(null);
  const [showEditUnitsModal, setShowEditUnitsModal] = useState(false);

  // Facility Maintenance & Invoices State
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [showLogMaintenanceModal, setShowLogMaintenanceModal] = useState(false);
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    propertyId: '',
    propertyName: '',
    unitNumber: '',
    title: '',
    description: '',
    contractor: '',
    actualCost: '',
    invoiceUrl: null,
    invoiceName: null,
    status: 'in_progress'
  });

  // Document Vault State
  const [documents, setDocuments] = useState([]);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docFilterProp, setDocFilterProp] = useState('all');
  const [docFormData, setDocFormData] = useState({
    propertyId: '',
    propertyName: '',
    title: '',
    documentType: 'Certificate of Occupancy (C of O)',
    fileUrl: '',
    fileName: '',
    fileSize: ''
  });

  // Routine Inspections State
  const [inspections, setInspections] = useState([]);
  const [showAddInspModal, setShowAddInspModal] = useState(false);
  const [inspFilterProp, setInspFilterProp] = useState('all');
  const [inspFormData, setInspFormData] = useState({
    propertyId: '',
    propertyName: '',
    inspectorName: 'Engr. Babajide Fasola (Lead Facility Manager)',
    inspectionDate: new Date().toISOString().split('T')[0],
    overallCondition: 'Excellent',
    reportType: 'Quarterly Routine Audit',
    notes: '',
    photos: []
  });

  const { impersonateOwner } = useAuth();

  const [notification, setNotification] = useState('');
  const [trafficStats, setTrafficStats] = useState(null);

  useEffect(() => {
    const authStatus = blogStore.isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      loadData();
    }
  }, []);

  const loadData = () => {
    // Load traffic stats
    setTrafficStats(analyticsStore.getStats());

    // Load posts
    setPosts(blogStore.getPosts());
    blogStore.fetchPostsAsync().then((cloudPosts) => {
      if (cloudPosts) setPosts(cloudPosts);
    });

    // Load properties
    setProperties(propertyStore.getProperties());
    propertyStore.fetchPropertiesAsync().then((cloudProps) => {
      if (cloudProps && Array.isArray(cloudProps)) setProperties(cloudProps);
    });

    // Load managed properties (with units & tenants) and maintenance
    setManagedProperties(portalStore.getProperties());
    setMaintenanceList(portalStore.getMaintenance());

    // Load documents and routine inspections
    setDocuments(portalStore.getDocuments());
    setInspections(portalStore.getInspections());

    // Load inquiries, remittances & onboarding submissions
    setInquiries(portalStore.getInquiries());
    setRemittances(portalStore.getTransactions().filter(t => t.type === 'owner_remittance'));
    setOnboardingSubmissions(portalStore.getOnboardingSubmissions());

    // Load registered owners from store & Supabase
    setOwners(portalStore.getOwners());
    if (supabase) {
      supabase.from('profiles').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          const fromCloud = data.map(p => ({
            id: p.id,
            fullName: p.full_name || 'Valued Property Owner',
            email: p.email,
            phone: p.phone || '—',
            bankName: p.bank_name || '—',
            accountNumber: p.account_number || '—',
            accountName: p.account_name || '—',
            assignedProperties: (p.assigned_properties || []).filter(prop => !prop.includes('Royal Crest') && !prop.includes('Haven Terraces')),
            createdDate: p.created_at ? p.created_at.split('T')[0] : '2026-08-01'
          }));
          setOwners(fromCloud);
        }
      }).catch(() => {});
    }
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    if (isSubmittingOwner) return;
    if (!ownerFormData.fullName || !ownerFormData.email || !ownerFormData.password) {
      alert("Please fill in Full Name, Email, and Password.");
      return;
    }

    setIsSubmittingOwner(true);
    try {
      if (authApi) {
        await authApi.signUp(ownerFormData.email, ownerFormData.password, {
          full_name: ownerFormData.fullName,
          phone: ownerFormData.phone,
          role: 'property_owner',
          bank_name: ownerFormData.bankName,
          account_number: ownerFormData.accountNumber,
          account_name: ownerFormData.accountName
        });
      }
    } catch (err) {
      console.warn("Supabase user creation notice:", err.message);
    }

    const assignedProp = ownerFormData.assignedProperty ? [ownerFormData.assignedProperty.trim()] : [];
    const newOwner = portalStore.addOwner({
      fullName: ownerFormData.fullName,
      email: ownerFormData.email,
      password: ownerFormData.password,
      phone: ownerFormData.phone,
      bankName: ownerFormData.bankName,
      accountNumber: ownerFormData.accountNumber,
      accountName: ownerFormData.accountName,
      assignedProperties: assignedProp
    });

    setOwners(portalStore.getOwners());
    setCreatedOwnerCreds({
      fullName: ownerFormData.fullName,
      email: ownerFormData.email,
      password: ownerFormData.password,
      phone: ownerFormData.phone
    });

    // Reset owner form to avoid duplicate values persisting on next open
    setOwnerFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      assignedProperty: ''
    });

    setShowAddOwnerModal(false);
    setIsSubmittingOwner(false);
    showNotification(`Account created for ${newOwner.fullName}! You can now send them login credentials.`);
  };

  const handleAccessClientPortal = (owner) => {
    if (impersonateOwner) {
      impersonateOwner(owner);
      window.location.hash = '#portal';
    }
  };

  const handleOpenEditOwner = (owner) => {
    setEditingOwner({
      ...owner,
      originalEmail: owner.email,
      assignedPropertiesText: (owner.assignedProperties || []).join(', ')
    });
    setShowEditOwnerModal(true);
  };

  const handleQuickAddRemittanceForOwner = (owner) => {
    setShowEditOwnerModal(false);
    setActiveModule('remittances');
    const firstAssigned = (owner.assignedProperties && owner.assignedProperties[0]) || '';
    setRemittanceFormData({
      propertyName: firstAssigned,
      propertyId: '',
      grossRent: '',
      managementFee: '',
      maintenanceCost: '',
      beneficiaryBank: owner.bankName || '',
      beneficiaryAccount: owner.accountNumber || '',
      description: `Rent remittance for ${owner.fullName}`
    });
    setShowAddRemittanceModal(true);
  };

  const handleSaveEditOwner = async (e) => {
    e.preventDefault();
    if (!editingOwner) return;

    const assignedPropsArray = editingOwner.assignedPropertiesText
      ? editingOwner.assignedPropertiesText.split(',').map(s => s.trim()).filter(Boolean)
      : (editingOwner.assignedProperties || []);

    const updatedPayload = {
      ...editingOwner,
      assignedProperties: assignedPropsArray
    };

    portalStore.updateOwner(editingOwner.id, updatedPayload);

    if (supabase) {
      try {
        const lookupEmail = editingOwner.originalEmail || editingOwner.email;
        await supabase.from('profiles').update({
          full_name: updatedPayload.fullName,
          email: updatedPayload.email,
          phone: updatedPayload.phone,
          bank_name: updatedPayload.bankName,
          account_number: updatedPayload.accountNumber,
          account_name: updatedPayload.accountName,
          assigned_properties: assignedPropsArray
        }).eq('email', lookupEmail);
      } catch (err) {
        console.warn("Supabase profile sync notice:", err.message);
      }
    }

    setOwners(portalStore.getOwners());
    setShowEditOwnerModal(false);
    setEditingOwner(null);
    showNotification(`Account details for ${updatedPayload.fullName} updated!`);
  };

  const handleDeleteOwner = async (owner) => {
    if (window.confirm(`Are you sure you want to remove the account for ${owner.fullName} (${owner.email})?`)) {
      portalStore.deleteOwner(owner.id);
      if (supabase) {
        try {
          await supabase.from('profiles').delete().eq('email', owner.email);
        } catch (err) {
          console.warn("Supabase profile delete notice:", err.message);
        }
      }
      setOwners(portalStore.getOwners());
      showNotification(`Account for ${owner.fullName} removed.`);
    }
  };

  const handleToggleInquiryStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    const updated = portalStore.updateInquiryStatus(id, nextStatus);
    setInquiries(updated);
    showNotification(`Lead marked as ${nextStatus}!`);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm("Are you sure you want to remove this consultation lead?")) {
      const updated = portalStore.deleteInquiry(id);
      setInquiries(updated);
      showNotification("Lead deleted.");
    }
  };

  // Onboard Managed Property Handlers
  const handleOpenOnboardModal = (preselectedOwner = null) => {
    setOnboardPropertyForm({
      ownerMode: preselectedOwner ? 'existing' : (owners.length > 0 ? 'existing' : 'new'),
      ownerId: preselectedOwner ? preselectedOwner.id : (owners[0]?.id || ''),
      newOwnerName: '',
      newOwnerEmail: '',
      newOwnerPhone: '',
      newOwnerPassword: '',
      newOwnerBank: 'Zenith Bank',
      newOwnerAccount: '',
      propertyName: '',
      address: '',
      city: 'Lagos',
      state: 'Lagos State',
      propertyType: 'Residential Apartment',
      unitsCount: 1,
      targetRent: '',
      tenantName: '',
      tenantPhone: '',
      tenantEmail: '',
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowOnboardPropertyModal(true);
  };

  const handleAdminOnboardSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingOnboard) return;
    if (!onboardPropertyForm.propertyName.trim()) {
      alert("Please enter a property name.");
      return;
    }

    setIsSubmittingOnboard(true);
    let targetOwnerId = onboardPropertyForm.ownerId;
    let targetOwnerName = '';
    let targetOwnerEmail = '';
    let targetOwnerPhone = '';

    try {
      if (onboardPropertyForm.ownerMode === 'new') {
        if (!onboardPropertyForm.newOwnerName || !onboardPropertyForm.newOwnerEmail) {
          alert("Please fill in Landlord Full Name and Email.");
          setIsSubmittingOnboard(false);
          return;
        }
        const tempPassword = onboardPropertyForm.newOwnerPassword || ('RH-' + Math.random().toString(36).slice(-6).toUpperCase());

        try {
          if (authApi) {
            await authApi.signUp(onboardPropertyForm.newOwnerEmail, tempPassword, {
              full_name: onboardPropertyForm.newOwnerName,
              phone: onboardPropertyForm.newOwnerPhone,
              role: 'property_owner',
              bank_name: onboardPropertyForm.newOwnerBank,
              account_number: onboardPropertyForm.newOwnerAccount
            });
          }
        } catch (err) {
          console.warn("Supabase user creation notice:", err.message);
        }

        const created = portalStore.addOwner({
          fullName: onboardPropertyForm.newOwnerName,
          email: onboardPropertyForm.newOwnerEmail,
          phone: onboardPropertyForm.newOwnerPhone,
          password: tempPassword,
          bankName: onboardPropertyForm.newOwnerBank,
          accountNumber: onboardPropertyForm.newOwnerAccount,
          assignedProperties: [onboardPropertyForm.propertyName.trim()]
        });

        targetOwnerId = created.id;
        targetOwnerName = created.fullName;
        targetOwnerEmail = created.email;
        targetOwnerPhone = created.phone;
      } else {
        const existing = owners.find(o => o.id === targetOwnerId || o.email === targetOwnerId);
        if (!existing) {
          alert("Please select an existing Property Owner.");
          setIsSubmittingOnboard(false);
          return;
        }
        targetOwnerId = existing.id;
        targetOwnerName = existing.fullName;
        targetOwnerEmail = existing.email;
        targetOwnerPhone = existing.phone;

        const currentProps = existing.assignedProperties || [];
        if (!currentProps.some(p => p.toLowerCase().trim() === onboardPropertyForm.propertyName.trim().toLowerCase())) {
          const updatedProps = [...currentProps, onboardPropertyForm.propertyName.trim()];
          portalStore.updateOwner(existing.id, { assignedProperties: updatedProps });
          if (supabase) {
            try {
              await supabase.from('profiles').update({ assigned_properties: updatedProps }).eq('email', existing.email);
            } catch {}
          }
        }
      }

      const unitsCount = Math.max(1, parseInt(onboardPropertyForm.unitsCount, 10) || 1);
      const targetRent = Number(onboardPropertyForm.targetRent) || 0;
      const propId = `prop-${Date.now()}`;

      const newProp = portalStore.addProperty({
        id: propId,
        name: onboardPropertyForm.propertyName.trim(),
        address: onboardPropertyForm.address?.trim() || 'Lagos, Nigeria',
        city: onboardPropertyForm.city || 'Lagos',
        state: onboardPropertyForm.state || 'Lagos State',
        propertyType: onboardPropertyForm.propertyType || 'Residential Apartment',
        status: 'active',
        ownerId: targetOwnerId,
        ownerEmail: targetOwnerEmail,
        unitsCount: unitsCount,
        units: Array.from({ length: unitsCount }, (_, i) => ({
          id: `unit-${propId}-${i + 1}`,
          unitNumber: `Flat ${i + 1}`,
          floorPlanType: onboardPropertyForm.propertyType || 'Apartment',
          rentAmount: targetRent,
          serviceCharge: 0,
          bedrooms: 3,
          bathrooms: 3,
          status: 'occupied',
          tenant: {
            fullName: i === 0 && onboardPropertyForm.tenantName ? onboardPropertyForm.tenantName : `Verified Tenant ${i + 1}`,
            phone: i === 0 && onboardPropertyForm.tenantPhone ? onboardPropertyForm.tenantPhone : '+234 800 000 0000',
            email: i === 0 && onboardPropertyForm.tenantEmail ? onboardPropertyForm.tenantEmail : 'tenant@royalhaven.com.ng',
            leaseStart: onboardPropertyForm.leaseStart || new Date().toISOString().split('T')[0],
            leaseEnd: onboardPropertyForm.leaseEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentStatus: 'Paid'
          }
        }))
      });

      if (targetRent > 0) {
        const gross = targetRent;
        const mgmtFee = Math.round(gross * 0.10);
        const net = gross - mgmtFee;
        portalStore.addTransaction({
          propertyId: propId,
          propertyName: newProp.name,
          ownerEmail: targetOwnerEmail,
          type: 'owner_remittance',
          amount: net,
          referenceCode: `RH-REM-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          deductions: {
            grossRent: gross,
            managementFee: mgmtFee,
            maintenanceCost: 0,
            netRemitted: net
          }
        });
      }

      loadData();
      setShowOnboardPropertyModal(false);
      setActivatedPropertyData({
        ownerName: targetOwnerName,
        ownerPhone: targetOwnerPhone,
        ownerEmail: targetOwnerEmail,
        propertyName: newProp.name
      });
      showNotification(`Property "${newProp.name}" successfully onboarded and activated for ${targetOwnerName}!`);
    } finally {
      setIsSubmittingOnboard(false);
    }
  };

  // -------------------------------------------------------------
  // SAFE DELETE HANDLERS
  // -------------------------------------------------------------
  const handleDeleteManagedProperty = (prop) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prop.name}"? This will remove its units, tenancy records, and unassign it from the landlord.`)) {
      portalStore.deleteProperty(prop.id);
      loadData();
      showNotification(`Managed building "${prop.name}" deleted successfully.`);
    }
  };

  const handleDeleteRemittance = (rem) => {
    if (window.confirm(`Are you sure you want to delete this remittance record (${rem.referenceCode || rem.propertyName})? This will also remove it from the landlord's statements.`)) {
      portalStore.deleteTransaction(rem.id);
      loadData();
      showNotification("Remittance record deleted successfully.");
    }
  };

  // -------------------------------------------------------------
  // DOCUMENT VAULT HANDLERS
  // -------------------------------------------------------------
  const handleDocumentFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop().toUpperCase();
      setDocFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeInMb} MB (${ext})`,
        fileUrl: reader.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!docFormData.propertyName || !docFormData.title) {
      alert("Please select a managed property and provide a document title.");
      return;
    }

    portalStore.addDocument({
      propertyId: docFormData.propertyId,
      propertyName: docFormData.propertyName,
      title: docFormData.title,
      documentType: docFormData.documentType || 'Certificate of Occupancy (C of O)',
      fileSize: docFormData.fileSize || 'Digital Document',
      fileUrl: docFormData.fileUrl || '#'
    });

    loadData();
    setShowAddDocModal(false);
    setDocFormData({
      propertyId: '',
      propertyName: '',
      title: '',
      documentType: 'Certificate of Occupancy (C of O)',
      fileUrl: '',
      fileName: '',
      fileSize: ''
    });
    showNotification(`Document "${docFormData.title}" uploaded to vault and synced to Landlord!`);
  };

  const handleDeleteDocument = (doc) => {
    if (window.confirm(`Are you sure you want to remove "${doc.title}" from the Document Vault? This will also remove it from the owner's portal.`)) {
      portalStore.deleteDocument(doc.id);
      loadData();
      showNotification("Document removed from vault.");
    }
  };

  // -------------------------------------------------------------
  // ROUTINE INSPECTIONS HANDLERS
  // -------------------------------------------------------------
  const handleInspectionPhotoUpload = (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setInspFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveInspection = (e) => {
    e.preventDefault();
    if (!inspFormData.propertyName || !inspFormData.notes) {
      alert("Please select a property and enter inspection audit notes.");
      return;
    }

    portalStore.addInspection({
      propertyId: inspFormData.propertyId,
      propertyName: inspFormData.propertyName,
      inspectorName: inspFormData.inspectorName || 'Royal Haven Facility Manager',
      inspectionDate: inspFormData.inspectionDate || new Date().toISOString().split('T')[0],
      overallCondition: inspFormData.overallCondition || 'Excellent',
      reportType: inspFormData.reportType || 'Quarterly Routine Audit',
      notes: inspFormData.notes,
      photos: inspFormData.photos || []
    });

    loadData();
    setShowAddInspModal(false);
    setInspFormData({
      propertyId: '',
      propertyName: '',
      inspectorName: 'Engr. Babajide Fasola (Lead Facility Manager)',
      inspectionDate: new Date().toISOString().split('T')[0],
      overallCondition: 'Excellent',
      reportType: 'Quarterly Routine Audit',
      notes: '',
      photos: []
    });
    showNotification("Routine property inspection audit logged and published to Owner Portal!");
  };

  const handleDeleteInspection = (insp) => {
    if (window.confirm(`Are you sure you want to delete this inspection audit report for "${insp.propertyName}"?`)) {
      portalStore.deleteInspection(insp.id);
      loadData();
      showNotification("Inspection report removed.");
    }
  };

  const handleApproveSubmission = (sub) => {
    const res = portalStore.approveOnboardingSubmission(sub.id);
    if (res) {
      loadData();
      showNotification(`Submission Approved! "${res.property.name}" is now live on the owner dashboard.`);
    }
  };

  const handleDismissSubmission = (id) => {
    if (window.confirm("Dismiss this property onboarding submission?")) {
      portalStore.deleteOnboardingSubmission(id);
      loadData();
      showNotification("Submission removed.");
    }
  };

  // -------------------------------------------------------------
  // MANAGED PROPERTIES & UNITS / TENANTS HANDLERS
  // -------------------------------------------------------------
  const handleOpenEditUnits = (prop) => {
    const rawUnits = prop.units || [];
    const clonedUnits = rawUnits.map((u, idx) => ({
      id: u.id || `unit-${prop.id}-${idx + 1}`,
      unitNumber: u.unitNumber || `Flat ${idx + 1}`,
      floorPlanType: u.floorPlanType || 'Apartment',
      rentAmount: u.rentAmount ?? (prop.targetRent || 5000000),
      status: u.status || 'occupied',
      tenant: {
        fullName: u.tenant?.fullName || '',
        phone: u.tenant?.phone || '',
        email: u.tenant?.email || '',
        leaseStart: u.tenant?.leaseStart || new Date().toISOString().split('T')[0],
        leaseEnd: u.tenant?.leaseEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentStatus: u.tenant?.paymentStatus || 'Paid'
      }
    }));

    setEditingUnitsProp({
      ...prop,
      units: clonedUnits.length > 0 ? clonedUnits : [
        {
          id: `unit-${prop.id}-1`,
          unitNumber: 'Flat 1',
          floorPlanType: 'Apartment',
          rentAmount: 5000000,
          status: 'occupied',
          tenant: {
            fullName: 'Tenant Name',
            phone: '+234 800 000 0000',
            email: '',
            leaseStart: new Date().toISOString().split('T')[0],
            leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentStatus: 'Paid'
          }
        }
      ]
    });
    setShowEditUnitsModal(true);
  };

  const handleUnitFieldChange = (index, field, value) => {
    if (!editingUnitsProp) return;
    const updated = [...editingUnitsProp.units];
    updated[index] = {
      ...updated[index],
      [field]: field === 'rentAmount' ? Number(value) : value
    };
    setEditingUnitsProp(prev => ({ ...prev, units: updated }));
  };

  const handleTenantFieldChange = (index, field, value) => {
    if (!editingUnitsProp) return;
    const updated = [...editingUnitsProp.units];
    updated[index] = {
      ...updated[index],
      tenant: {
        ...(updated[index].tenant || {}),
        [field]: value
      }
    };
    setEditingUnitsProp(prev => ({ ...prev, units: updated }));
  };

  const handleAddUnitToEditingProp = () => {
    if (!editingUnitsProp) return;
    const nextNum = editingUnitsProp.units.length + 1;
    const newUnit = {
      id: `unit-${editingUnitsProp.id}-${Date.now()}`,
      unitNumber: `Flat ${nextNum}`,
      floorPlanType: 'Residential Apartment',
      rentAmount: editingUnitsProp.units[0]?.rentAmount || 5000000,
      status: 'vacant',
      tenant: {
        fullName: '',
        phone: '',
        email: '',
        leaseStart: new Date().toISOString().split('T')[0],
        leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentStatus: 'Due'
      }
    };
    setEditingUnitsProp(prev => ({
      ...prev,
      units: [...prev.units, newUnit]
    }));
  };

  const handleRemoveUnitFromEditingProp = (unitId) => {
    if (!editingUnitsProp) return;
    if (editingUnitsProp.units.length <= 1) {
      alert("A managed building must have at least one unit.");
      return;
    }
    setEditingUnitsProp(prev => ({
      ...prev,
      units: prev.units.filter(u => u.id !== unitId)
    }));
  };

  const handleSaveUnitsAndTenants = (e) => {
    e.preventDefault();
    if (!editingUnitsProp) return;

    portalStore.updateProperty(editingUnitsProp.id, {
      name: editingUnitsProp.name,
      address: editingUnitsProp.address,
      city: editingUnitsProp.city,
      unitsCount: editingUnitsProp.units.length,
      units: editingUnitsProp.units
    });

    loadData();
    setShowEditUnitsModal(false);
    setEditingUnitsProp(null);
    showNotification("Units and tenant records updated successfully!");
  };

  // -------------------------------------------------------------
  // AUTOMATIC REMITTANCE CALCULATION HANDLER
  // -------------------------------------------------------------
  const handleAutoFillRemittance = (prop) => {
    if (!prop) return;
    const occupiedUnits = (prop.units || []).filter(u => u.status === 'occupied');
    const totalAnnualRent = occupiedUnits.reduce((acc, u) => acc + Number(u.rentAmount || 0), 0);
    // Automatic monthly gross (Annual / 12)
    const monthlyGross = totalAnnualRent > 0 ? Math.round(totalAnnualRent / 12) : 2500000;
    const fee = Math.round(monthlyGross * 0.10); // 10% Royal Haven Management Fee
    const net = monthlyGross - fee; // 90% Net Remittance

    const owner = owners.find(o => o.id === prop.ownerId || o.email === prop.ownerEmail || (o.assignedProperties || []).includes(prop.name));

    setRemittanceFormData({
      propertyId: prop.id,
      propertyName: prop.name,
      grossRent: monthlyGross,
      managementFee: fee,
      maintenanceCost: 0,
      beneficiaryBank: owner?.bankName || 'Zenith Bank',
      beneficiaryAccount: owner?.accountNumber || '',
      description: `Automatic monthly rent payout for ${prop.name} (Less 10% Royal Haven Management Fee)`
    });

    setActiveModule('remittances');
    setShowAddRemittanceModal(true);
  };

  const handleRemittancePropertySelect = (propIdentifier) => {
    const prop = managedProperties.find(p => p.id === propIdentifier || p.name === propIdentifier);
    if (prop) {
      const occupiedUnits = (prop.units || []).filter(u => u.status === 'occupied');
      const totalAnnualRent = occupiedUnits.reduce((acc, u) => acc + Number(u.rentAmount || 0), 0);
      const monthlyGross = totalAnnualRent > 0 ? Math.round(totalAnnualRent / 12) : (Number(prop.targetRent) || 2500000);
      const fee = Math.round(monthlyGross * 0.10);
      const net = monthlyGross - fee;

      const owner = owners.find(o => o.id === prop.ownerId || o.email === prop.ownerEmail || (o.assignedProperties || []).includes(prop.name));

      setRemittanceFormData(prev => ({
        ...prev,
        propertyId: prop.id,
        propertyName: prop.name,
        grossRent: monthlyGross,
        managementFee: fee,
        maintenanceCost: 0,
        beneficiaryBank: owner?.bankName || prev.beneficiaryBank || 'Zenith Bank',
        beneficiaryAccount: owner?.accountNumber || prev.beneficiaryAccount || '',
        description: `Automatic monthly rent payout for ${prop.name} (Less 10% Royal Haven Management Fee)`
      }));
    } else {
      setRemittanceFormData(prev => ({ ...prev, propertyName: propIdentifier }));
    }
  };

  // -------------------------------------------------------------
  // FACILITY MAINTENANCE & INVOICE ATTACHMENT HANDLERS
  // -------------------------------------------------------------
  const handleLogMaintenanceSubmit = (e) => {
    e.preventDefault();
    if (!maintenanceFormData.propertyName || !maintenanceFormData.title) {
      alert("Please select a property and enter the maintenance issue.");
      return;
    }

    const cost = Number(maintenanceFormData.actualCost) || 0;
    portalStore.addMaintenance({
      propertyId: maintenanceFormData.propertyId,
      propertyName: maintenanceFormData.propertyName,
      unitNumber: maintenanceFormData.unitNumber || 'Whole Building',
      title: maintenanceFormData.title,
      issue: maintenanceFormData.title,
      description: maintenanceFormData.description || 'Routine preventive maintenance.',
      contractor: maintenanceFormData.contractor || 'Royal Haven Facility Team',
      actualCost: cost,
      estimatedCost: cost,
      status: maintenanceFormData.status || 'in_progress',
      invoiceUrl: maintenanceFormData.invoiceUrl || null,
      invoiceName: maintenanceFormData.invoiceName || null
    });

    loadData();
    setShowLogMaintenanceModal(false);
    setMaintenanceFormData({
      propertyId: '',
      propertyName: '',
      unitNumber: '',
      title: '',
      description: '',
      contractor: '',
      actualCost: '',
      invoiceUrl: null,
      invoiceName: null,
      status: 'in_progress'
    });
    showNotification("Maintenance work order logged with contractor invoice!");
  };

  const handleToggleMaintenanceStatus = (item) => {
    const nextStatus = item.status === 'completed' ? 'in_progress' : 'completed';
    portalStore.updateMaintenance(item.id, { status: nextStatus });
    loadData();
    showNotification(`Maintenance ticket marked as ${nextStatus === 'completed' ? 'Resolved' : 'In Progress'}.`);
  };

  const handleInvoiceUploadForTicket = (ticketId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      portalStore.updateMaintenance(ticketId, {
        invoiceUrl: reader.result,
        invoiceName: file.name
      });
      loadData();
      showNotification(`Contractor invoice "${file.name}" attached successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMaintenance = (id) => {
    if (window.confirm("Delete this maintenance record from the audit log?")) {
      portalStore.deleteMaintenance(id);
      loadData();
      showNotification("Maintenance ticket removed.");
    }
  };

  const handleCreateRemittance = (e) => {
    e.preventDefault();
    const gross = Number(remittanceFormData.grossRent) || 0;
    const fee = Number(remittanceFormData.managementFee) || Math.round(gross * 0.1);
    const maint = Number(remittanceFormData.maintenanceCost) || 0;
    const net = gross - fee - maint;

    const newTx = portalStore.addTransaction({
      propertyId: remittanceFormData.propertyId,
      propertyName: remittanceFormData.propertyName,
      type: 'owner_remittance',
      amount: net,
      referenceCode: `RH-REM-${Date.now().toString().slice(-6)}`,
      description: remittanceFormData.description || `Owner rent remittance (Less 10% management fee)`,
      deductions: {
        grossRent: gross,
        managementFee: fee,
        maintenanceCost: maint,
        netRemitted: net
      },
      beneficiaryBank: remittanceFormData.beneficiaryBank,
      beneficiaryAccount: remittanceFormData.beneficiaryAccount
    });

    setRemittances(portalStore.getTransactions().filter(t => t.type === 'owner_remittance'));
    setShowAddRemittanceModal(false);
    showNotification("Remittance successfully logged and posted to Owner Portal!");
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = blogStore.login(password);
    if (res.success) {
      setIsAuth(true);
      loadData();
    } else {
      setAuthError(res.error || 'Invalid password');
    }
  };

  const handleLogout = () => {
    blogStore.logout();
    setIsAuth(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPwd !== confirmPwd) {
      setPwdError("New password and confirmation do not match.");
      return;
    }

    const res = blogStore.changePassword(currentPwd, newPwd);
    if (res.success) {
      setPwdSuccess(res.message || "Password updated successfully!");
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } else {
      setPwdError(res.error || "Failed to update password.");
    }
  };

  const handleRefreshTraffic = () => {
    setTrafficStats(analyticsStore.getStats());
    showNotification("Website traffic stats updated.");
  };

  const handleResetTraffic = () => {
    if (window.confirm("Are you sure you want to reset the website view count to 0?")) {
      analyticsStore.resetData();
      setTrafficStats(analyticsStore.getStats());
      showNotification("Website traffic counter reset to 0.");
    }
  };

  // -------------------------------------------------------------
  // ARTICLE HANDLERS
  // -------------------------------------------------------------
  const handleStartCreateArticle = () => {
    setEditingArticleId(null);
    setArticleFormData({
      title: '',
      category: 'Property Management',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      author: 'Royal Haven Management Team',
      status: 'published',
      summary: '',
      content: ''
    });
    setArticleSubTab('editor');
  };

  const handleStartEditArticle = (post) => {
    setEditingArticleId(post.id);
    setArticleFormData({
      title: post.title,
      category: post.category,
      coverImage: post.coverImage,
      author: post.author,
      status: post.status,
      summary: post.summary || '',
      content: post.content || ''
    });
    setArticleSubTab('editor');
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post permanently?")) {
      const updated = blogStore.deletePost(id);
      setPosts(updated);
      showNotification("Article deleted successfully.");
    }
  };

  const handleToggleArticleStatus = (id) => {
    const updated = blogStore.togglePublishStatus(id);
    setPosts(updated);
    showNotification("Publish status updated.");
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!articleFormData.title || !articleFormData.content) {
      alert("Please fill in both the Title and Article Content.");
      return;
    }

    const payload = {
      ...articleFormData,
      ...(editingArticleId ? { id: editingArticleId } : {})
    };

    blogStore.savePost(payload);
    loadData();
    setArticleSubTab('list');
    showNotification(editingArticleId ? "Article updated successfully!" : "New article published successfully!");
  };

  // Article Image File Upload
  const handleArticleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const dataUrl = await compressImageFile(file, 1200, 0.82);
      setArticleFormData(prev => ({ ...prev, coverImage: dataUrl }));
      showNotification("Article image uploaded and compressed successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // -------------------------------------------------------------
  // PROPERTY HANDLERS
  // -------------------------------------------------------------
  const handleStartCreateProperty = () => {
    setEditingPropertyId(null);
    setPropertyFormData({
      title: '',
      location: '',
      price: '',
      propertyType: 'Residential Duplex',
      listingType: 'For Rent',
      bedrooms: '',
      bathrooms: '',
      coverImage: '',
      status: 'Available',
      description: ''
    });
    setPropertySubTab('editor');
  };

  const handleStartEditProperty = (prop) => {
    setEditingPropertyId(prop.id);
    setPropertyFormData({
      title: prop.title,
      location: prop.location,
      price: prop.price,
      propertyType: prop.propertyType,
      listingType: prop.listingType || 'For Rent',
      bedrooms: prop.bedrooms ? String(prop.bedrooms) : '',
      bathrooms: prop.bathrooms ? String(prop.bathrooms) : '',
      coverImage: prop.coverImage || '',
      status: prop.status || 'Available',
      description: prop.description || ''
    });
    setPropertySubTab('editor');
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property permanently?")) {
      await propertyStore.deleteProperty(id);
      loadData();
      showNotification("Property deleted successfully.");
    }
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    if (!propertyFormData.title || !propertyFormData.price || !propertyFormData.location) {
      alert("Please fill in Title, Location, and Price.");
      return;
    }

    const payload = {
      ...propertyFormData,
      bedrooms: propertyFormData.bedrooms ? parseInt(propertyFormData.bedrooms, 10) : 0,
      bathrooms: propertyFormData.bathrooms ? parseInt(propertyFormData.bathrooms, 10) : 0,
      ...(editingPropertyId ? { id: editingPropertyId } : {})
    };

    await propertyStore.saveProperty(payload);
    loadData();
    setPropertySubTab('list');
    showNotification(editingPropertyId ? "Property updated successfully!" : "New property listed successfully!");
  };

  // Property Image File Upload
  const handlePropertyImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const dataUrl = await compressImageFile(file, 1280, 0.85);
      setPropertyFormData(prev => ({ ...prev, coverImage: dataUrl }));
      showNotification("Property image uploaded and optimized successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // -------------------------------------------------------------
  // UNAUTHENTICATED LOGIN VIEW
  // -------------------------------------------------------------
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-amber-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto text-gold-600">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-950">Admin Portal Login</h2>
            <p className="text-xs text-slate-700 font-semibold">Royal Haven Realty & Property Managers Ltd.</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              Access Admin Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onReturnHome}
              className="text-xs text-slate-700 hover:text-gold-700 font-bold flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-amber-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/images/logo-emblem.jpg" alt="Logo" className="h-10 w-auto rounded-lg" />
            <div>
              <h1 className="font-serif text-lg font-bold text-gold-gradient">ROYAL HAVEN ADMIN PORTAL</h1>
              <p className="text-[10px] text-slate-400">Content, Properties &amp; Platform Controls</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onReturnHome}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              <span>View Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-semibold text-red-300 bg-red-950/60 border border-red-800/50 rounded-lg hover:bg-red-900 transition-colors flex items-center"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium text-xs shadow-md flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Module Switcher Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Articles Module */}
            <button
              onClick={() => {
                setActiveModule('articles');
                setArticleSubTab('list');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'articles'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blog Articles ({posts.length})</span>
            </button>

            {/* Properties Module */}
            <button
              onClick={() => {
                setActiveModule('properties');
                setPropertySubTab('list');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'properties'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Property Listings ({properties.length})</span>
            </button>

            {/* Inquiries / Leads Module */}
            <button
              onClick={() => setActiveModule('inquiries')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'inquiries'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Leads Inbox ({inquiries.length})</span>
            </button>

            {/* Remittances Module */}
            <button
              onClick={() => setActiveModule('remittances')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'remittances'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Owner Remittances ({remittances.length})</span>
            </button>

            {/* Maintenance & Invoices Module */}
            <button
              onClick={() => setActiveModule('maintenance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'maintenance'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Maintenance &amp; Invoices ({maintenanceList.length})</span>
            </button>

            {/* Document Vault Module */}
            <button
              onClick={() => setActiveModule('vault')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'vault'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>Document Vault ({documents.length})</span>
            </button>

            {/* Routine Inspections Module */}
            <button
              onClick={() => setActiveModule('inspections')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'inspections'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Inspections ({inspections.length})</span>
            </button>

            {/* Owner Accounts Module */}
            <button
              onClick={() => setActiveModule('owners')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'owners'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Owner Accounts ({owners.length})</span>
            </button>

            {/* Website Traffic Module */}
            <button
              onClick={() => setActiveModule('traffic')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'traffic'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Website Traffic ({trafficStats?.today ?? 0} Today)</span>
            </button>

            {/* Security Module */}
            <button
              onClick={() => setActiveModule('security')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeModule === 'security'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          <span className="text-xs text-slate-800 flex items-center space-x-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Master Admin Active</span>
          </span>
        </div>

        {/* Quick Website Traffic Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <button
            onClick={() => setActiveModule('traffic')}
            className="text-left flex items-center space-x-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 hover:bg-amber-100/70 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-slate-950 font-bold shadow-sm shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Today's Views</p>
              <p className="text-xl font-extrabold text-slate-950 flex items-center space-x-1.5">
                <span>{trafficStats?.today ?? 0}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">Live</span>
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Yesterday</p>
              <p className="text-xl font-extrabold text-slate-950">{trafficStats?.yesterday ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Past 7 Days</p>
              <p className="text-xl font-extrabold text-slate-950">{trafficStats?.last7Days ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-700 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">All-Time Views</p>
              <p className="text-xl font-extrabold text-slate-950">{trafficStats?.total ?? 0}</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODULE 1: BLOG ARTICLES                                    */}
        {/* ========================================================= */}
        {activeModule === 'articles' && (
          <div className="space-y-6">
            {articleSubTab === 'list' ? (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-950">Published &amp; Draft Articles</h3>
                    <p className="text-xs text-slate-600">Create and publish educational articles for website visitors</p>
                  </div>
                  <button
                    onClick={handleStartCreateArticle}
                    className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase rounded-xl shadow-sm hover:brightness-105 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                  </button>
                </div>

                {posts.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-slate-400" />
                    <p className="text-sm font-bold text-slate-900">No articles yet.</p>
                    <p className="text-xs text-slate-700 font-medium">Click "New Article" to write your first post.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Article</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={post.coverImage} 
                                  alt="" 
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                                />
                                <div>
                                  <p className="font-bold text-slate-950 line-clamp-1">{post.title}</p>
                                  <p className="text-[11px] text-slate-600 line-clamp-1">{post.summary}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                                {post.category}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-700">{post.date}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleArticleStatus(post.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  post.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {post.status}
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleStartEditArticle(post)}
                                  className="p-1.5 text-slate-600 hover:text-gold-700 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Edit Article"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(post.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* Article Editor */
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      {editingArticleId ? 'Edit Article' : 'Write New Article'}
                    </h3>
                    <p className="text-xs text-slate-600">Format using bold text (**text**) and clean paragraphs</p>
                  </div>
                  <button
                    onClick={() => setArticleSubTab('list')}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950"
                  >
                    Cancel &amp; Return
                  </button>
                </div>

                <form onSubmit={handleSaveArticle} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={articleFormData.title}
                      onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                      placeholder="e.g. Essential Landlord Tips for Rental Property Maintenance"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Category
                      </label>
                      <select
                        value={articleFormData.category}
                        onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                      >
                        <option value="Property Management">Property Management</option>
                        <option value="Tenant Screening">Tenant Screening</option>
                        <option value="Estate Surveying">Estate Surveying</option>
                        <option value="Real Estate Advisory">Real Estate Advisory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={articleFormData.author}
                        onChange={(e) => setArticleFormData({ ...articleFormData, author: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Cover Image with File Uploader & URL Input */}
                  <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                      Article Cover Image
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Preview */}
                      {articleFormData.coverImage ? (
                        <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
                          <img src={articleFormData.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] shrink-0">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span>No Image</span>
                        </div>
                      )}

                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2 w-full">
                        <label className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-gold-400" />
                          <span>{isUploadingImage ? 'Compressing Image...' : 'Upload Image from Device'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleArticleImageUpload} 
                            disabled={isUploadingImage}
                            className="hidden" 
                          />
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Select any photo from your phone or computer. It is automatically compressed to a fast-loading WebP image.
                        </p>

                        <div className="pt-1">
                          <input
                            type="url"
                            value={articleFormData.coverImage}
                            onChange={(e) => setArticleFormData({ ...articleFormData, coverImage: e.target.value })}
                            placeholder="Or paste an image web URL..."
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Short Summary
                    </label>
                    <textarea
                      rows={2}
                      value={articleFormData.summary}
                      onChange={(e) => setArticleFormData({ ...articleFormData, summary: e.target.value })}
                      placeholder="Brief 1-2 sentence preview for search results and cards..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Article Content *
                    </label>
                    <textarea
                      rows={10}
                      required
                      value={articleFormData.content}
                      onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                      placeholder="Write your article here..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setArticleSubTab('list')}
                      className="px-5 py-3 text-xs uppercase font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 text-xs uppercase tracking-widest font-bold text-slate-950 bg-gold-gradient rounded-xl hover:brightness-110 shadow-sm flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingArticleId ? 'Save Changes' : 'Publish Article'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 2: PROPERTY LISTINGS                               */}
        {/* ========================================================= */}
        {activeModule === 'properties' && (
          <div className="space-y-6">
            {propertySubTab === 'list' ? (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-950">Managed Property Listings</h3>
                    <p className="text-xs text-slate-600">List and showcase properties currently available or managed by Royal Haven</p>
                  </div>
                  <button
                    onClick={handleStartCreateProperty}
                    className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase rounded-xl shadow-sm hover:brightness-105 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="p-16 text-center text-slate-600 space-y-3">
                    <Home className="w-12 h-12 mx-auto text-slate-400" />
                    <h4 className="text-base font-bold text-slate-900">No properties listed yet</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Click "Add New Property" to upload and list your first property. It will immediately appear in the interactive slider on your website!
                    </p>
                    <button
                      onClick={handleStartCreateProperty}
                      className="mt-2 px-5 py-2.5 bg-slate-900 text-gold-400 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:bg-slate-800 inline-flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Property</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Property</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {properties.map((prop) => (
                          <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={prop.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
                                  alt="" 
                                  className="w-14 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                                />
                                <div>
                                  <p className="font-bold text-slate-950 line-clamp-1">{prop.title}</p>
                                  <p className="text-[11px] text-slate-600 flex items-center">
                                    <MapPin className="w-3 h-3 text-gold-600 mr-1 shrink-0" />
                                    <span>{prop.location}</span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                                {prop.propertyType}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-gold-800 text-sm">{prop.price}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                prop.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                                prop.status === 'Rented' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {prop.listingType} &bull; {prop.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleStartEditProperty(prop)}
                                  className="p-1.5 text-slate-600 hover:text-gold-700 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Edit Property"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(prop.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Property"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* Property Editor Form */
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      {editingPropertyId ? 'Edit Property Listing' : 'List New Property'}
                    </h3>
                    <p className="text-xs text-slate-600">Fill in the property details to showcase in the website slider</p>
                  </div>
                  <button
                    onClick={() => setPropertySubTab('list')}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950"
                  >
                    Cancel &amp; Return
                  </button>
                </div>

                <form onSubmit={handleSaveProperty} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={propertyFormData.title}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, title: e.target.value })}
                      placeholder="e.g. Contemporary 4-Bedroom Semi-Detached Duplex with BQ"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Location (District / City / State) *
                      </label>
                      <input
                        type="text"
                        required
                        value={propertyFormData.location}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, location: e.target.value })}
                        placeholder="e.g. Lekki Phase 1, Lagos State"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Price / Rent Rate *
                      </label>
                      <input
                        type="text"
                        required
                        value={propertyFormData.price}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, price: e.target.value })}
                        placeholder="e.g. ₦12,000,000 / annum or ₦150,000,000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Property Type
                      </label>
                      <select
                        value={propertyFormData.propertyType}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, propertyType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                      >
                        <option value="Residential Duplex">Residential Duplex</option>
                        <option value="Apartment / Flat">Apartment / Flat</option>
                        <option value="Terrace House">Terrace House</option>
                        <option value="Commercial Complex">Commercial Complex</option>
                        <option value="Office Space">Office Space</option>
                        <option value="Serviced Shortlet">Serviced Shortlet</option>
                        <option value="Prime Land / Plot">Prime Land / Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Listing Type
                      </label>
                      <select
                        value={propertyFormData.listingType}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, listingType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                      >
                        <option value="For Rent">For Rent</option>
                        <option value="For Sale">For Sale</option>
                        <option value="Managed Asset">Managed Asset</option>
                        <option value="Shortlet">Shortlet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Availability Status
                      </label>
                      <select
                        value={propertyFormData.status}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Bedrooms (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 4 (Leave blank if not applicable)"
                        value={propertyFormData.bedrooms}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, bedrooms: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                        Bathrooms (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 3 (Leave blank if not applicable)"
                        value={propertyFormData.bathrooms}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, bathrooms: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Property Cover Image with Device Uploader & URL Input */}
                  <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                      Property Cover Image
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Preview */}
                      {propertyFormData.coverImage ? (
                        <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
                          <img src={propertyFormData.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-36 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] shrink-0">
                          <Home className="w-6 h-6 mb-1" />
                          <span>No Image Selected</span>
                        </div>
                      )}

                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2 w-full">
                        <label className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-gold-400" />
                          <span>{isUploadingImage ? 'Optimizing Image...' : 'Upload Image from Device'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePropertyImageUpload} 
                            disabled={isUploadingImage}
                            className="hidden" 
                          />
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Select any photo from your phone gallery or computer. Automatically compressed and optimized.
                        </p>

                        <div className="pt-1">
                          <input
                            type="url"
                            value={propertyFormData.coverImage}
                            onChange={(e) => setPropertyFormData({ ...propertyFormData, coverImage: e.target.value })}
                            placeholder="Or paste an image web URL..."
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Property Overview &amp; Key Features
                    </label>
                    <textarea
                      rows={5}
                      value={propertyFormData.description}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
                      placeholder="Detail the property layout, compound space, generator/power infrastructure, security, service charges, etc."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPropertySubTab('list')}
                      className="px-5 py-3 text-xs uppercase font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 text-xs uppercase tracking-widest font-bold text-slate-950 bg-gold-gradient rounded-xl hover:brightness-110 shadow-sm flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPropertyId ? 'Update Property' : 'Publish Property Listing'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 3: SECURITY & PASSWORD                             */}
        {/* ========================================================= */}
        {activeModule === 'security' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 max-w-xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center">
                <KeyRound className="w-5 h-5 text-gold-600 mr-2" />
                Change Master Admin Password
              </h3>
              <p className="text-xs text-slate-600">Update your access credentials for the Royal Haven Admin Portal</p>
            </div>

            {pwdSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-xs uppercase tracking-widest font-bold text-slate-950 bg-gold-gradient rounded-xl hover:brightness-110 shadow-sm transition-all cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 4: CLIENT LEADS & INQUIRIES INBOX                   */}
        {/* ========================================================= */}
        {activeModule === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <Inbox className="w-5 h-5 text-gold-600" />
                  <span>Consultation &amp; Property Owner Leads Inbox</span>
                </h3>
                <p className="text-xs text-slate-600">Messages and management inquiries submitted via royalhaven.com.ng</p>
              </div>
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-lg self-start sm:self-auto">
                {inquiries.filter(i => i.status === 'pending').length} Pending Follow-up
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Inbox className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-900">No inquiries yet.</p>
                <p className="text-xs text-slate-500">Website consultation requests will automatically populate here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 px-6 pb-6 space-y-4">
                {inquiries.map((lead) => (
                  <div key={lead.id} className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:border-gold-500/50 transition-colors bg-slate-50/50">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-serif font-bold text-base text-slate-950">{lead.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'contacted' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {lead.status === 'contacted' ? 'Contacted' : 'Pending'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{lead.date}</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="font-semibold text-gold-700">Service: {lead.service}</span>
                        <span>Location: <strong>{lead.location || 'Not specified'}</strong></span>
                        <a href={`tel:${lead.phone}`} className="text-amber-800 hover:underline font-bold">
                          Phone: {lead.phone}
                        </a>
                        <a href={`mailto:${lead.email}`} className="text-slate-700 hover:underline">
                          Email: {lead.email}
                        </a>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic mt-2">
                        "{lead.notes || 'No message notes.'}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleInquiryStatus(lead.id, lead.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          lead.status === 'contacted'
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {lead.status === 'contacted' ? 'Mark Pending' : 'Mark Contacted'}
                      </button>

                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Royal%20Haven%20Realty%20following%20up%20on%20your%20property%20management%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold"
                      >
                        WhatsApp
                      </a>

                      <button
                        onClick={() => handleDeleteInquiry(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 5: OWNER REMITTANCES RECORDER                       */}
        {/* ========================================================= */}
        {activeModule === 'remittances' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gold-600" />
                  <span>Owner Remittances &amp; Financial Statements</span>
                </h3>
                <p className="text-xs text-slate-600">Dispatched rent remittances synced live to the Property Owner Portal</p>
              </div>

              <button
                onClick={() => setShowAddRemittanceModal(true)}
                className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase rounded-xl shadow-sm hover:brightness-105 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Record New Remittance</span>
              </button>
            </div>

            <div className="p-6 pt-0 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Property</th>
                    <th className="p-3">Reference Code</th>
                    <th className="p-3 text-right">Gross Rent</th>
                    <th className="p-3 text-right">Management Fee</th>
                    <th className="p-3 text-right">Net Remitted</th>
                    <th className="p-3 text-center">Beneficiary Bank</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {remittances.map((rem) => (
                    <tr key={rem.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-600">{rem.date}</td>
                      <td className="p-3 font-bold text-slate-900">{rem.propertyName}</td>
                      <td className="p-3 font-mono text-slate-500">{rem.referenceCode}</td>
                      <td className="p-3 text-right font-mono text-slate-800">
                        ₦{(rem.deductions?.grossRent || rem.amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-red-600">
                        - ₦{(rem.deductions?.managementFee || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-700 font-mono text-sm">
                        ₦{(rem.deductions?.netRemitted || rem.amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium">
                        {rem.beneficiaryBank}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRemittance(rem)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Remittance Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal to Log Remittance */}
            {showAddRemittanceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-serif text-lg font-bold text-slate-950">Record Owner Remittance</h4>
                    <button onClick={() => setShowAddRemittanceModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={handleCreateRemittance} className="space-y-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-900">Select Managed Property</label>
                        <span className="text-[10px] text-amber-700 font-bold uppercase">⚡ Auto-Calculates 90/10 Split</span>
                      </div>
                      <select
                        value={remittanceFormData.propertyName}
                        onChange={(e) => handleRemittancePropertySelect(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                        required
                      >
                        <option value="">— Select Managed Property —</option>
                        {managedProperties.map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.city || 'Lagos'})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Gross Rent Collected (₦)</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 5000000"
                          value={remittanceFormData.grossRent}
                          onChange={(e) => setRemittanceFormData(prev => ({ ...prev, grossRent: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Management Fee (10%) (₦)</label>
                        <input
                          type="number"
                          placeholder="Auto 10% if left blank"
                          value={remittanceFormData.managementFee}
                          onChange={(e) => setRemittanceFormData(prev => ({ ...prev, managementFee: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Maintenance Deductions (₦)</label>
                      <input
                        type="number"
                        placeholder="e.g. 150000 (leave 0 if none)"
                        value={remittanceFormData.maintenanceCost}
                        onChange={(e) => setRemittanceFormData(prev => ({ ...prev, maintenanceCost: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Beneficiary Bank</label>
                        <input
                          type="text"
                          value={remittanceFormData.beneficiaryBank}
                          onChange={(e) => setRemittanceFormData(prev => ({ ...prev, beneficiaryBank: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={remittanceFormData.beneficiaryAccount}
                          onChange={(e) => setRemittanceFormData(prev => ({ ...prev, beneficiaryAccount: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Statement Description / Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Q3 2026 rent remittance for Flat 1A and 1B"
                        value={remittanceFormData.description}
                        onChange={(e) => setRemittanceFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddRemittanceModal(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105"
                      >
                        Post Remittance
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE: FACILITY MAINTENANCE & CONTRACTOR INVOICES       */}
        {/* ========================================================= */}
        {activeModule === 'maintenance' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-gold-600" />
                  <span>Facility Maintenance &amp; Contractor Invoices</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Audited work orders and verified contractor receipts. In accordance with property accounting standards, repair logs cannot be overwritten.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMaintenanceFormData({
                    propertyId: managedProperties[0]?.id || '',
                    propertyName: managedProperties[0]?.name || '',
                    unitNumber: '',
                    title: '',
                    description: '',
                    contractor: '',
                    actualCost: '',
                    invoiceUrl: null,
                    invoiceName: null,
                    status: 'in_progress'
                  });
                  setShowLogMaintenanceModal(true);
                }}
                className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 flex items-center space-x-1.5 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Log Maintenance Order</span>
              </button>
            </div>

            {maintenanceList.length === 0 ? (
              <div className="p-16 text-center text-slate-600 space-y-3">
                <Wrench className="w-12 h-12 mx-auto text-slate-400" />
                <h4 className="text-base font-bold text-slate-900">No maintenance tickets logged yet</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Click "Log Maintenance Order" to register a repair work order with contractor receipts.
                </p>
              </div>
            ) : (
              <div className="p-6 pt-0 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Property &amp; Unit</th>
                      <th className="p-3">Work Order / Issue</th>
                      <th className="p-3">Contractor</th>
                      <th className="p-3 text-right">Audited Cost</th>
                      <th className="p-3">Contractor Invoice</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {maintenanceList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <strong className="text-slate-950 font-bold block text-sm">{item.propertyName}</strong>
                          <span className="text-[11px] text-slate-500">{item.unitNumber || 'Whole Building'}</span>
                        </td>
                        <td className="p-3 max-w-xs space-y-1">
                          <p className="font-bold text-slate-900">{item.title || item.issue}</p>
                          {item.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2">{item.description}</p>
                          )}
                          <span className="text-[10px] text-slate-400 block">Reported: {item.reportedDate}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900">{item.contractor || 'Vetted Contractor'}</span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-amber-900 text-sm">
                          ₦{Number(item.actualCost || item.cost || item.estimatedCost || 0).toLocaleString()}
                        </td>
                        <td className="p-3">
                          {item.invoiceUrl ? (
                            <a
                              href={item.invoiceUrl}
                              download={item.invoiceName || `${item.propertyName}-Invoice.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-700" />
                              <span className="truncate max-w-[120px]">{item.invoiceName || 'View Invoice'}</span>
                            </a>
                          ) : (
                            <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors">
                              <Paperclip className="w-3 h-3 text-slate-500" />
                              <span>Attach Invoice</span>
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                className="hidden"
                                onChange={(e) => handleInvoiceUploadForTicket(item.id, e.target.files[0])}
                              />
                            </label>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {item.status === 'completed' ? 'Resolved' : 'In Progress'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleMaintenanceStatus(item)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                item.status === 'completed'
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {item.status === 'completed' ? 'Reopen' : 'Mark Resolved'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaintenance(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="Delete from Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE: SECURE ASSET DOCUMENT VAULT                       */}
        {/* ========================================================= */}
        {activeModule === 'vault' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <FolderArchive className="w-5 h-5 text-gold-600" />
                  <span>Secure Asset Document Vault</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Upload official title deeds, survey plans, C of O, and executed tenancy agreements. These documents are directly accessible to property owners in their portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <select
                  value={docFilterProp}
                  onChange={(e) => setDocFilterProp(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Managed Buildings ({documents.length})</option>
                  {managedProperties.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setDocFormData({
                      propertyId: managedProperties[0]?.id || '',
                      propertyName: managedProperties[0]?.name || '',
                      title: '',
                      documentType: 'Certificate of Occupancy (C of O)',
                      fileUrl: '',
                      fileName: '',
                      fileSize: ''
                    });
                    setShowAddDocModal(true);
                  }}
                  className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
            </div>

            {(() => {
              const filteredDocs = docFilterProp === 'all' 
                ? documents 
                : documents.filter(d => d.propertyName?.toLowerCase() === docFilterProp.toLowerCase() || d.propertyId === docFilterProp);

              if (filteredDocs.length === 0) {
                return (
                  <div className="p-16 text-center text-slate-600 space-y-3">
                    <FolderArchive className="w-12 h-12 mx-auto text-slate-400" />
                    <h4 className="text-base font-bold text-slate-900">No documents in the vault yet</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Click "Upload Document" to archive official title deeds, tenancy agreements, or financial statements.
                    </p>
                  </div>
                );
              }

              return (
                <div className="p-6 pt-0 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Document Title</th>
                        <th className="p-3">Building / Asset</th>
                        <th className="p-3">Document Type</th>
                        <th className="p-3">Date Added</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <strong className="text-slate-950 font-bold block text-sm">{doc.title}</strong>
                                {doc.fileName && <span className="text-[10px] text-slate-400 block">{doc.fileName}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-slate-900">
                            {doc.propertyName}
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              {doc.documentType || 'Title Deed'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {doc.date || '—'}
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px]">
                            {doc.fileSize || 'Digital PDF'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {doc.fileUrl && doc.fileUrl !== '#' ? (
                                <a
                                  href={doc.fileUrl}
                                  download={doc.fileName || `${doc.title}.pdf`}
                                  className="p-1.5 text-slate-700 hover:text-gold-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-xs"
                                  title="Download Document"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </a>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc)}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Document from Vault"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Modal: Upload Document */}
            {showAddDocModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <FolderArchive className="w-5 h-5 text-gold-600" />
                      <h4 className="font-serif text-lg font-bold text-slate-950">Upload Document to Vault</h4>
                    </div>
                    <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
                  </div>

                  <form onSubmit={handleSaveDocument} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Select Managed Building *</label>
                      <select
                        value={docFormData.propertyName}
                        onChange={(e) => {
                          const selected = managedProperties.find(p => p.name === e.target.value);
                          setDocFormData(prev => ({
                            ...prev,
                            propertyName: e.target.value,
                            propertyId: selected ? selected.id : ''
                          }));
                        }}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value="">— Select Building —</option>
                        {managedProperties.map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.city || 'Lagos'})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Document Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Certificate of Occupancy (C of O) & Building Approval"
                        value={docFormData.title}
                        onChange={(e) => setDocFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Document Category / Classification</label>
                      <select
                        value={docFormData.documentType}
                        onChange={(e) => setDocFormData(prev => ({ ...prev, documentType: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      >
                        <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
                        <option value="Governor's Consent & Title Deed">Governor's Consent & Title Deed</option>
                        <option value="Executed Tenancy Agreement">Executed Tenancy Agreement</option>
                        <option value="Registered Survey Plan">Registered Survey Plan</option>
                        <option value="Comprehensive Financial Statement">Comprehensive Financial Statement</option>
                        <option value="Building Insurance & Tax Clearance">Building Insurance & Tax Clearance</option>
                        <option value="Facility Condition Audit">Facility Condition Audit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Attach Document File (PDF or Image)</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                        <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <p className="text-slate-600 font-medium">Click to choose PDF, DOC, or Image file</p>
                        {docFormData.fileName && (
                          <p className="text-xs font-bold text-emerald-700 mt-2">
                            Attached: {docFormData.fileName} ({docFormData.fileSize})
                          </p>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          className="mt-2 block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-gold-400 cursor-pointer"
                          onChange={(e) => handleDocumentFileUpload(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddDocModal(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                      >
                        Save to Vault
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE: ROUTINE PHYSICAL INSPECTION SESSIONS             */}
        {/* ========================================================= */}
        {activeModule === 'inspections' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <ClipboardCheck className="w-5 h-5 text-gold-600" />
                  <span>Routine Property Inspection Sessions</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Conduct structural reviews, physical audits, and preventive facility assessments. Published audits appear directly on the landlord's dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <select
                  value={inspFilterProp}
                  onChange={(e) => setInspFilterProp(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Managed Buildings ({inspections.length})</option>
                  {managedProperties.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setInspFormData({
                      propertyId: managedProperties[0]?.id || '',
                      propertyName: managedProperties[0]?.name || '',
                      inspectorName: 'Engr. Babajide Fasola (Lead Facility Manager)',
                      inspectionDate: new Date().toISOString().split('T')[0],
                      overallCondition: 'Excellent',
                      reportType: 'Quarterly Routine Audit',
                      notes: '',
                      photos: []
                    });
                    setShowAddInspModal(true);
                  }}
                  className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Inspection Audit</span>
                </button>
              </div>
            </div>

            {(() => {
              const filteredInsps = inspFilterProp === 'all'
                ? inspections
                : inspections.filter(i => i.propertyName?.toLowerCase() === inspFilterProp.toLowerCase() || i.propertyId === inspFilterProp);

              if (filteredInsps.length === 0) {
                return (
                  <div className="p-16 text-center text-slate-600 space-y-3">
                    <ClipboardCheck className="w-12 h-12 mx-auto text-slate-400" />
                    <h4 className="text-base font-bold text-slate-900">No inspection audits logged yet</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Click "Log Inspection Audit" to record a physical condition review, structural observations, and field photos.
                    </p>
                  </div>
                );
              }

              return (
                <div className="p-6 pt-0 space-y-4">
                  {filteredInsps.map((insp) => (
                    <div key={insp.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                        <div>
                          <h4 className="font-serif text-base font-bold text-slate-950">{insp.propertyName}</h4>
                          <p className="text-xs text-slate-500">
                            Inspected by: <strong className="text-slate-800">{insp.inspectorName}</strong> • {insp.reportType || 'Routine Audit'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-slate-500 font-medium">{insp.inspectionDate}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            insp.overallCondition === 'Excellent' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            insp.overallCondition === 'Good' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            insp.overallCondition === 'Fair' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            Condition: {insp.overallCondition}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteInspection(insp)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Inspection"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                        "{insp.notes}"
                      </div>

                      {insp.photos && insp.photos.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Field Photos ({insp.photos.length})</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {insp.photos.map((ph, idx) => (
                              <div key={idx} className="h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                <img src={ph} alt="Inspection" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Modal: Log Inspection */}
            {showAddInspModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <ClipboardCheck className="w-5 h-5 text-gold-600" />
                      <h4 className="font-serif text-lg font-bold text-slate-950">Log Routine Inspection Audit</h4>
                    </div>
                    <button onClick={() => setShowAddInspModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
                  </div>

                  <form onSubmit={handleSaveInspection} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Select Managed Building *</label>
                      <select
                        value={inspFormData.propertyName}
                        onChange={(e) => {
                          const selected = managedProperties.find(p => p.name === e.target.value);
                          setInspFormData(prev => ({
                            ...prev,
                            propertyName: e.target.value,
                            propertyId: selected ? selected.id : ''
                          }));
                        }}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value="">— Select Building —</option>
                        {managedProperties.map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.city || 'Lagos'})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Inspector Full Name &amp; Role</label>
                        <input
                          type="text"
                          required
                          value={inspFormData.inspectorName}
                          onChange={(e) => setInspFormData(prev => ({ ...prev, inspectorName: e.target.value }))}
                          placeholder="e.g. Engr. Babajide Fasola"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Inspection Date</label>
                        <input
                          type="date"
                          required
                          value={inspFormData.inspectionDate}
                          onChange={(e) => setInspFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Overall Condition Rating</label>
                        <select
                          value={inspFormData.overallCondition}
                          onChange={(e) => setInspFormData(prev => ({ ...prev, overallCondition: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                        >
                          <option value="Excellent">Excellent — Optimal Standard</option>
                          <option value="Good">Good — Normal Wear &amp; Tear</option>
                          <option value="Fair">Fair — Minor Attention Required</option>
                          <option value="Needs Attention">Needs Attention — Immediate Repair</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Audit Type</label>
                        <select
                          value={inspFormData.reportType}
                          onChange={(e) => setInspFormData(prev => ({ ...prev, reportType: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        >
                          <option value="Quarterly Routine Audit">Quarterly Routine Audit</option>
                          <option value="Move-in Condition Audit">Move-in Condition Audit</option>
                          <option value="Move-out Tenancy Audit">Move-out Tenancy Audit</option>
                          <option value="Structural &amp; Safety Check">Structural &amp; Safety Check</option>
                          <option value="Annual Preventive Check">Annual Preventive Check</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Audit Notes &amp; Observations *</label>
                      <textarea
                        required
                        rows={4}
                        value={inspFormData.notes}
                        onChange={(e) => setInspFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Detailed observations regarding roof drainage, plumbing, electrical distribution, fixtures, and tenant occupancy state..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Upload Site Inspection Photos</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleInspectionPhotoUpload(e.target.files)}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-gold-400 cursor-pointer"
                      />
                      {inspFormData.photos && inspFormData.photos.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto py-1">
                          {inspFormData.photos.map((p, i) => (
                            <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                              <img src={p} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddInspModal(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                      >
                        Publish Inspection
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 6: PROPERTY OWNER CLIENT ACCOUNTS                 */}
        {/* ========================================================= */}
        {activeModule === 'owners' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gold-600" />
                  <span>Property Owner Accounts</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Manage registered property owners, view their remittance bank details, or onboard new property owners directly.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenOnboardModal()}
                  className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  <span>➕ Onboard Managed Property</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddOwnerModal(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Owner</span>
                </button>
              </div>
            </div>

            {/* Activated Property Banner with 1-Click WhatsApp Welcome Link */}
            {activatedPropertyData && (
              <div className="mx-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-slate-800 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>🎉 "{activatedPropertyData.propertyName}" is Activated for {activatedPropertyData.ownerName}!</span>
                  </div>
                  <button onClick={() => setActivatedPropertyData(null)} className="text-xs text-slate-400 hover:text-slate-600">✕ Dismiss</button>
                </div>
                <p className="text-xs text-slate-600">
                  The property, units, and dashboard are live. Send {activatedPropertyData.ownerName} their portal link:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Hello ${activatedPropertyData.ownerName},\nYour property "${activatedPropertyData.propertyName}" is now live on your Royal Haven Owner Portal!\n\nLog in at https://www.royalhaven.com.ng/#portal to monitor your tenants, rent payments, and remittance statements.`;
                      navigator.clipboard.writeText(msg);
                      alert("Welcome message copied to clipboard!");
                    }}
                    className="px-3 py-1.5 bg-white border border-emerald-400 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-emerald-100 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Welcome Message</span>
                  </button>
                  {activatedPropertyData.ownerPhone && (
                    <a
                      href={`https://wa.me/${activatedPropertyData.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${activatedPropertyData.ownerName}, your property "${activatedPropertyData.propertyName}" is now live on your Royal Haven Owner Portal.\n\nPortal Link: https://www.royalhaven.com.ng/#portal\n\nYou can view your live tenants, rental payments, and download remittance receipts.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-emerald-700"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Welcome on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Incoming Property Submissions Queue */}
            {onboardingSubmissions && onboardingSubmissions.filter(s => s.status === 'pending').length > 0 && (
              <div className="mx-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-700" />
                      Incoming Property Submissions ({onboardingSubmissions.filter(s => s.status === 'pending').length} Pending)
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium">Submitted by landlords via Owner Portal</span>
                </div>

                <div className="space-y-2">
                  {onboardingSubmissions.filter(s => s.status === 'pending').map(sub => (
                    <div key={sub.id} className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <strong className="text-slate-900 font-bold text-sm">{sub.propertyName}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                            {sub.propertyType || 'Residential'}
                          </span>
                          <span className="text-xs text-slate-500">• {sub.unitsCount || 1} Units</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Owner: <span className="font-semibold text-slate-900">{sub.ownerName || sub.ownerEmail}</span> ({sub.ownerPhone || 'No phone'}) | Expected Rent: <span className="font-bold text-emerald-700">₦{Number(sub.targetRent || 0).toLocaleString()}</span>
                        </p>
                        {sub.address && <p className="text-[11px] text-slate-500 italic">Location: {sub.address}</p>}
                        {sub.notes && <p className="text-[11px] text-slate-500">Note: "{sub.notes}"</p>}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApproveSubmission(sub)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve &amp; Activate</span>
                        </button>
                        {sub.ownerPhone && (
                          <a
                            href={`https://wa.me/${sub.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${sub.ownerName || 'Sir/Ma'}, this is Royal Haven regarding your property onboarding submission for "${sub.propertyName}".`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200"
                          >
                            WhatsApp
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDismissSubmission(sub.id)}
                          className="px-2.5 py-2 text-slate-400 hover:text-red-600 text-xs font-semibold cursor-pointer"
                          title="Dismiss submission"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created Owner Success Notification with Copy Credentials */}
            {createdOwnerCreds && (
              <div className="mx-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Account Created for {createdOwnerCreds.fullName}!</span>
                  </div>
                  <button
                    onClick={() => setCreatedOwnerCreds(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕ Dismiss
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Login Email: <strong className="text-slate-900">{createdOwnerCreds.email}</strong> | Temporary Password: <strong className="text-slate-900 font-mono">{createdOwnerCreds.password}</strong>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      const msg = `Hello ${createdOwnerCreds.fullName},\nYour Royal Haven Property Owner Portal account has been created!\n\nPortal URL: https://www.royalhaven.com.ng/#portal\nEmail: ${createdOwnerCreds.email}\nPassword: ${createdOwnerCreds.password}\n\nPlease sign in to monitor your properties and remittance statements.`;
                      navigator.clipboard.writeText(msg);
                      alert("Login credentials copied to clipboard!");
                    }}
                    className="px-3 py-1.5 bg-white border border-emerald-400 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-emerald-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Login Details</span>
                  </button>

                  {createdOwnerCreds.phone && (
                    <a
                      href={`https://wa.me/${createdOwnerCreds.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${createdOwnerCreds.fullName}, your Royal Haven Property Owner Portal account is ready.\n\nPortal Link: https://www.royalhaven.com.ng/#portal\nEmail: ${createdOwnerCreds.email}\nPassword: ${createdOwnerCreds.password}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-emerald-700"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Table of Owners */}
            <div className="p-6 pt-0 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Client / Property Owner</th>
                    <th className="p-3">Login Email &amp; Phone</th>
                    <th className="p-3">Remittance Bank &amp; Account</th>
                    <th className="p-3">Assigned Property</th>
                    <th className="p-3 text-center">Manage Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {owners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <strong className="text-slate-950 font-bold block text-sm">{owner.fullName}</strong>
                        <span className="text-[10px] text-emerald-700 font-semibold uppercase">Verified Owner</span>
                      </td>
                      <td className="p-3 space-y-0.5">
                        <div className="text-slate-900 font-medium">{owner.email}</div>
                        <div className="text-slate-500 text-[11px]">{owner.phone || '—'}</div>
                      </td>
                      <td className="p-3 space-y-0.5">
                        <span className="font-bold text-slate-900 block">{owner.bankName || '—'}</span>
                        <span className="font-mono text-slate-600">{owner.accountNumber || '—'}</span>
                        {owner.accountName && <span className="text-[10px] text-slate-400 block truncate">{owner.accountName}</span>}
                      </td>
                      <td className="p-3">
                        {(() => {
                          const assigned = owner.assignedProperties && owner.assignedProperties.length > 0 
                            ? owner.assignedProperties.filter(p => !p.includes('Royal Crest') && !p.includes('Haven Terraces')).join(", ")
                            : null;
                          if (assigned) {
                            return (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1">
                                🏢 {assigned}
                              </span>
                            );
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleOpenEditOwner(owner)}
                              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                              title="Click to assign a property to this owner"
                            >
                              ➕ Link Property Now
                            </button>
                          );
                        })()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAccessClientPortal(owner)}
                            className="px-3 py-1.5 bg-gold-gradient text-slate-950 hover:brightness-110 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                            title={`Open ${owner.fullName}'s Owner Portal`}
                          >
                            Enter Portal
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenOnboardModal(owner)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            title={`Onboard a new property for ${owner.fullName}`}
                          >
                            + Onboard
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditOwner(owner)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>

                          <a
                            href={`https://wa.me/${(owner.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${owner.fullName}, this is Royal Haven Property Management regarding your portfolio.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all"
                          >
                            WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteOwner(owner)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Managed Buildings, Units & Tenants Section */}
            <div className="p-6 border-t border-slate-200 space-y-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-950 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gold-600" />
                    <span>Managed Buildings, Units &amp; Tenants ({managedProperties.length})</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Edit tenancy records, rent amounts, lease expiry dates, or trigger automatic 90/10 remittances.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenOnboardModal()}
                  className="px-3 py-1.5 bg-slate-900 text-gold-400 hover:bg-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Onboard New Building</span>
                </button>
              </div>

              {managedProperties.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                  No managed buildings onboarded yet. Click "Onboard Managed Property" above to link a building.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {managedProperties.map(prop => {
                    const occupied = (prop.units || []).filter(u => u.status === 'occupied').length;
                    const totalUnits = (prop.units || []).length || prop.unitsCount || 1;
                    const totalRent = (prop.units || []).reduce((sum, u) => sum + Number(u.rentAmount || 0), 0);
                    const owner = owners.find(o => o.id === prop.ownerId || o.email === prop.ownerEmail || (o.assignedProperties || []).includes(prop.name));

                    return (
                      <div key={prop.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-serif text-base font-bold text-slate-950">{prop.name}</h5>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-gold-600 shrink-0" />
                                <span>{prop.address || 'Lagos, Nigeria'}</span>
                              </p>
                            </div>
                            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold shrink-0">
                              {occupied}/{totalUnits} Occupied
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Assigned Landlord:</span>
                              <strong className="text-slate-900 font-semibold">{owner?.fullName || prop.ownerEmail || 'Registered Owner'}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Annual Gross Rent:</span>
                              <strong className="text-emerald-700 font-bold font-mono">₦{totalRent.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Auto Monthly Net (90%):</span>
                              <strong className="text-amber-800 font-bold font-mono">₦{Math.round((totalRent / 12) * 0.9).toLocaleString()}</strong>
                            </div>
                          </div>

                          {/* Preview of Units */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Flats &amp; Active Tenants</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(prop.units || []).map((u, i) => (
                                <span
                                  key={u.id || i}
                                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                    u.status === 'occupied'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {u.unitNumber}: {u.status === 'occupied' ? (u.tenant?.fullName || 'Occupied') : 'Vacant'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUnits(prop)}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-gold-400 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Units &amp; Tenants</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAutoFillRemittance(prop)}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Auto-Remit (90/10)</span>
                          </button>

                          {owner && (
                            <button
                              type="button"
                              onClick={() => handleAccessClientPortal(owner)}
                              className="px-3 py-2 bg-gold-gradient text-slate-950 hover:brightness-110 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                            >
                              Enter Portal
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteManagedProperty(prop)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 ml-auto"
                            title="Delete Managed Building"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal for Onboarding Managed Property */}
            {showOnboardPropertyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-slate-950">Onboard Managed Property</h4>
                        <p className="text-[11px] text-slate-500">Attach building, units, and tenancy to a landlord's live digital dashboard.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOnboardPropertyModal(false)}
                      className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer text-base"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAdminOnboardSubmit} className="space-y-4 text-xs">
                    {/* Step 1: Owner Selection */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs uppercase tracking-wider text-gold-700 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          1. Landlord / Property Owner
                        </span>
                        <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white text-[11px]">
                          <button
                            type="button"
                            onClick={() => setOnboardPropertyForm(prev => ({ ...prev, ownerMode: 'existing' }))}
                            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              onboardPropertyForm.ownerMode === 'existing'
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Existing Owner
                          </button>
                          <button
                            type="button"
                            onClick={() => setOnboardPropertyForm(prev => ({ ...prev, ownerMode: 'new' }))}
                            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              onboardPropertyForm.ownerMode === 'new'
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            + New Owner
                          </button>
                        </div>
                      </div>

                      {onboardPropertyForm.ownerMode === 'existing' ? (
                        <div>
                          <label className="block font-bold text-slate-900 mb-1">Select Registered Owner</label>
                          <select
                            required
                            value={onboardPropertyForm.ownerId}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, ownerId: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium"
                          >
                            <option value="">— Select Owner from System —</option>
                            {owners.map(o => (
                              <option key={o.id} value={o.id}>
                                {o.fullName} ({o.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">Landlord Full Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Chief Babatunde Adeleke"
                                value={onboardPropertyForm.newOwnerName}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerName: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">Login Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="client@gmail.com"
                                value={onboardPropertyForm.newOwnerEmail}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerEmail: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">WhatsApp Phone Number</label>
                              <input
                                type="tel"
                                placeholder="+234 803 000 0000"
                                value={onboardPropertyForm.newOwnerPhone}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerPhone: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">Assign Login Password</label>
                              <input
                                type="text"
                                placeholder="Leave blank to auto-generate"
                                value={onboardPropertyForm.newOwnerPassword}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerPassword: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">Payout Bank Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Zenith Bank"
                                value={onboardPropertyForm.newOwnerBank}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerBank: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-900 mb-1">10-Digit Account Number</label>
                              <input
                                type="text"
                                maxLength={10}
                                placeholder="0123456789"
                                value={onboardPropertyForm.newOwnerAccount}
                                onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, newOwnerAccount: e.target.value }))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Property & Units Details */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider text-gold-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        2. Managed Property &amp; Units
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-900 mb-1">Property / Estate Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Royal Haven Duplex Court"
                            value={onboardPropertyForm.propertyName}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, propertyName: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-900 mb-1">Property Type</label>
                          <select
                            value={onboardPropertyForm.propertyType}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, propertyType: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          >
                            <option value="Residential Apartment">Residential Apartment</option>
                            <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                            <option value="Fully Detached Luxury Villa">Fully Detached Luxury Villa</option>
                            <option value="Block of Commercial Flats">Block of Commercial Flats</option>
                            <option value="Serviced Terrace">Serviced Terrace</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-900 mb-1">Address &amp; Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
                            value={onboardPropertyForm.address}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-900 mb-1">Total Units</label>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              required
                              value={onboardPropertyForm.unitsCount}
                              onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, unitsCount: e.target.value }))}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-900 mb-1">Rent / Unit (₦)</label>
                            <input
                              type="number"
                              placeholder="e.g. 5000000"
                              value={onboardPropertyForm.targetRent}
                              onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, targetRent: e.target.value }))}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Optional Active Tenant Setup */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider text-gold-700 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        3. Initial Tenant Setup (Optional - can be updated anytime)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Tenant Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. Kelechi Nwosu"
                            value={onboardPropertyForm.tenantName}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, tenantName: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Tenant Phone</label>
                          <input
                            type="tel"
                            placeholder="+234 802 000 0000"
                            value={onboardPropertyForm.tenantPhone}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, tenantPhone: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Lease Expiry Date</label>
                          <input
                            type="date"
                            value={onboardPropertyForm.leaseEnd}
                            onChange={(e) => setOnboardPropertyForm(prev => ({ ...prev, leaseEnd: e.target.value }))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowOnboardPropertyModal(false)}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 shadow-md flex items-center space-x-2 cursor-pointer"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Complete Onboarding &amp; Activate</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal to Create Client Account */}
            {showAddOwnerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-950">Register Property Owner</h4>
                      <p className="text-[11px] text-slate-500">Registers client directly on Supabase and creates portal access.</p>
                    </div>
                    <button onClick={() => setShowAddOwnerModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={handleCreateOwner} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Property Owner Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chief Adebayo Adeleke"
                        value={ownerFormData.fullName}
                        onChange={(e) => setOwnerFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Email Address (Login)</label>
                        <input
                          type="email"
                          required
                          placeholder="client@gmail.com"
                          value={ownerFormData.email}
                          onChange={(e) => setOwnerFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Assign Password</label>
                        <input
                          type="text"
                          required
                          placeholder="Temporary password"
                          value={ownerFormData.password}
                          onChange={(e) => setOwnerFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+234 803 000 0000"
                          value={ownerFormData.phone}
                          onChange={(e) => setOwnerFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Assign Managed Property</label>
                        <select
                          value={ownerFormData.assignedProperty}
                          onChange={(e) => setOwnerFormData(prev => ({ ...prev, assignedProperty: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        >
                          <option value="">— Select Managed Property or Leave Pending —</option>
                          {managedProperties.map(p => (
                            <option key={p.id} value={p.name}>{p.name} ({p.city || 'Lagos'})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase text-gold-700">
                        Remittance Bank Account Details
                      </span>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Bank Name (e.g. Zenith Bank)"
                            value={ownerFormData.bankName}
                            onChange={(e) => setOwnerFormData(prev => ({ ...prev, bankName: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            required
                            placeholder="10-Digit Account Number"
                            maxLength={10}
                            value={ownerFormData.accountNumber}
                            onChange={(e) => setOwnerFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Account Name (e.g. Adebayo Adeleke Ent.)"
                          value={ownerFormData.accountName}
                          onChange={(e) => setOwnerFormData(prev => ({ ...prev, accountName: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddOwnerModal(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105"
                      >
                        Register Property Owner
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal to Edit Client Account & Override Details */}
            {showEditOwnerModal && editingOwner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-950">Edit Client Account</h4>
                      <p className="text-[11px] text-slate-500">Change login credentials, profile, and property portfolio.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowEditOwnerModal(false); setEditingOwner(null); }}
                      className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer text-base"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Direct Impersonation & Actions Bar */}
                  <div className="bg-slate-950 text-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3 border border-gold-500/30">
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">Direct Account Access</span>
                      <p className="text-[11px] text-slate-400">Open and manage this client's portal in real-time</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditOwnerModal(false);
                          handleQuickAddRemittanceForOwner(editingOwner);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                      >
                        Add Remittance
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditOwnerModal(false);
                          handleAccessClientPortal(editingOwner);
                        }}
                        className="px-3 py-1.5 bg-gold-gradient text-slate-950 hover:brightness-110 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        Enter Portal
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveEditOwner} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editingOwner.fullName || ''}
                        onChange={(e) => setEditingOwner(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Login Email Address</label>
                        <input
                          type="email"
                          required
                          value={editingOwner.email || ''}
                          onChange={(e) => setEditingOwner(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-900">Login Password</label>
                          <button
                            type="button"
                            onClick={() => {
                              const randomPwd = 'RH-' + Math.random().toString(36).slice(-6).toUpperCase();
                              setEditingOwner(prev => ({ ...prev, password: randomPwd }));
                            }}
                            className="text-[10px] text-amber-700 hover:underline font-semibold cursor-pointer"
                          >
                            Auto-Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Type new or keep current"
                          value={editingOwner.password || ''}
                          onChange={(e) => setEditingOwner(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editingOwner.phone || ''}
                        onChange={(e) => setEditingOwner(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase text-gold-700">
                        Remittance Bank Account Details
                      </span>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Bank Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Zenith Bank"
                            value={editingOwner.bankName || ''}
                            onChange={(e) => setEditingOwner(prev => ({ ...prev, bankName: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Account Number</label>
                          <input
                            type="text"
                            placeholder="10-digit number"
                            maxLength={10}
                            value={editingOwner.accountNumber || ''}
                            onChange={(e) => setEditingOwner(prev => ({ ...prev, accountNumber: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Account Name</label>
                        <input
                          type="text"
                          placeholder="Account Name"
                          value={editingOwner.accountName || ''}
                          onChange={(e) => setEditingOwner(prev => ({ ...prev, accountName: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase text-gold-700">
                          Assigned Properties (Portfolio)
                        </span>
                        <span className="text-[10px] text-slate-400">Click to add/remove</span>
                      </div>

                      {/* Quick Toggle Pills from Active Managed Properties */}
                      {managedProperties && managedProperties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                          {managedProperties.map(p => {
                            const pTitle = p.name || p.title;
                            const currentList = editingOwner.assignedPropertiesText
                              ? editingOwner.assignedPropertiesText.split(',').map(s => s.trim()).filter(Boolean)
                              : (editingOwner.assignedProperties || []);
                            const isAssigned = currentList.some(item => item.toLowerCase() === pTitle.toLowerCase());
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  let next;
                                  if (isAssigned) {
                                    next = currentList.filter(item => item.toLowerCase() !== pTitle.toLowerCase());
                                  } else {
                                    next = Array.from(new Set([...currentList, pTitle]));
                                  }
                                  setEditingOwner(prev => ({
                                    ...prev,
                                    assignedProperties: next,
                                    assignedPropertiesText: next.join(', ')
                                  }));
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  isAssigned
                                    ? 'bg-gold-500 text-slate-950 shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-gold-400'
                                }`}
                              >
                                {pTitle}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Assigned Property Names (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Lekki Luxury Villa, Ikoyi Penthouse"
                          value={editingOwner.assignedPropertiesText || ''}
                          onChange={(e) => setEditingOwner(prev => ({ ...prev, assignedPropertiesText: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:border-gold-500 focus:outline-none font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => { setShowEditOwnerModal(false); setEditingOwner(null); }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-sm cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 7: SECURITY & PASSWORD CHANGE                       */}
        {/* ========================================================= */}
        {activeModule === 'security' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 max-w-lg space-y-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-gold-600" />
                <span>Admin Portal Security</span>
              </h3>
              <p className="text-xs text-slate-600">Update the master administrative access password.</p>
            </div>

            {pwdSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
                {pwdSuccess}
              </div>
            )}

            {pwdError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs">
                {pwdError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gold-gradient text-slate-950 font-bold uppercase rounded-xl shadow-sm hover:brightness-105"
              >
                Update Admin Password
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 6: WEBSITE TRAFFIC & DAILY VIEWS                    */}
        {/* ========================================================= */}
        {activeModule === 'traffic' && (
          <div className="space-y-6">
            
            {/* Header & Actions */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-gold-600" />
                  <span>Website Traffic &amp; Daily Views Analytics</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Live tracking of daily pageviews, visitor sessions, and article reader engagement.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleRefreshTraffic}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  title="Refresh counts"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleResetTraffic}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Reset traffic count to 0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Counter (0)</span>
                </button>
              </div>
            </div>

            {/* 14-Day Visual Pageview Bar Chart */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-950 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gold-600" />
                    <span>Daily Pageviews (Past 14 Days)</span>
                  </h4>
                  <p className="text-xs text-slate-600">Shows daily website views recorded per day</p>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-gold-gradient inline-block shadow-sm"></span>
                    <span className="text-slate-800 font-bold">Today</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-800 inline-block"></span>
                    <span className="text-slate-700 font-medium">Previous Days</span>
                  </div>
                </div>
              </div>

              {/* Graphical Bars */}
              {(() => {
                const history = trafficStats?.history || [];
                const maxViews = Math.max(...history.map(h => h.views), 10);

                return (
                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 sm:gap-3 items-end pt-4 pb-2 overflow-x-auto">
                    {history.map((day, idx) => {
                      const heightPercent = Math.max(Math.round((day.views / maxViews) * 100), 8);
                      return (
                        <div key={idx} className="flex flex-col items-center space-y-2 group min-w-[38px]">
                          {/* Exact View Number Tooltip / Label */}
                          <span className={`text-[11px] font-extrabold transition-all ${
                            day.isToday ? 'text-amber-700 font-black scale-110' : 'text-slate-800 group-hover:text-slate-950'
                          }`}>
                            {day.views}
                          </span>

                          {/* Bar Container */}
                          <div className="w-full h-44 bg-slate-100 rounded-xl p-1 flex items-end justify-center border border-slate-200/70 group-hover:border-gold-500/50 transition-colors">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-lg transition-all duration-500 flex items-center justify-center ${
                                day.isToday
                                  ? 'bg-gold-gradient shadow-md border border-amber-300'
                                  : 'bg-slate-800 group-hover:bg-slate-700'
                              }`}
                            ></div>
                          </div>

                          {/* Day & Date Labels */}
                          <div className="text-center">
                            <p className={`text-[11px] font-bold ${day.isToday ? 'text-amber-800 font-extrabold' : 'text-slate-800'}`}>
                              {day.dayName}
                            </p>
                            <p className="text-[10px] text-slate-600">
                              {day.shortDate.split(' ')[0]}
                            </p>
                            {day.isToday && (
                              <span className="inline-block mt-0.5 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Daily History Table & Traffic Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Log Table (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-950">Daily Pageview Log</h4>
                  <span className="text-xs text-slate-600 font-medium">Past 14 Days</span>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-extrabold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Day</th>
                        <th className="p-3 text-right">Pageviews</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(trafficStats?.history || []).slice().reverse().map((day, idx) => (
                        <tr key={idx} className={`hover:bg-slate-50 ${day.isToday ? 'bg-amber-50/60 font-semibold' : ''}`}>
                          <td className="p-3 font-medium text-slate-950">
                            {day.date}
                          </td>
                          <td className="p-3 text-slate-800">
                            {day.dayName} ({day.shortDate})
                          </td>
                          <td className="p-3 text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              day.isToday 
                                ? 'bg-gold-gradient text-slate-950 shadow-sm' 
                                : 'bg-slate-100 text-slate-900'
                            }`}>
                              {day.views} views
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {day.isToday ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Active Today
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-medium">
                                Recorded
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Traffic Sources & Article Share Attribution */}
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 space-y-5">
                <div>
                  <h4 className="font-bold text-sm text-slate-950 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>Article Sharing &amp; Reach</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    How article sharing expands website traffic.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                    <p className="font-bold text-slate-950 flex items-center space-x-1">
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Article Sharing</span>
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Every published article now features one-click sharing for <strong>WhatsApp</strong>, <strong>Twitter/X</strong>, <strong>LinkedIn</strong>, and direct link copying.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="font-bold text-slate-950 flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-gold-600" />
                      <span>Direct URL Inbound Readers</span>
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Shared links automatically navigate visitors directly to the article modal and increment the daily website pageview counter.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-950">Top Visited Website Sections</p>
                    <div className="space-y-1.5 text-[11px] text-slate-700">
                      <div className="flex justify-between">
                        <span>1. Homepage &amp; Showcase</span>
                        <strong className="text-slate-900">42%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>2. Property Listings</span>
                        <strong className="text-slate-900">28%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>3. Knowledge Hub / Blog</span>
                        <strong className="text-slate-900">18%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>4. Property Owner Portal</span>
                        <strong className="text-slate-900">12%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: EDIT UNITS & TENANTS                               */}
        {/* ========================================================= */}
        {showEditUnitsModal && editingUnitsProp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white max-w-3xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span>
                    <h4 className="font-serif text-lg font-bold text-slate-950">
                      Edit Units &amp; Tenants — {editingUnitsProp.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update tenancy agreements, lease dates, and payment status. Changes sync live to the landlord's dashboard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowEditUnitsModal(false); setEditingUnitsProp(null); }}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveUnitsAndTenants} className="space-y-5 text-xs">
                {/* Building Information */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Building Name</label>
                    <input
                      type="text"
                      required
                      value={editingUnitsProp.name}
                      onChange={(e) => setEditingUnitsProp(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Physical Address</label>
                    <input
                      type="text"
                      required
                      value={editingUnitsProp.address}
                      onChange={(e) => setEditingUnitsProp(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                {/* Units List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider text-gold-700">
                      Flats &amp; Tenants ({editingUnitsProp.units.length} Total)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddUnitToEditingProp}
                      className="px-3 py-1.5 bg-slate-900 text-gold-400 hover:bg-slate-800 rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Flat / Unit</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {editingUnitsProp.units.map((u, idx) => (
                      <div key={u.id || idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 gap-2">
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="text"
                              value={u.unitNumber}
                              onChange={(e) => handleUnitFieldChange(idx, 'unitNumber', e.target.value)}
                              placeholder="Flat 101"
                              className="font-bold text-slate-900 text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 w-44"
                            />
                            <select
                              value={u.status}
                              onChange={(e) => handleUnitFieldChange(idx, 'status', e.target.value)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                                u.status === 'occupied'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-900 border-amber-300'
                              }`}
                            >
                              <option value="occupied">Occupied</option>
                              <option value="vacant">Vacant</option>
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-500 font-semibold">Rent (₦):</span>
                              <input
                                type="number"
                                value={u.rentAmount}
                                onChange={(e) => handleUnitFieldChange(idx, 'rentAmount', e.target.value)}
                                placeholder="5000000"
                                className="w-28 font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveUnitFromEditingProp(u.id)}
                              className="text-slate-400 hover:text-red-600 p-1 font-bold cursor-pointer"
                              title="Delete Flat"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {u.status === 'occupied' && (
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tenant Name</label>
                              <input
                                type="text"
                                value={u.tenant?.fullName || ''}
                                onChange={(e) => handleTenantFieldChange(idx, 'fullName', e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tenant Phone</label>
                              <input
                                type="tel"
                                value={u.tenant?.phone || ''}
                                onChange={(e) => handleTenantFieldChange(idx, 'phone', e.target.value)}
                                placeholder="+234 803 000 0000"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Lease Expiry</label>
                              <input
                                type="date"
                                value={u.tenant?.leaseEnd || ''}
                                onChange={(e) => handleTenantFieldChange(idx, 'leaseEnd', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rent Status</label>
                              <select
                                value={u.tenant?.paymentStatus || 'Paid'}
                                onChange={(e) => handleTenantFieldChange(idx, 'paymentStatus', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold"
                              >
                                <option value="Paid">Paid</option>
                                <option value="Due">Due</option>
                                <option value="Overdue">Overdue</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setShowEditUnitsModal(false); setEditingUnitsProp(null); }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-sm cursor-pointer"
                  >
                    Save Units &amp; Tenants
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: LOG MAINTENANCE WORK ORDER & ATTACH INVOICE        */}
        {/* ========================================================= */}
        {showLogMaintenanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-950">Log Maintenance Work Order</h4>
                    <p className="text-[11px] text-slate-500">Creates an immutable audit record and attaches contractor invoice.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogMaintenanceModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLogMaintenanceSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Target Property</label>
                  <select
                    required
                    value={maintenanceFormData.propertyName}
                    onChange={(e) => {
                      const prop = managedProperties.find(p => p.name === e.target.value);
                      setMaintenanceFormData(prev => ({
                        ...prev,
                        propertyName: e.target.value,
                        propertyId: prop?.id || ''
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value="">— Select Managed Property —</option>
                    {managedProperties.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.city || 'Lagos'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Unit / Flat (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 102 or Common Area"
                      value={maintenanceFormData.unitNumber}
                      onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Initial Status</label>
                    <select
                      value={maintenanceFormData.status}
                      onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Work Order / Repair Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Borehole Water Pump Overhaul"
                    value={maintenanceFormData.title}
                    onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Work Description &amp; Scope</label>
                  <textarea
                    rows={2}
                    placeholder="Describe parts replaced or repairs executed by the facility team..."
                    value={maintenanceFormData.description}
                    onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Vetted Contractor</label>
                    <input
                      type="text"
                      placeholder="e.g. Engr. Tunde Waterworks Ltd."
                      value={maintenanceFormData.contractor}
                      onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, contractor: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Audited Cost (₦)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={maintenanceFormData.actualCost}
                      onChange={(e) => setMaintenanceFormData(prev => ({ ...prev, actualCost: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Upload Contractor Invoice */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-amber-700" />
                      Attach Contractor Invoice / Receipt (PDF / Image)
                    </span>
                    {maintenanceFormData.invoiceName && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Attached
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setMaintenanceFormData(prev => ({
                          ...prev,
                          invoiceUrl: reader.result,
                          invoiceName: file.name
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-gold-400 hover:file:bg-slate-800 cursor-pointer"
                  />
                  {maintenanceFormData.invoiceName && (
                    <p className="text-[11px] text-slate-600 font-mono">
                      File: {maintenanceFormData.invoiceName}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowLogMaintenanceModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold-gradient text-slate-950 rounded-xl font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-sm cursor-pointer"
                  >
                    Log Work Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
