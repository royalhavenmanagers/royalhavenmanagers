import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, Eye, FileText, ArrowLeft, Image as ImageIcon, Save, KeyRound, 
  ShieldCheck, Home, Upload, MapPin, Tag, DollarSign, BedDouble, Bath, Sparkles,
  Inbox, Phone, Mail, Calendar, Send, Users, Copy
} from 'lucide-react';
import { blogStore } from '../data/blogStore';
import { propertyStore } from '../data/propertyStore';
import { portalStore } from '../data/portalStore';
import { compressImageFile } from '../utils/imageCompressor';
import { supabase, authApi } from '../lib/supabaseClient';

export default function AdminPortal({ onReturnHome }) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Primary navigation: 'articles', 'properties', 'security'
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
    propertyName: 'Royal Crest Heights',
    propertyId: 'prop-ikeja-01',
    grossRent: '',
    managementFee: '',
    maintenanceCost: '',
    beneficiaryBank: 'Zenith Bank PLC',
    beneficiaryAccount: '1014829301',
    description: ''
  });

  // Owner Accounts State
  const [owners, setOwners] = useState([]);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [ownerFormData, setOwnerFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    bankName: 'Zenith Bank PLC',
    accountNumber: '',
    accountName: '',
    assignedProperty: 'Royal Crest Heights'
  });
  const [createdOwnerCreds, setCreatedOwnerCreds] = useState(null);

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const authStatus = blogStore.isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      loadData();
    }
  }, []);

  const loadData = () => {
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

    // Load inquiries & remittances
    setInquiries(portalStore.getInquiries());
    setRemittances(portalStore.getTransactions().filter(t => t.type === 'owner_remittance'));

    // Load registered owners from store & Supabase
    setOwners(portalStore.getOwners());
    if (supabase) {
      supabase.from('profiles').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          const fromCloud = data.map(p => ({
            id: p.id,
            fullName: p.full_name || 'Valued Landlord',
            email: p.email,
            phone: p.phone || '—',
            bankName: p.bank_name || 'Zenith Bank PLC',
            accountNumber: p.account_number || '—',
            accountName: p.account_name || '—',
            assignedProperties: ['Royal Crest Heights (Ikeja GRA)'],
            createdDate: p.created_at ? p.created_at.split('T')[0] : '2026-08-01'
          }));
          setOwners(fromCloud);
        }
      }).catch(() => {});
    }
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    if (!ownerFormData.fullName || !ownerFormData.email || !ownerFormData.password) {
      alert("Please fill in Full Name, Email, and Password.");
      return;
    }

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

    const newOwner = portalStore.addOwner({
      fullName: ownerFormData.fullName,
      email: ownerFormData.email,
      phone: ownerFormData.phone,
      bankName: ownerFormData.bankName,
      accountNumber: ownerFormData.accountNumber,
      accountName: ownerFormData.accountName,
      assignedProperties: [ownerFormData.assignedProperty]
    });

    setOwners(portalStore.getOwners());
    setCreatedOwnerCreds({
      fullName: ownerFormData.fullName,
      email: ownerFormData.email,
      password: ownerFormData.password,
      phone: ownerFormData.phone
    });

    setShowAddOwnerModal(false);
    showNotification(`Account created for ${ownerFormData.fullName}! You can now send them login credentials.`);
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

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }
    const res = blogStore.changePassword(currentPwd, newPwd);
    if (res.success) {
      setPwdSuccess(res.message);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      showNotification('Admin password updated successfully!');
    } else {
      setPwdError(res.error || 'Failed to update password.');
    }
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
                  <span>Consultation &amp; Landlord Leads Inbox</span>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {remittances.map((rem) => (
                    <tr key={rem.id} className="hover:bg-slate-50">
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
                      <label className="block font-bold text-slate-900 mb-1">Select Property</label>
                      <select
                        value={remittanceFormData.propertyName}
                        onChange={(e) => setRemittanceFormData(prev => ({ ...prev, propertyName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                      >
                        <option value="Royal Crest Heights">Royal Crest Heights (Ikeja GRA)</option>
                        <option value="Haven Terraces">Haven Terraces (Magodo GRA Phase 2)</option>
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
        {/* MODULE 6: LANDLORD & OWNER CLIENT ACCOUNTS                 */}
        {/* ========================================================= */}
        {activeModule === 'owners' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gold-600" />
                  <span>Landlord &amp; Client Accounts</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Manage registered property owners, view their remittance bank details, or onboard new landlords directly.
                </p>
              </div>

              <button
                onClick={() => setShowAddOwnerModal(true)}
                className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase rounded-xl shadow-sm hover:brightness-105 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Landlord Account</span>
              </button>
            </div>

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
                    <th className="p-3">Client / Landlord</th>
                    <th className="p-3">Contact Email &amp; Phone</th>
                    <th className="p-3">Remittance Bank &amp; Account</th>
                    <th className="p-3">Assigned Property</th>
                    <th className="p-3 text-center">Quick Action</th>
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
                        <div className="flex items-center text-slate-800 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                          <span>{owner.email}</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                          <span>{owner.phone}</span>
                        </div>
                      </td>
                      <td className="p-3 space-y-0.5">
                        <span className="font-bold text-slate-900 block">{owner.bankName}</span>
                        <span className="font-mono text-slate-600">{owner.accountNumber}</span>
                        {owner.accountName && <span className="text-[10px] text-slate-400 block truncate">{owner.accountName}</span>}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-semibold">
                          {owner.assignedProperties ? owner.assignedProperties.join(", ") : "Royal Crest Heights"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <a
                          href={`https://wa.me/${(owner.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${owner.fullName}, this is Royal Haven Property Management regarding your portfolio.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-900 text-gold-400 hover:bg-gold-gradient hover:text-slate-950 rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal to Create Client Account */}
            {showAddOwnerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-950">Create Landlord Account</h4>
                      <p className="text-[11px] text-slate-500">Registers client directly on Supabase and creates portal access.</p>
                    </div>
                    <button onClick={() => setShowAddOwnerModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={handleCreateOwner} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Landlord Full Name</label>
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
                          <option value="Royal Crest Heights (Ikeja GRA)">Royal Crest Heights (Ikeja GRA)</option>
                          <option value="Haven Terraces (Magodo GRA)">Haven Terraces (Magodo GRA)</option>
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
                        Create Client Account
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

      </main>
    </div>
  );
}
