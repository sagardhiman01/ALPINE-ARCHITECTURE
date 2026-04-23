import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';

const Hero = () => {
  const { content, loading } = useContent();
  const [currentImage, setCurrentImage] = useState(0);

  const images = content?.hero?.images || [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628744276229-497443d853c4?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  if (loading || !content) return <div className="h-screen bg-black" />;

  return (
    <section className="relative h-screen bg-black overflow-hidden flex items-center pt-24">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DAA520] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Background Image Slider with Overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20"></div>
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              idx === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Modern Architecture ${idx + 1}`} 
              loading={idx === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-30">
        <div className="flex flex-col items-center text-center">
          {/* Logo Branding */}
          <div className="w-24 h-24 mb-10 border border-[#DAA520]/30 rounded-full p-2 bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(218,165,32,0.1)] animate-fade-in overflow-hidden">
            <img src={content.logo || "/logo.png"} alt="Alpine Logo" className="w-full h-full object-cover rounded-full filter brightness-110" />
          </div>
          
          <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-6 animate-fade-in-up">
            {content.hero?.subtitle || "Architectural Excellence"}
          </h4>
          
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-serif text-white mb-8 leading-none animate-fade-in-up">
            {content.hero?.title || "Alpine Architecture Studios"}
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl font-light leading-relaxed mb-12 animate-fade-in-up delay-200 px-4">
            {content.hero?.description}
          </p>

          <a 
            href="#projects" 
            className="group relative px-10 py-5 bg-[#DAA520] text-black font-sans text-xs font-bold tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-2xl animate-fade-in-up delay-300"
          >
            EXPLORE PORTFOLIO
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

