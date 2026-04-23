import React from 'react';
import { Ruler, Building2, HardHat, Calculator, Compass, Leaf, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap = {
  'Urban Planning': <Ruler className="text-[#DAA520]" size={32} />,
  'Architecture & Interior': <Building2 className="text-[#DAA520]" size={32} />,
  'Vastu Consultancy': <Compass className="text-[#DAA520]" size={32} />,
  'Project Management': <HardHat className="text-[#DAA520]" size={32} />,
  'Estimation & Valuation': <Calculator className="text-[#DAA520]" size={32} />,
  'Sustainability': <Leaf className="text-[#DAA520]" size={32} />,
  'Default': <Building2 className="text-[#DAA520]" size={32} />
};

const Services = () => {
  const { content } = useContent();

  const services = content?.services || [];

  return (
    <section id="services" className="py-24 bg-black text-white relative border-t border-zinc-900 selection:bg-[#DAA520] selection:text-black">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-zinc-950 opacity-10 blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-[10px] uppercase mb-4">Service Excellence</h4>
          <h2 className="text-4xl sm:text-5xl font-serif">Studios Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/50 p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:bg-zinc-900/80 hover:border-[#DAA520]/40 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Animated corner border */}
              <div className="absolute top-0 right-0 w-0 h-[1px] bg-[#DAA520] transition-all duration-700 group-hover:w-full"></div>
              <div className="absolute top-0 right-0 w-[1px] h-0 bg-[#DAA520] transition-all duration-700 group-hover:h-full"></div>
              
              <div className="relative z-10">
                <div className="mb-8 p-4 border border-zinc-900 rounded-xl inline-block group-hover:bg-[#DAA520] group-hover:text-black group-hover:border-[#DAA520] transition-all duration-500 group-hover:rotate-6">
                  {iconMap[service.title] || iconMap['Default']}
                </div>
                
                <h3 className="text-lg font-serif mb-4 text-white group-hover:text-[#DAA520] transition-colors tracking-wide">
                  {service.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed font-sans text-sm group-hover:text-gray-300 transition-colors duration-500">
                  {service.description}
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#DAA520]/40 group-hover:text-[#DAA520] transition-all duration-500">
                  <span className="group-hover:translate-x-1 transition-transform">VIEW DETAILS</span>
                  <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Shine effect overlay - Fixed with pointer-events-none to prevent selection glitch */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shine pointer-events-none"></div>
              
              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#DAA520]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
