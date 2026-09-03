import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, X, BookOpen } from 'lucide-react';
import { blogStore } from '../data/blogStore';

export default function BlogSection({ onOpenContact }) {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    setPosts(blogStore.getPublishedPosts());
    blogStore.fetchPostsAsync().then((allPosts) => {
      if (allPosts && allPosts.length > 0) {
        setPosts(allPosts.filter(p => p.status === 'published'));
      }
    });
  }, []);

  // Listen for Escape key to close modal and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePost(null);
      }
    };

    if (activePost) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePost]);

  const categories = ['All', 'Property Management', 'Tenant Screening', 'Estate Surveying', 'Real Estate Advisory'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to parse and render formatted content cleanly without raw markdown symbols
  const renderFormattedContent = (rawContent) => {
    if (!rawContent) return null;

    const lines = rawContent.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2.5 my-4 pl-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start text-slate-800 text-sm sm:text-base leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-gold-600 mt-2 mr-3 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const parseInlineFormatting = (text) => {
      const parts = [];
      let remaining = text;
      let keyIdx = 0;

      while (remaining.length > 0) {
        const match = remaining.match(/\*\*(.+?)\*\*/);
        if (!match) {
          parts.push(remaining);
          break;
        }
        const matchIndex = match.index;
        if (matchIndex > 0) {
          parts.push(remaining.substring(0, matchIndex));
        }
        parts.push(
          <strong key={keyIdx++} className="font-bold text-slate-950">
            {match[1]}
          </strong>
        );
        remaining = remaining.substring(matchIndex + match[0].length);
      }
      return parts;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      // Heading 3: ### Title
      if (trimmed.startsWith('### ')) {
        flushList();
        const title = trimmed.replace(/^###\s+/, '');
        elements.push(
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mt-6 mb-3">
            {title}
          </h3>
        );
        return;
      }

      // Heading 4: #### Subtitle
      if (trimmed.startsWith('#### ')) {
        flushList();
        const title = trimmed.replace(/^####\s+/, '');
        elements.push(
          <h4 key={idx} className="font-serif text-lg sm:text-xl font-bold text-amber-900 mt-5 mb-2">
            {title}
          </h4>
        );
        return;
      }

      // List items: 1. or - or *
      const listMatch = trimmed.match(/^(\d+\.|\-|\*)\s+(.+)/);
      if (listMatch) {
        currentList.push(parseInlineFormatting(listMatch[2]));
        return;
      }

      // Standard paragraph
      flushList();
      elements.push(
        <p key={idx} className="text-slate-800 text-sm sm:text-base leading-relaxed mb-3">
          {parseInlineFormatting(trimmed)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Royal Haven <span className="text-gold-gradient-light">Blog & Insights</span>
          </h2>
          <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
            Expert articles, market trends, and practical guidance on property management, tenant vetting, and asset protection across Nigeria.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gold-gradient text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-900 font-bold border border-slate-300 hover:border-gold-500 hover:bg-amber-50/50'
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Article Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-200/80 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-slate-950">No Articles Found</h3>
            <p className="text-sm text-slate-700 font-medium max-w-md mx-auto">
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
                className="bg-white rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md text-amber-300 border border-gold-500/50 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-slate-900 font-bold">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-950 group-hover:text-gold-700 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-800 font-medium leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActivePost(post)}
                    className="w-full py-3 rounded-xl border border-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-gradient hover:text-slate-950 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-1.5 group-hover:shadow-sm cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* Full View Modal Rendered via Portal at Root document.body */}
      {activePost && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePost(null);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          style={{ isolation: 'isolate' }}
        >
          {/* Horizontal Rectangle Modal on Desktop */}
          <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col lg:flex-row">
            
            {/* Prominent High-Contrast Close Button */}
            <button
              onClick={() => setActivePost(null)}
              aria-label="Close article modal"
              className="absolute top-4 right-4 z-50 p-2.5 text-slate-700 hover:text-slate-950 bg-white/95 hover:bg-white rounded-full transition-all border border-slate-300 shadow-md cursor-pointer flex items-center space-x-1"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Close</span>
            </button>

            {/* LEFT COLUMN: Cover Image, Meta & Author (Desktop: 40% width, Mobile: Top Banner) */}
            <div className="lg:w-5/12 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between shrink-0 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="space-y-6 relative z-10">
                {/* Cover Image */}
                <div className="h-48 sm:h-60 lg:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-slate-950">
                  <img 
                    src={activePost.coverImage} 
                    alt={activePost.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-amber-300 border border-gold-500/50 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {activePost.category}
                  </div>
                </div>

                {/* Meta & Author */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-xs text-amber-200/90 font-medium">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                      {activePost.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                      {activePost.readTime}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">
                      RH
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{activePost.author}</p>
                      <p className="text-[11px] text-amber-200/80 font-medium">Royal Haven Realty & Property Managers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Consultation CTA on Left Side (Desktop) */}
              <div className="pt-6 mt-6 border-t border-white/10 hidden lg:block relative z-10">
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Need professional management or guidance regarding this topic?
                </p>
                <button
                  onClick={() => {
                    setActivePost(null);
                    onOpenContact();
                  }}
                  className="w-full py-3 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-sm transition-all cursor-pointer"
                >
                  Request Consultation
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Scrollable Article Body (Desktop: 60% width) */}
            <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh] overscroll-contain">
              <div className="space-y-6">
                {/* Article Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 leading-snug pt-2 lg:pt-0 pr-12 lg:pr-14">
                  {activePost.title}
                </h2>

                {/* Formatted Content */}
                <div className="prose prose-slate max-w-none text-slate-900 leading-relaxed font-normal">
                  {renderFormattedContent(activePost.content)}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-xs text-slate-700 font-semibold block">Official Publication</span>
                  <span className="text-[11px] text-slate-600">Royal Haven Realty & Property Managers Ltd.</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    className="px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setActivePost(null);
                      onOpenContact();
                    }}
                    className="lg:hidden px-5 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-sm transition-all cursor-pointer"
                  >
                    Consultation
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
