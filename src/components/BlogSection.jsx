import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight, X, BookOpen, Share2 } from 'lucide-react';
import { blogStore } from '../data/blogStore';

export default function BlogSection({ onOpenContact }) {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    setPosts(blogStore.getPublishedPosts());
    blogStore.fetchPostsAsync().then((allPosts) => {
      if (allPosts) {
        setPosts(allPosts.filter(p => p.status === 'published'));
      }
    });
  }, []);

  const categories = ['All', 'Property Management', 'Tenant Screening', 'Estate Surveying', 'Real Estate Advisory'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-300/60 bg-amber-50 text-amber-800 text-xs uppercase tracking-widest font-bold shadow-sm">
            <BookOpen className="w-4 h-4 mr-1 text-gold-600 shrink-0" />
            <span>REAL ESTATE INSIGHTS & ARTICLES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Royal Haven <span className="text-gold-gradient-light">Blog & Insights</span>
          </h2>
          <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
            Expert articles, market trends, and practical guidance on property management, tenant vetting, and asset protection across Nigeria.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gold-gradient text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-gold-400 hover:bg-amber-50/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Article Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-200/60 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-slate-800">No Articles Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              There are no published articles matching your current category or search filter. Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-amber-300 border border-gold-500/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-slate-700 font-semibold">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-gold-700 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-700 font-normal leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActivePost(post)}
                    className="w-full py-3 rounded-xl border border-amber-300/70 text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-gold-gradient hover:text-slate-950 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-1.5 group-hover:shadow-sm"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Article Full View Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-amber-200/80 shadow-2xl p-6 sm:p-10 my-8 overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                {/* Meta Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {activePost.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-gold-600 mr-1" />
                    {activePost.date}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 text-gold-600 mr-1" />
                    {activePost.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  {activePost.title}
                </h2>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-slate-950 font-bold text-sm">
                    RH
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{activePost.author}</p>
                    <p className="text-[11px] text-slate-500">Royal Haven Realty & Property Managers Ltd.</p>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={activePost.coverImage} alt={activePost.title} className="w-full h-full object-cover" />
                </div>

                {/* Article Body Content */}
                <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-4 whitespace-pre-line">
                  {activePost.content}
                </div>

                {/* Bottom CTA Banner */}
                <div className="mt-8 bg-amber-50 p-6 rounded-2xl border border-amber-200 text-center sm:flex items-center justify-between gap-4">
                  <div className="text-left mb-4 sm:mb-0">
                    <h4 className="font-serif text-lg font-bold text-slate-900">Have Questions About Your Property?</h4>
                    <p className="text-xs text-slate-600">Speak directly with our property managers and advisory team.</p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePost(null);
                      onOpenContact();
                    }}
                    className="px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-sm transition-all shrink-0"
                  >
                    Request Consultation
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
