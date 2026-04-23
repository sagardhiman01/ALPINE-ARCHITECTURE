import React from 'react';
import Expertise from '../components/Expertise';

const ExpertisePage = () => {
  return (
    <main className="pt-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl border-b border-gray-800 pb-8 mb-8">
        <h1 className="text-4xl sm:text-6xl font-serif text-white text-center mt-12">Our Core Expertise</h1>
        <p className="text-[#DAA520] font-sans tracking-widest uppercase text-sm text-center mt-4">Specialized domains we excel in</p>
      </div>
      <Expertise />
    </main>
  );
};

export default ExpertisePage;
