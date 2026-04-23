import React, { useEffect, useState } from 'react';

const ImageMarquee = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects for marquee:', err);
        setLoading(false);
      });
  }, []);

  if (loading || projects.length === 0) return null;

  // Duplicate the array exactly once for the -50% translateX trick to work perfectly
  const displayItems = [...projects, ...projects];

  return (
    <div className="bg-black py-12 overflow-hidden border-y border-zinc-900 group">
       <div className="flex whitespace-nowrap animate-slide-fast hover:[animation-play-state:paused]">
        {displayItems.map((item, idx) => (
          <div 
            key={`${item.id || idx}-${idx}`} 
            className="flex-shrink-0 px-4 w-[350px] sm:w-[500px]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg group/item">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-1000 group-hover/item:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover/item:bg-transparent transition-colors duration-500"></div>
              
              {/* Elegant Label Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500">
                <span className="text-[#DAA520] font-sans text-[10px] tracking-[0.3em] uppercase block mb-1">
                  {item.category}
                </span>
                <h3 className="text-white font-serif text-lg leading-tight uppercase tracking-wider">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;
