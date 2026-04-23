import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { 
      name: 'PROJECTS', 
      href: '/projects',
      subLinks: [
        { name: 'RESTAURANTS', href: '/projects?category=Restaurants' },
        { name: 'HOTELS', href: '/projects?category=Hotels' },
        { name: 'HOSPITALS', href: '/projects?category=Hospitals' },
        { name: 'RESORTS', href: '/projects?category=Resorts' },
        { name: 'RESIDENTIAL', href: '/projects?category=Residential' },
        { name: 'DESIGNS', href: '/projects?category=Designs' }
      ]
    },
    { name: 'SERVICES', href: '/services' },
    { name: 'EXPERTISE', href: '/expertise' },
    { name: 'PRICING', href: '/pricing' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 border border-[#DAA520] rounded-full overflow-hidden shadow-[0_0_15px_rgba(218,165,32,0.2)] group-hover:border-white transition-all duration-500">
            <img 
              src="/logo.png" 
              alt="Alpine Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-serif font-bold text-xl tracking-widest text-white whitespace-nowrap hidden sm:block">
            ALPINE STUDIOS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group py-2">
              <Link to={link.href} className="text-sm font-semibold tracking-wider hover:text-[#DAA520] transition-colors flex items-center gap-1">
                {link.name}
                {link.subLinks && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>}
              </Link>
              {link.subLinks && (
                <div className="absolute top-full left-0 w-48 bg-black/95 backdrop-blur-md border border-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 mt-0">
                  {link.subLinks.map(sub => (
                    <Link key={sub.name} to={sub.href} className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-300 hover:text-[#DAA520] hover:bg-white/5 transition-colors">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="/#contact" className="px-6 py-2 border border-[#DAA520] text-[#DAA520] font-semibold text-sm hover:bg-[#DAA520] hover:text-black transition-all">
            CONTACT US
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="lg:hidden text-white hover:text-[#DAA520]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-t border-gray-800 flex flex-col items-center py-8 gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <div key={link.name} className="w-full flex flex-col items-center">
              <Link to={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold tracking-wider hover:text-[#DAA520] transition-colors">
                {link.name}
              </Link>
              {link.subLinks && (
                <div className="w-full flex flex-col items-center gap-4 mt-4 bg-white/5 py-4">
                  {link.subLinks.map(sub => (
                    <Link key={sub.name} to={sub.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold tracking-wider text-gray-400 hover:text-[#DAA520] transition-colors">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="px-8 py-3 mt-4 border border-[#DAA520] text-[#DAA520] font-semibold hover:bg-[#DAA520] hover:text-black transition-all">
            CONTACT US
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
