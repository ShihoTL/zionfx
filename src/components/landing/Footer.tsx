import React from 'react';
import { DollarSign, Instagram, Twitter, Youtube, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-900 pt-16 border-t border-dark-700">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          <div>
            <div className="flex items-center text-gold-500 mb-4">
              <span className="font-heading font-bold text-xl tracking-tight">ZionFX</span>
            </div>
            <p className="text-white/60 mb-6">
              Elite forex education for traders who demand excellence. Learn proven strategies that work in real market conditions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-gold-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold-500 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-gold-500 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-white/60 hover:text-gold-500 transition-colors">Home</a></li>
              <li><a href="#about" className="text-white/60 hover:text-gold-500 transition-colors">About</a></li>
              <li><a href="#testimonials" className="text-white/60 hover:text-gold-500 transition-colors">Testimonials</a></li>
              <li><a href="#awards" className="text-white/60 hover:text-gold-500 transition-colors">Awards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-white mb-4">Academy Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-gold-500 transition-colors">Forex Basics</a></li>
              <li><a href="#" className="text-white/60 hover:text-gold-500 transition-colors">Trading Strategies</a></li>
              <li><a href="#" className="text-white/60 hover:text-gold-500 transition-colors">Market Analysis</a></li>
              <li><a href="#" className="text-white/60 hover:text-gold-500 transition-colors">Psychology</a></li>
              <li><a href="#" className="text-white/60 hover:text-gold-500 transition-colors">Risk Management</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-white mb-4">Get in Touch</h4>
            <div className="flex items-start mb-3">
              <Mail className="text-gold-500 mr-3 mt-1" size={18} />
              <span className="text-white/60">support@zionfx.com</span>
            </div>
            <p className="text-white/60 mb-4">
              Have questions? Our team is ready to assist you on your trading journey.
            </p>
            <button className="w-full px-5 py-2.5 bg-dark-700 border border-dark-600 text-white rounded-md font-medium hover:bg-dark-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
        
        <div className="border-t border-dark-700 py-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-white/40 text-sm mb-2 md:mb-0">
            &copy; {currentYear} ZionFX Academy. All rights reserved.
          </p>
          <div className="flex space-x-4 justify-center md:justify-end">
            <a href="#" className="text-white/40 text-sm hover:text-gold-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 text-sm hover:text-gold-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;