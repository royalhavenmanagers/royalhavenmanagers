import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote, MapPin } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Testimonials() {
  return (
    <section className="py-24 bg-obsidian-950 bg-[#060608] text-white relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Trusted By <span className="text-gold-gradient">Property Owners</span>
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            See what property owners and real estate investors say about our management service and responsiveness.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="pb-12">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
          >
            {companyData.testimonials.map((test, idx) => (
              <SwiperSlide key={idx}>
                <div className="glass-card p-8 h-full flex flex-col justify-between border-gold-glow relative">
                  <div className="space-y-4">
                    {/* Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1 text-gold-400">
                        {[...Array(test.rating)].map((_, sIdx) => (
                          <Star key={sIdx} className="w-5 h-5 fill-gold-400" />
                        ))}
                      </div>
                      <Quote className="w-7 h-7 text-gold-500/30" />
                    </div>

                    <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed">
                      "{test.comment}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-white text-lg">{test.name}</h4>
                      <p className="text-xs text-gold-400 font-semibold">{test.role}</p>
                    </div>

                    <div className="flex items-center text-xs text-slate-300 bg-obsidian-900 px-3 py-1 rounded-full border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-gold-500 mr-1.5" />
                      <span>{test.location}</span>
                    </div>
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
