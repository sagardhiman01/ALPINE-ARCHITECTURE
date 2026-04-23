import React from 'react';
import Projects from '../components/Projects';

const ProjectsPage = () => {
  return (
    <main className="pt-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl text-center py-16">
        <h1 className="text-4xl sm:text-6xl font-serif text-white mb-4">Our Complete Portfolio</h1>
        <p className="text-[#DAA520] font-sans tracking-widest uppercase text-sm">Discover all our acclaimed creations</p>
      </div>
      <Projects isHomePage={false} />
    </main>
  );
};

export default ProjectsPage;
