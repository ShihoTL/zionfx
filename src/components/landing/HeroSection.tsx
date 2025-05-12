import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ChartBackground from './ChartBackground';

const images = [
  "https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1280",
  "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1280"
];

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      requestAnimationFrame(() => {
        sectionRef.current?.classList.add('opacity-100', 'translate-y-0');
        sectionRef.current?.classList.remove('opacity-0', 'translate-y-8');
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
<section 
  id="home" 
  ref={sectionRef}
  className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 opacity-0 translate-y-8 transition-all duration-1000"
>
  {/* Rotating background */}
  <div className="absolute inset-0 overflow-hidden">
    {images.map((image, index) => (
      <div
        key={index}
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: index === currentImageIndex ? 1 : 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
    ))}
  </div>

  {/* Hero Content */}
  <div className="z-10 text-center max-w-2xl">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
      Learn <span className="text-gold-500">Forex</span> like a Pro<br />
      with <span className="text-gold-500">ZionFX</span>
    </h1>
    <p className="mt-6 text-lg sm:text-xl text-white/80 font-medium drop-shadow">
      Unlock the techniques of top-tier trading from one of the best Forex academies in the world!
    </p>

    {/* CTA Buttons */}
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
      <button className="px-8 py-3 bg-gold-500 text-dark-900 rounded-md font-semibold hover:bg-gold-400 transition">
        <p className="font-extrabold text-xl">
          Let's Dive in!
        </p>
      </button>
    </div>
  </div>

  {/* Scroll Down Button */}
  <div className="absolute bottom-8 w-full flex justify-center animate-bounce z-10">
    <button 
      onClick={scrollToNext}
      className="text-white/50 hover:text-gold-500 transition-colors"
    >
      <ChevronDown size={32} />
    </button>
  </div>

  <div className="absolute bottom-0 h-[2rem] w-full bg-gradient-to-t from-dark-900 to-transparent"></div>
</section>

  );
};

export default HeroSection;