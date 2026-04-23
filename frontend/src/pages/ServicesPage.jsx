import React from 'react';
import Services from '../components/Services';
import ValueChain from '../components/ValueChain';

const ServicesPage = () => {
  return (
    <main className="pt-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl border-b border-gray-800 pb-8 mb-8">
        <h1 className="text-4xl sm:text-6xl font-serif text-white text-center mt-12">Our Services & Value Chain</h1>
        <p className="text-[#DAA520] font-sans tracking-widest uppercase text-sm text-center mt-4">Comprehensive architectural solutions</p>
      </div>
      <Services />
      <ValueChain />
    </main>
  );
};

export default ServicesPage;
