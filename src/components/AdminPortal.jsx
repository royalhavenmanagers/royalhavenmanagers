import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, Eye, FileText, ArrowLeft, Image as ImageIcon, Save, KeyRound, ShieldCheck 
} from 'lucide-react';
import { blogStore } from '../data/blogStore';
import { companyData } from '../data/companyData';

export default function AdminPortal({ onReturnHome }) {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'editor', or 'security'
  
  // Change Password State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  
  // Editor Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Property Management',
    coverImage: '',
    author: 'Ibrahim Ridwan Olasunkanmi (CEO & MD)',
    status: 'published',
    summary: '',
    content: ''
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const authStatus = blogStore.isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      loadPosts();
    }
  }, []);

  const loadPosts = () => {
    setPosts(blogStore.getPosts());
    blogStore.fetchPostsAsync().then((cloudPosts) => {
      if (cloudPosts) {
        setPosts(cloudPosts);
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = blogStore.login(password);
    if (res.success) {
      setIsAuth(true);
      loadPosts();
    } else {
      setAuthError(res.error || 'Invalid password');
    }
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

  const handleLogout = () => {
    blogStore.logout();
    setIsAuth(false);
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Property Management',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      author: 'Royal Haven Management Team',
      status: 'published',
      summary: '',
      content: ''
    });
    setActiveTab('editor');
  };

  const handleStartEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      category: post.category,
      coverImage: post.coverImage,
      author: post.author,
      status: post.status,
      summary: post.summary || '',
      content: post.content || ''
    });
    setActiveTab('editor');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post permanently?")) {
      const updated = blogStore.deletePost(id);
      setPosts(updated);
      showNotification("Article deleted successfully.");
    }
  };

  const handleToggleStatus = (id) => {
    const updated = blogStore.togglePublishStatus(id);
    setPosts(updated);
    showNotification("Publish status updated.");
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill in both the Title and Article Content.");
      return;
    }

    const payload = {
      ...formData,
      ...(editingId ? { id: editingId } : {})
    };

    blogStore.savePost(payload);
    loadPosts();
    setActiveTab('list');
    showNotification(editingId ? "Article updated successfully!" : "New article published successfully!");
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Image File Uploader Handler
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
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
              <p className="text-[10px] text-slate-400">Content & Blog Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium text-xs shadow-md flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Dashboard Nav Bar */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'list'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Manage Posts ({posts.length})
            </button>

            <button
              onClick={handleStartCreate}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'editor' && !editingId
                  ? 'bg-gold-gradient text-slate-950 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Create New Article</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-gold-400 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4 mr-1" />
              <span>Change Password</span>
            </button>
          </div>

          <span className="text-xs text-slate-800 flex items-center space-x-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Master Admin Authenticated</span>
          </span>
        </div>

        {/* Tab 1: List View */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-slate-950">Published & Draft Articles</h3>
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-gold-gradient text-slate-950 text-xs font-bold uppercase rounded-xl shadow-sm hover:brightness-105"
              >
                + Add Article
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="p-12 text-center text-slate-600 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-900">No articles yet.</p>
                <p className="text-xs text-slate-700 font-medium">Click "Create New Article" to write your first blog post.</p>
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
                      <tr key={post.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={post.coverImage} alt="Thumbnail" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-950 text-sm line-clamp-1">{post.title}</p>
                              <p className="text-[11px] text-slate-800 font-semibold">{post.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded-md font-bold text-[11px]">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-950 font-mono font-bold">{post.date}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(post.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                              post.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-200 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {post.status}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleStartEdit(post)}
                              title="Edit Article"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-slate-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              title="Delete Article"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
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
        )}

        {/* Tab 2: Create / Edit Article Form */}
        {activeTab === 'editor' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {editingId ? "Edit Blog Article" : "Write New Blog Article"}
                </h3>
                <p className="text-xs text-slate-500">Fill in the fields below. No code required.</p>
              </div>

              <button
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Back to Article List
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-6">
              
              {/* Title & Category */}
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5 Mistakes Property Landlords in Lekki Must Avoid"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="Property Management">Property Management</option>
                    <option value="Tenant Screening">Tenant Screening</option>
                    <option value="Estate Surveying">Estate Surveying & Valuation</option>
                    <option value="Real Estate Advisory">Real Estate Advisory</option>
                    <option value="Property Legal Documentation">Property Legal Documentation</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL / File Uploader */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Cover Image URL or File *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">or upload from device:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Managing Director / CEO"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image Thumbnail Preview */}
              {formData.coverImage && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-4">
                  <img src={formData.coverImage} alt="Preview" className="w-20 h-14 object-cover rounded-lg border border-slate-300" />
                  <span className="text-xs text-slate-500 font-medium">Cover Image Thumbnail Preview</span>
                </div>
              )}

              {/* Brief Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Short Article Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A brief 1-2 sentence overview shown on the card preview..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Main Article Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Article Content (Text Area) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article content here. You can paste paragraphs, bullet points, and subheadings..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 transition-colors leading-relaxed font-sans"
                ></textarea>
              </div>

              {/* Status Toggle & Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold uppercase text-slate-700">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-5 py-3 text-xs uppercase tracking-wider font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-3 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? "Save Changes" : "Publish Article"}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 3: SECURITY & CHANGE PASSWORD                          */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm max-w-xl mx-auto space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <KeyRound className="w-3.5 h-3.5 mr-1" />
                <span>Security Settings</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-950">Change Admin Password</h2>
              <p className="text-xs text-slate-700 font-medium">
                Update the master access password used to log into this admin portal.
              </p>
            </div>

            {pwdError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-5 py-3 text-xs uppercase tracking-wider font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
