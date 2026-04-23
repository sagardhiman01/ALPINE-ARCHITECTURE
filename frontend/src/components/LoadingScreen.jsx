import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Hide after 2.5 seconds
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onComplete, 500); // Wait for fade animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        {/* Pulsing outer ring */}
        <div className="absolute inset-[-20px] border-2 border-[#DAA520]/30 rounded-full animate-ping opacity-20"></div>
        
        {/* Rotating border */}
        <div className="absolute inset-[-10px] border border-dashed border-[#DAA520]/50 rounded-full animate-[spin_10s_linear_infinite]"></div>

        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#DAA520] overflow-hidden shadow-[0_0_50px_rgba(218,165,32,0.3)] animate-float">
          <img 
            src="/logo.png" 
            alt="Alpine Logo" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mt-12 text-center">
          <span className="text-white text-3xl sm:text-5xl font-serif tracking-[0.3em] font-light animate-fade-in uppercase">
            Alpine Studios
          </span>
        <div className="mt-4 w-48 h-[1px] bg-zinc-800 relative overflow-hidden mx-auto">
          <div className="absolute top-0 left-0 h-full w-24 bg-[#DAA520] animate-[slide_2s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
