import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import ImageMarquee from '../components/ImageMarquee';
import Services from '../components/Services';
import ValueChain from '../components/ValueChain';
import Expertise from '../components/Expertise';
import Reviews from '../components/Reviews';
import Projects from '../components/Projects';

const Home = () => {
  return (
    <main>
      <Hero />
      <About />
      <ImageMarquee />
      <Services />
      <ValueChain />
      <Expertise />
      <Reviews />
    </main>
  );
};

export default Home;
