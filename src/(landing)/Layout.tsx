import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TraderProfile from '@/components/landing/TraderProfile';
import Services from '@/components/landing/Services';
import AboutTrader from '@/components/landing/AboutTrader';
import Testimonials from '@/components/landing/Testimonials';
import Awards from '@/components/landing/Awards';
import Footer from '@/components/landing/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 text-white select-none">
      <Navbar />
      <main>
        <HeroSection />
        <TraderProfile />
        <Services />
        <AboutTrader />
        <Testimonials />
        <Awards />
      </main>
      <Footer />
    </div>
  );
}

export default App;