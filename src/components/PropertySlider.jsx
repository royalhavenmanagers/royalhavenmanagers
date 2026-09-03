import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MapPin, BedDouble, Bath, Eye, X, MessageCircle, Phone, Calendar, ArrowRight, Home } from 'lucide-react';
import { propertyStore } from '../data/propertyStore';

export default function PropertySlider({ onOpenContact }) {
  const [properties, setProperties] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    // Synchronous load from local storage
    setProperties(propertyStore.getProperties());

    // Asynchronous load from Supabase cloud
    propertyStore.fetchPropertiesAsync().then((cloudProps) => {
      if (cloudProps && Array.isArray(cloudProps)) {
        setProperties(cloudProps);
      }
    });
  }, []);

  // Listen for Escape key to close modal and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProperty(null);
      }
    };

    if (selectedProperty) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProperty]);

  // If there are no properties yet, hide section (no fake default properties)
  if (!properties || properties.length === 0) {
    return null;
  }

  // Derive unique categories dynamically from actual properties
  const dynamicCategories = ['All', ...new Set(properties.map(p => p.propertyType).filter(Boolean))];

  const filteredProperties = activeCategory === 'All'
    ? properties
    : properties.filter(p => p.propertyType?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="properties" className="py-24 bg-obsidian-950 bg-[#060608] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
              <span>MANAGED PORTFOLIO &amp; LISTINGS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Featured <span className="text-gold-gradient">Properties</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore managed residences, commercial spaces, and premier developments under Royal Haven care.
            </p>
          </div>

          {/* Category Filter Tabs */}
          {dynamicCategories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gold-gradient text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-gold-500/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swiper Slider */}
        <div className="relative pb-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.4 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="rounded-2xl !pb-14"
          >
            {filteredProperties.map((prop) => (
              <SwiperSlide key={prop.id} className="h-auto">
                <div 
                  onClick={() => setSelectedProperty(prop)}
                  className="glass-card overflow-hidden h-full flex flex-col justify-between border-gold-glow group cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div>
                    {/* Property Image Container */}
                    <div className="relative h-64 overflow-hidden bg-slate-900">
                      <img 
                        src={prop.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="bg-slate-950/90 border border-gold-500/40 text-amber-300 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">
                          {prop.propertyType}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${
                          prop.status === 'Available' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50' :
                          prop.status === 'Rented' ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50' :
                          'bg-slate-900/90 text-slate-300 border border-slate-700'
                        }`}>
                          {prop.listingType} &bull; {prop.status}
                        </span>
                      </div>

                      {/* Bottom Price in Cover */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-xl font-bold font-serif text-white text-gold-gradient block">
                          {prop.price}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center text-xs text-amber-200/90 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-gold-400" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-snug line-clamp-2">
                        {prop.title}
                      </h3>

                      {/* Specs Row */}
                      {(prop.bedrooms > 0 || prop.bathrooms > 0) && (
                        <div className="flex items-center space-x-4 pt-2 text-xs text-slate-300">
                          {prop.bedrooms > 0 && (
                            <span className="flex items-center">
                              <BedDouble className="w-4 h-4 text-gold-400 mr-1.5" />
                              {prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}
                            </span>
                          )}
                          {prop.bathrooms > 0 && (
                            <span className="flex items-center">
                              <Bath className="w-4 h-4 text-gold-400 mr-1.5" />
                              {prop.bathrooms} {prop.bathrooms === 1 ? 'Bath' : 'Baths'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProperty(prop);
                      }}
                      className="w-full py-2.5 rounded-xl border border-gold-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider hover:bg-gold-gradient hover:text-slate-950 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-1.5 group-hover:shadow-sm cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Full Details</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>

      {/* Enlarged Property Details Modal via Portal at Root document.body */}
      {selectedProperty && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProperty(null);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          style={{ isolation: 'isolate' }}
        >
          {/* Horizontal Rectangle Modal on Desktop */}
          <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col lg:flex-row">
            
            {/* Prominent High-Contrast Close Button */}
            <button
              onClick={() => setSelectedProperty(null)}
              aria-label="Close property modal"
              className="absolute top-4 right-4 z-50 p-2.5 text-slate-700 hover:text-slate-950 bg-white/95 hover:bg-white rounded-full transition-all border border-slate-300 shadow-md cursor-pointer flex items-center space-x-1"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Close</span>
            </button>

            {/* LEFT COLUMN: Cover Image, Price, Specs & WhatsApp Trigger (Desktop: 45% width) */}
            <div className="lg:w-5/12 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between shrink-0 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="space-y-5 relative z-10">
                {/* Cover Image */}
                <div className="h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-slate-950">
                  <img 
                    src={selectedProperty.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
                    alt={selectedProperty.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-amber-300 border border-gold-500/50 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {selectedProperty.propertyType}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {selectedProperty.listingType} &bull; {selectedProperty.status}
                  </div>
                </div>

                {/* Price Display */}
                <div>
                  <span className="text-xs text-amber-300/80 font-bold uppercase tracking-widest block">Asking Price / Rent</span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white text-gold-gradient">
                    {selectedProperty.price}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400 block">Bedrooms</span>
                    <span className="text-sm font-bold text-white flex items-center mt-0.5">
                      <BedDouble className="w-4 h-4 text-gold-400 mr-1.5" />
                      {selectedProperty.bedrooms || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400 block">Bathrooms</span>
                    <span className="text-sm font-bold text-white flex items-center mt-0.5">
                      <Bath className="w-4 h-4 text-gold-400 mr-1.5" />
                      {selectedProperty.bathrooms || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Location Box */}
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-white/5 flex items-start space-x-2.5 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Location / Neighborhood</span>
                    <span>{selectedProperty.location}</span>
                  </div>
                </div>
              </div>

              {/* Direct Inquire Actions on Left Side */}
              <div className="pt-6 mt-6 border-t border-white/10 space-y-2.5 relative z-10">
                <a
                  href={`https://wa.me/2348153785297?text=Hello%20Royal%20Haven%2C%20I%20am%20interested%20in%20inquiring%20about%3A%20${encodeURIComponent(selectedProperty.title)}%20located%20at%20${encodeURIComponent(selectedProperty.location)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setSelectedProperty(null);
                    onOpenContact();
                  }}
                  className="w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold bg-gold-gradient hover:brightness-110 text-slate-950 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Inspection</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Property Details & Narrative (Desktop: 55% width) */}
            <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh] overscroll-contain">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <div className="flex items-center text-xs text-gold-700 font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 leading-snug pr-12 lg:pr-14">
                    {selectedProperty.title}
                  </h2>
                </div>

                {/* Property Description */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Property Overview &amp; Key Features
                  </h4>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {selectedProperty.description || 'Professional management details, property condition reports, and viewing arrangements are handled directly by Royal Haven Realty & Property Managers Ltd.'}
                  </p>
                </div>

                {/* Verification & Trust Banner */}
                <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-300 text-xs text-slate-800 space-y-1.5">
                  <h5 className="font-bold text-amber-950 uppercase tracking-wider">Royal Haven Verified Listing</h5>
                  <p className="leading-relaxed">
                    All listings under our care undergo title verification, tenancy vetting, and scheduled physical inspections to ensure transparency and investment security.
                  </p>
                </div>
              </div>

              {/* Bottom Close Action */}
              <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-xs text-slate-700 font-semibold block">Managed by</span>
                  <span className="text-[11px] text-slate-600">Royal Haven Realty & Property Managers Ltd.</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProperty(null)}
                    className="px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer"
                  >
                    Close
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
