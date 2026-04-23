import React from 'react';
import { useContent } from '../context/ContentContext';

const About = () => {
  const { content, loading } = useContent();

  if (loading || !content) return null;

  return (
    <section id="about" className="py-24 bg-zinc-950 text-white selection:bg-[#DAA520] selection:text-black">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-[10px] uppercase">
                {content.about?.subheading || "Studios Profile"}
              </h4>
              <h2 className="text-4xl sm:text-5xl font-serif leading-tight">
                {content.about?.heading || "The Man Behind Alpine Architecture"}
              </h2>
            </div>
            
            <p className="text-gray-400 font-sans leading-relaxed text-lg whitespace-pre-wrap">
              {content.about?.description}
            </p>

            <div className="pt-4 flex items-center gap-6">
              <div className="w-16 h-[1px] bg-[#DAA520]"></div>
              <span className="font-serif italic text-2xl text-white">{content.about?.signature || "Ar. Mayur — Roorkee HQ"}</span>
            </div>
          </div>

          {/* Image/Stats side */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            {/* Background design elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border border-[#DAA520]/20 rounded-3xl rotate-6 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border border-zinc-800 rounded-3xl -rotate-3 pointer-events-none"></div>
            
            {/* The Image Container */}
            <div className="relative z-10 w-full max-w-md aspect-[3/4] bg-zinc-900/50 backdrop-blur-xl border border-[#DAA520]/40 p-3 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group hover:border-[#DAA520] transition-all duration-700">
              <div className="w-full h-full overflow-hidden rounded-xl bg-black/40 shadow-inner">
                <img 
                  src={content.about?.about_image || "/about_image.jpg"} 
                  alt="Ar. Mayur - Principal Architect" 
                  className="w-full h-full object-contain grayscale-0 lg:grayscale lg:group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[#DAA520] rounded-tl-2xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[#DAA520] rounded-br-2xl"></div>
            </div>
          </div>

        </div>

        {/* Marquee matching the Mac Studios Hub moving text */}
        <div className="mt-32 border-y border-zinc-900 py-8 overflow-hidden flex whitespace-nowrap">
          <div className="animate-slide flex gap-16 items-center text-zinc-600 font-sans uppercase tracking-[0.3em] text-xs font-bold">
            <span>Urban Planning • Architecture • Interior Design • Project Management • Estimation & Valuation • Vastu Consultancy • Building Maintenance • Waste Management • Environmental Management •</span>
            <span>Urban Planning • Architecture • Interior Design • Project Management • Estimation & Valuation • Vastu Consultancy • Building Maintenance • Waste Management • Environmental Management •</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
