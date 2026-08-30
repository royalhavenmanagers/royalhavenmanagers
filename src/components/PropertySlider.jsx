import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MapPin, BedDouble, Shield, Check, ExternalLink } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function PropertySlider({ onOpenContact }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Residential', 'Apartments', 'Commercial', 'Serviced'];

  const filteredPortfolio = activeCategory === 'All'
    ? companyData.portfolio
    : companyData.portfolio.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="portfolio" className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
              <span>CURRENT MANAGEMENT PORTFOLIO</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Featured <span className="text-gold-gradient">Properties</span>
            </h2>
            <p className="text-slate-300 text-sm">
              Explore some of the premier residential, commercial, and apartment complexes managed with royalty-grade care.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-lg transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                    : 'bg-obsidian-800 text-slate-300 border border-gold-500/20 hover:border-gold-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative pb-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            className="rounded-2xl"
          >
            {filteredPortfolio.map((prop) => (
              <SwiperSlide key={prop.id}>
                <div className="glass-card overflow-hidden h-full flex flex-col justify-between border-gold-glow group">
                  <div>
                    {/* Property Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={prop.image} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent"></div>
                      
                      <span className="absolute top-4 left-4 bg-obsidian-900/90 border border-gold-500/40 text-gold-300 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">
                        {prop.category}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center text-xs text-gold-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>{prop.location}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                        {prop.title}
                      </h3>

                      {/* Specs Highlights */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        {Object.entries(prop.specs).map(([key, val], sIdx) => (
                          <div key={sIdx} className="bg-obsidian-900/60 p-2 rounded-lg text-[11px] text-slate-300">
                            <span className="text-slate-500 uppercase text-[9px] block">{key}</span>
                            <span className="font-semibold text-white">{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {prop.highlights.map((hl, hIdx) => (
                          <span key={hIdx} className="inline-flex items-center text-[10px] bg-gold-500/10 text-amber-200 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                            <Check className="w-3 h-3 text-gold-500 mr-1" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={onOpenContact}
                      className="w-full py-3 rounded-xl bg-gold-gradient text-obsidian-900 text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:brightness-110 transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Inquire About Similar Property</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
