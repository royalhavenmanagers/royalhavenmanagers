import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Handshake, Building, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function PartnersSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Duplicate list to ensure seamless infinite looping on all screen widths
  const sliderPartners = [...companyData.partners, ...companyData.partners];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold-glow pointer-events-none blur-3xl opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Companies & Partners We <span className="text-gold-gradient">Work With</span>
            </h2>
          </div>

          {/* Swipe Hint & Nav Buttons */}
          <div className="flex items-center space-x-3 self-start md:self-end">
            <span className="text-xs text-amber-200/80 font-medium hidden sm:inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
              Swipe or drag to explore
            </span>
            <button
              ref={prevRef}
              aria-label="Previous partner"
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-gold-500/60 text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              ref={nextRef}
              aria-label="Next partner"
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-gold-500/60 text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swipeable Swiper Carousel */}
        <div className="relative pt-2 pb-6">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1.3}
            loop={true}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            breakpoints={{
              540: { slidesPerView: 2 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="partners-carousel !pb-12"
          >
            {sliderPartners.map((partner, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="bg-slate-800/90 border border-slate-700/90 hover:border-gold-500/70 p-6 rounded-2xl flex flex-col items-center justify-between text-center space-y-4 group hover:-translate-y-2 transition-all duration-300 shadow-lg min-h-[220px] h-full cursor-grab active:cursor-grabbing">
                  {/* Logo container with dark high-contrast backdrop */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-950 p-2.5 border border-slate-700/80 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-gold-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors leading-tight">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-amber-200/80 font-medium leading-relaxed">
                      {partner.category}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-gold-400 transition-colors">
                    Verified Partner
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
