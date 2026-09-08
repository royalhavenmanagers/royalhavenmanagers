import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { 
  Search, Calendar, Clock, ArrowRight, X, BookOpen, 
  ChevronLeft, ChevronRight, Sparkles, Share2, Copy, Check, Send, Link2,
  ArrowLeft, MessageCircle, CheckCircle2
} from 'lucide-react';
import { blogStore } from '../data/blogStore';

export default function BlogSection({ onOpenContact }) {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);
  const [copiedArticleId, setCopiedArticleId] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const published = blogStore.getPublishedPosts();
    setPosts(published);

    // Check URL parameters and hash for direct article linking (e.g. ?article=slug or #article/slug)
    const checkDirectLink = (postList) => {
      const params = new URLSearchParams(window.location.search);
      let targetSlug = params.get('article');

      if (!targetSlug && window.location.hash) {
        if (window.location.hash.startsWith('#article/')) {
          targetSlug = window.location.hash.replace('#article/', '');
        } else if (window.location.hash.startsWith('#blog/')) {
          targetSlug = window.location.hash.replace('#blog/', '');
        }
      }

      if (targetSlug && postList && postList.length > 0) {
        const found = postList.find(p => p.slug === targetSlug || p.id === targetSlug);
        if (found) {
          setActivePost(found);
        }
      }
    };

    checkDirectLink(published);

    const onHashOrPop = () => {
      checkDirectLink(published);
    };
    window.addEventListener('hashchange', onHashOrPop);
    window.addEventListener('popstate', onHashOrPop);

    blogStore.fetchPostsAsync().then((allPosts) => {
      if (allPosts && allPosts.length > 0) {
        const activeOnly = allPosts.filter(p => p.status === 'published');
        setPosts(activeOnly);
        checkDirectLink(activeOnly);
      }
    });

    return () => {
      window.removeEventListener('hashchange', onHashOrPop);
      window.removeEventListener('popstate', onHashOrPop);
    };
  }, []);

  const getArticleShareUrl = (post) => {
    const origin = window.location.origin;
    const target = post.slug || post.id;
    return `${origin}/?article=${target}#blog`;
  };

  const handleOpenPost = (post) => {
    setActivePost(post);
    try {
      const target = post.slug || post.id;
      window.history.replaceState(null, '', `?article=${target}#blog`);
    } catch {}
  };

  const handleClosePost = () => {
    setActivePost(null);
    try {
      window.history.replaceState(null, '', window.location.pathname + '#blog');
    } catch {}
  };

  const handleCopyShareLink = (e, post) => {
    if (e) e.stopPropagation();
    const url = getArticleShareUrl(post);
    navigator.clipboard.writeText(url);
    setCopiedArticleId(post.id);
    setTimeout(() => setCopiedArticleId(null), 3000);
  };

  const handleShareWhatsApp = (e, post) => {
    if (e) e.stopPropagation();
    const url = getArticleShareUrl(post);
    const msg = `Read this insightful article from Royal Haven: "${post.title}"\n\nLink: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShareTwitter = (e, post) => {
    if (e) e.stopPropagation();
    const url = getArticleShareUrl(post);
    const text = `Insightful read on real estate: "${post.title}" by Royal Haven`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareLinkedIn = (e, post) => {
    if (e) e.stopPropagation();
    const url = getArticleShareUrl(post);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  // Reset slider position to beginning when filters change
  useEffect(() => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slideTo(0);
    }
  }, [selectedCategory, searchQuery]);

  // Listen for Escape key to close modal and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClosePost();
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
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-800 text-xs uppercase tracking-widest font-bold">
            <span>ROYAL HAVEN INSIGHTS &amp; ADVISORY</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Royal Haven <span className="text-gold-gradient-light">Blog &amp; Insights</span>
          </h2>
          <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
            Expert articles, market trends, and practical guidance on property management, tenant vetting, and asset protection across Nigeria.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gold-gradient text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-900 font-bold border border-slate-300 hover:border-gold-500 hover:bg-amber-50/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Navigation Arrows */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                ref={prevRef}
                aria-label="Previous articles"
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 hover:border-gold-500 text-slate-800 hover:bg-gold-gradient hover:text-slate-950 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                ref={nextRef}
                aria-label="Next articles"
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 hover:border-gold-500 text-slate-800 hover:bg-gold-gradient hover:text-slate-950 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex items-center justify-end mb-3 md:hidden">
          <span className="text-xs text-amber-900 font-medium inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 mr-1.5" />
            Swipe sideways to view articles
          </span>
        </div>

        {/* Articles Slider Container */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-200/80 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-slate-950">No Articles Found</h3>
            <p className="text-sm text-slate-700 font-medium max-w-md mx-auto">
              There are no published articles matching your current category or search filter. Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="relative pb-6">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.15}
              breakpoints={{
                540: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2.2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setTimeout(() => {
                  if (swiper && !swiper.destroyed && swiper.params?.navigation) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                }, 50);
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={filteredPosts.length > 3 ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false}
              className="rounded-2xl !pb-14"
            >
              {filteredPosts.map((post) => (
                <SwiperSlide key={post.id} className="h-auto">
                  <article
                    onClick={() => setActivePost(post)}
                    className="bg-white rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 h-full cursor-pointer select-none"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-md text-amber-300 border border-gold-500/50 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-5 sm:p-6 space-y-3">
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

                        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-950 group-hover:text-gold-700 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-5 sm:p-6 pt-0 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPost(post);
                        }}
                        className="flex-1 py-2.5 sm:py-3 rounded-xl border border-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-gradient hover:text-slate-950 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-1.5 group-hover:shadow-sm cursor-pointer"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCopyShareLink(e, post)}
                        title="Copy article link"
                        className="p-2.5 sm:p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-gold-gradient hover:text-slate-950 text-slate-900 transition-all cursor-pointer shrink-0"
                      >
                        {copiedArticleId === post.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-gold-700" />}
                      </button>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

      </div>

      {/* Full Dedicated Article Reading Page */}
      {activePost && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] bg-white text-slate-900 overflow-y-auto animate-fadeIn"
          style={{ isolation: 'isolate' }}
        >
          {/* Top Sticky Reading Bar */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <button
                onClick={handleClosePost}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-gold-gradient hover:text-slate-950 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-xs group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>All Articles</span>
              </button>

              <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full truncate max-w-xs">
                {activePost.category}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleCopyShareLink(e, activePost)}
                  className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Copy link"
                >
                  {copiedArticleId === activePost.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-gold-700" />
                      <span className="hidden xs:inline">Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClosePost}
                  aria-label="Close article"
                  className="p-1.5 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Article Content */}
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
            
            {/* Category, Date & Read Time */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100/70 border border-amber-300 px-3 py-1 rounded-full">
                  {activePost.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gold-600" />
                  {activePost.date}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gold-600" />
                  {activePost.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight sm:leading-snug">
                {activePost.title}
              </h1>
            </div>

            {/* Author Byline & Quick Share Strip */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-gold-gradient flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm shrink-0">
                  RH
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-950">{activePost.author}</p>
                  <p className="text-[11px] text-slate-600">Royal Haven Realty &amp; Property Managers Ltd.</p>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center space-x-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <button
                  type="button"
                  onClick={(e) => handleShareWhatsApp(e, activePost)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px]">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareTwitter(e, activePost)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  title="Share on X"
                >
                  <span className="text-[11px]">X</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareLinkedIn(e, activePost)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <span className="text-[11px]">LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCopyShareLink(e, activePost)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-all cursor-pointer"
                  title="Copy link"
                >
                  {copiedArticleId === activePost.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img 
                src={activePost.coverImage} 
                alt={activePost.title} 
                className="w-full h-56 sm:h-80 md:h-96 object-cover"
              />
            </div>

            {/* Summary Takeaway Box */}
            {activePost.summary && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-l-4 border-gold-500 shadow-xs">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900 mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Key Takeaway</span>
                </p>
                <p className="text-sm sm:text-base text-slate-800 font-medium italic leading-relaxed">
                  "{activePost.summary}"
                </p>
              </div>
            )}

            {/* Formatted Content */}
            <div className="prose prose-slate max-w-none text-slate-900 leading-relaxed font-normal text-base sm:text-lg">
              {renderFormattedContent(activePost.content)}
            </div>

            {/* Dedicated Bottom Sharing Card */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="space-y-1">
                <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-950">Share this Article</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Know a property owner, investor, or landlord who would find this valuable? Share it with them.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleShareWhatsApp(e, activePost)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareTwitter(e, activePost)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Share on X</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareLinkedIn(e, activePost)}
                  className="px-4 py-2.5 rounded-xl bg-[#0077b5] hover:brightness-105 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Share on LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCopyShareLink(e, activePost)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  {copiedArticleId === activePost.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gold-600" />}
                  <span>{copiedArticleId === activePost.id ? 'Link Copied!' : 'Copy Article Link'}</span>
                </button>
              </div>
            </div>

            {/* Author Bio & Advisory CTA */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-md">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-gold-500/30 px-2.5 py-0.5 rounded-full">
                    Executive Advisory
                  </span>
                </div>
                <h4 className="font-serif text-xl font-bold text-gold-gradient">
                  Need Professional Property Management?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Royal Haven provides comprehensive tenant screening, rent collection, and facility maintenance across Lagos and Ogun State.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    handleClosePost();
                    onOpenContact();
                  }}
                  className="px-5 py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all cursor-pointer text-center"
                >
                  Request Consultation
                </button>
                <button
                  onClick={handleClosePost}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Back to Website
                </button>
              </div>
            </div>

          </main>
        </div>,
        document.body
      )}
    </section>
  );
}
