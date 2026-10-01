import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Handshake, Building, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function PartnersSection() {
  const swiperRef = useRef(null);

  // Duplicate list to ensure seamless infinite looping on all screen widths
  const sliderPartners = [...companyData.partners, ...companyData.partners];

  return (
    <section id="partners" className="py-20 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/40 text-slate-900 relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-100/30 pointer-events-none blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Companies &amp; Partners We <span className="text-gold-gradient-light">Work With</span>
            </h2>
          </div>

          {/* Auto-scroll Hint & Nav Buttons */}
          <div className="flex items-center space-x-3 self-start md:self-end">
            <span className="text-xs text-amber-800 font-semibold hidden sm:inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-gold-600 mr-1.5 animate-pulse" />
              Auto-scrolling showcase
            </span>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous partner"
              className="p-3 rounded-xl bg-white border border-amber-200/80 hover:border-gold-500/60 text-amber-900 hover:bg-gold-gradient hover:text-slate-950 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next partner"
              className="p-3 rounded-xl bg-white border border-amber-200/80 hover:border-gold-500/60 text-amber-900 hover:bg-gold-gradient hover:text-slate-950 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swipeable & Auto-scrolling Swiper Carousel */}
        <div className="relative pt-2 pb-6">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1.3}
            loop={true}
            speed={800}
            autoplay={{
              delay: 2400,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
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
                <div className="bg-white border border-amber-200/80 hover:border-gold-500/70 p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md h-full cursor-grab active:cursor-grabbing">
                  {/* Clean White Responsive Logo Container */}
                  <div className="w-full max-w-[220px] h-28 sm:h-32 rounded-2xl bg-white p-3 border border-amber-200/60 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm shrink-0">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <Building className="w-12 h-12 text-gold-600" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors leading-tight">
                      {partner.name}
                    </h4>
                    <p className="text-[11px] text-amber-800 font-semibold leading-tight">
                      {partner.category}
                    </p>
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
