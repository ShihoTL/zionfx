import React, { useState, useEffect, useCallback, memo } from 'react';

import { Link } from 'react-router-dom';

interface NavbarProps {}

const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Navbar: React.FC<NavbarProps> = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);
  
  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-white/5 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-dark-900/95 backdrop-blur-md py-3 shadow-lg border-b'
            : 'bg-transparent py-5'
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" aria-label="ZionFX Academy Home">
                <span className="font-heading font-bold text-2xl md:text-3xl tracking-tight bg-gradient-to-r from-gold-500 to-yellow-400 text-transparent bg-clip-text">
                  ZionFX
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-8" role="navigation">
              {['home', 'about', 'testimonials', 'awards'].map((section) => (
                <li key={section}>
                  <a
                    href={`/#${section}`}
                    className="relative group"
                  >
                    <span className="font-medium text-sm text-white/80 hover:text-gold-500 transition-colors">
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/dashboard"
                  className="group relative px-6 py-2.5 bg-gold-500 text-dark-900 rounded-xl font-semibold text-sm hover:bg-gold-400 transition-all duration-300 transform hover:-translate-y-0.5"
                  aria-label="Access Dashboard"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <span className="relative">Access Dashboard</span>
                </a>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-5">
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white transform transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white top-2 transition-opacity duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white transform transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <ul
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'h-fit opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
            role="navigation"
          >
            <li className="py-4 space-y-4">
              {['home', 'about', 'testimonials', 'awards'].map((section) => (
                <a
                  key={section}
                  href={`/#${section}`}
                  className="block py-2 text-white/80 hover:text-gold-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
              <Link
                to="/dashboard"
                className="block w-full px-5 py-2.5 bg-gold-500 text-dark-900 rounded-xl font-semibold text-sm hover:bg-gold-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                Access Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
});

export default Navbar;