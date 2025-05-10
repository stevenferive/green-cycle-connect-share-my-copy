
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import EcoImpact from '@/components/home/EcoImpact';
import HowItWorks from '@/components/home/HowItWorks';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <EcoImpact />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
