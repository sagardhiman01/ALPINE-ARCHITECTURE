import React from 'react';
import { Calculator, Recycle, Leaf } from 'lucide-react';
import TiltCard from './TiltCard';

const ValueChain = () => {
  const steps = [
    {
      title: "Estimation & Valuation",
      description: "Precise cost estimation and comprehensive property valuation tailored for financial transparency.",
      icon: <Calculator size={40} className="text-[#DAA520]" />
    },
    {
      title: "Waste Management",
      description: "Implementing state-of-the-art waste reduction and recycling protocols for modern buildings.",
      icon: <Recycle size={40} className="text-[#DAA520]" />
    },
    {
      title: "Environmental Management",
      description: "Integrating ecological sustainability, green standards, and energy efficiency into every design.",
      icon: <Leaf size={40} className="text-[#DAA520]" />
    }
  ];

  return (
    <section id="value-chain" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DAA520]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-[fadeInUp_1s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-sm uppercase mb-4">Our Approach</h4>
          <h2 className="text-4xl sm:text-5xl font-serif mb-6">Complete Value Chain</h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg">
            We deliver end-to-end solutions that extend far beyond aesthetics, ensuring long-term sustainability and operational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="animate-[fadeInUp_1s_ease-out_forwards] opacity-0" style={{ animationDelay: `${0.4 + idx * 0.2}s` }}>
              <TiltCard className="h-full">
                <div 
                  className="bg-black border border-zinc-800 p-10 h-full flex flex-col items-center text-center group hover:border-[#DAA520] transition-colors"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="mb-8 p-6 bg-zinc-950 rounded-full border border-zinc-900 group-hover:border-[#DAA520]/50 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-serif mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-400 font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueChain;
