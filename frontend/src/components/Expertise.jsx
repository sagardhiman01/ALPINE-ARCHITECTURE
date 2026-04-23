import React from 'react';
import { Home, Stethoscope, BookOpen, Briefcase, Factory, Map, Building2, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap = {
  'Residential': <Home size={40} className="text-[#DAA520]" />,
  'Healthcare': <Stethoscope size={40} className="text-[#DAA520]" />,
  'Institutional': <BookOpen size={40} className="text-[#DAA520]" />,
  'Commercial': <Briefcase size={40} className="text-[#DAA520]" />,
  'Industrial': <Factory size={40} className="text-[#DAA520]" />,
  'Plotting Design': <Map size={40} className="text-[#DAA520]" />,
  'Default': <Building2 size={40} className="text-[#DAA520]" />
};

const Expertise = () => {
  const { content } = useContent();

  const metrics = content?.expertise || [
    { title: 'Residential', count: '150+' },
    { title: 'Healthcare', count: '25+' },
    { title: 'Commercial', count: '40+' }
  ];

  return (
    <section id="expertise" className="py-24 bg-zinc-950 text-white border-t border-zinc-900">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl text-center">
        <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-[10px] uppercase mb-4">Domain Expertise</h4>
        <h2 className="text-4xl sm:text-5xl font-serif mb-16">Studios Reach</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {metrics.map((item, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-col items-center justify-center p-12 bg-black/20 border border-zinc-900 rounded-lg group animate-fade-in-up"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 text-5xl sm:text-6xl font-serif text-[#DAA520] group-hover:scale-110 transition-transform duration-500">
                  {item.count}
                </div>
                <h3 className="font-sans text-xs sm:text-sm tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors duration-500 uppercase font-bold">
                  {item.title}
                </h3>
              </div>
              
              {/* Corner Glow */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#DAA520] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
