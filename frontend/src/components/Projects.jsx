import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TiltCard from './TiltCard';

const Projects = ({ isHomePage = true }) => {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilter(categoryParam);
      setShowAll(true);
    } else {
      setFilter('All');
    }
  }, [location.search]);

  // Derived data with safety
  const safeProjects = Array.isArray(projects) ? projects : [];
  const locations = ['All', ...new Set(safeProjects.map(p => p.location || 'Unknown'))];

  const getFilteredProjects = () => {
    if (filter === 'All') return safeProjects;
    
    // Check specific subcategories
    if (filter === 'Restaurants') return safeProjects.filter(p => (p.category || '').toLowerCase() === 'commercial project' || (p.title || '').toLowerCase().includes('restaurant'));
    if (filter === 'Hotels') return safeProjects.filter(p => (p.category || '').toLowerCase() === 'hotel project' || (p.title || '').toLowerCase().includes('hotel'));
    if (filter === 'Hospitals') return safeProjects.filter(p => (p.category || '').toLowerCase() === 'healthcare' || (p.title || '').toLowerCase().includes('hospital'));
    if (filter === 'Resorts') return safeProjects.filter(p => (p.category || '').toLowerCase() === 'hotel project' || (p.title || '').toLowerCase().includes('resort'));
    if (filter === 'Residential') return safeProjects.filter(p => (p.category || '').toLowerCase().includes('residential'));
    if (filter === 'Designs') return safeProjects.filter(p => (p.category || '').toLowerCase() === 'plotting design');

    return safeProjects.filter(p => p.location === filter);
  };

  const getHomePageProjects = () => {
    if (safeProjects.length === 0) return [];
    const categoryMap = new Map();
    safeProjects.forEach(p => {
      const cat = p.category || 'Other';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, p);
      }
    });
    return Array.from(categoryMap.values());
  };

  const filtered = getFilteredProjects();
  const displayedProjects = isHomePage ? getHomePageProjects() : (showAll ? filtered : filtered.slice(0, 10));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isHomePage && displayedProjects.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayedProjects.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHomePage, displayedProjects.length]);

  return (
    <section id="projects" className="py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="flex-1">
            <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.4em] text-xs uppercase mb-4 animate-fade-in">Our Portfolio</h4>
            <h2 className="text-4xl sm:text-6xl font-serif leading-tight animate-fade-in-up">Globally Acclaimed <br/> Creations</h2>
          </div>
          
          {!isHomePage && (
            <div className="flex flex-wrap gap-3 animate-fade-in">
              {locations.map((loc, i) => (
                <button 
                  key={`${loc}-${i}`}
                  onClick={() => setFilter(loc)}
                  className={`px-5 py-2 border text-[10px] font-sans tracking-[0.2em] transition-all duration-500 ${filter === loc ? 'border-[#DAA520] bg-[#DAA520] text-black font-bold' : 'border-zinc-800 text-gray-400 hover:border-[#DAA520] hover:text-white'}`}
                >
                  {String(loc).toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#DAA520] animate-pulse">Loading Portfolio...</div>
        ) : (
          <>
            {isHomePage ? (
              /* HOME PAGE SLIDER VERSION */
              <div className="relative group max-w-5xl mx-auto">
                <div className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-sm">
                  {displayedProjects.map((proj, idx) => (
                    <div 
                      key={proj.id || idx}
                      className={`absolute inset-0 transition-opacity duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) ${
                        idx === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                      onClick={() => setSelectedImage(proj.image)}
                    >
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      
                      {/* Project Info Overlay */}
                      <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full">
                        <div className={`transition-all duration-700 delay-300 ${idx === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                          <span className="inline-block px-4 py-1.5 border border-[#DAA520] text-[#DAA520] text-[10px] font-sans tracking-[0.3em] uppercase mb-6 bg-black/60 backdrop-blur-md">
                            {proj.category}
                          </span>
                          <h3 className="text-4xl sm:text-6xl font-serif text-white mb-4 drop-shadow-2xl">{proj.title}</h3>
                          <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[#DAA520]"></span>
                            <p className="text-gray-300 font-sans tracking-[0.1em] text-sm uppercase">
                              {proj.fullLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Navigation Controls */}
                <div className="absolute -bottom-12 right-0 flex gap-4 pr-4">
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + displayedProjects.length) % displayedProjects.length)}
                    className="w-14 h-14 flex items-center justify-center border border-zinc-800 hover:border-[#DAA520] hover:text-[#DAA520] transition-all duration-500 rounded-full bg-black/50 backdrop-blur-sm"
                  >
                    <span className="text-xl">←</span>
                  </button>
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % displayedProjects.length)}
                    className="w-14 h-14 flex items-center justify-center border border-zinc-800 hover:border-[#DAA520] hover:text-[#DAA520] transition-all duration-500 rounded-full bg-black/50 backdrop-blur-sm"
                  >
                    <span className="text-xl">→</span>
                  </button>
                </div>

                {/* Dot Pagination */}
                <div className="absolute -bottom-12 left-0 flex gap-3 h-14 items-center pl-4">
                  {displayedProjects.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-[2px] transition-all duration-500 ${i === currentIndex ? 'w-12 bg-[#DAA520]' : 'w-6 bg-zinc-800 hover:bg-zinc-600'}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* FULL PORTFOLIO GRID VERSION */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedProjects.map((proj, idx) => (
                  <div key={proj.id || idx} onClick={() => setSelectedImage(proj.image)}>
                    <TiltCard className="group relative overflow-hidden h-96 cursor-pointer">
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        loading="lazy"
                        className={`w-full h-full transition-transform duration-700 group-hover:scale-110 object-cover ${proj.category === 'Plotting Design' ? 'bg-white p-4 object-contain' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-3 py-1 border border-[#DAA520] text-[#DAA520] text-xs font-sans tracking-widest uppercase mb-4 bg-black/50 backdrop-blur-sm">
                          {proj.category}
                        </span>
                        <h3 className="text-3xl font-serif text-white mb-2">{proj.title}</h3>
                        <p className="text-gray-300 font-sans tracking-wide text-sm flex items-center gap-2">
                          <span className="w-4 h-[1px] bg-[#DAA520] inline-block"></span>
                          {proj.fullLocation}
                        </p>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-24 text-center">
          {isHomePage ? (
            <Link to="/projects" className="group relative inline-flex items-center gap-4 px-10 py-4 bg-transparent border border-[#DAA520] text-[#DAA520] font-sans text-xs font-bold tracking-[0.2em] overflow-hidden transition-all duration-500 hover:text-black">
              <span className="relative z-10">VIEW ALL PROJECTS</span>
              <div className="absolute inset-0 bg-[#DAA520] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </Link>
          ) : (
            filtered.length > displayedProjects.length && (
              <button 
                onClick={() => setShowAll(!showAll)}
                className="px-10 py-4 border border-[#DAA520] text-[#DAA520] font-sans text-xs font-bold tracking-[0.2em] hover:bg-[#DAA520] hover:text-black transition-all duration-500"
              >
                {showAll ? 'SHOW LESS' : 'LOAD MORE PROJECTS'}
              </button>
            )
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Large" className="max-w-full max-h-full object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
};

export default Projects;
