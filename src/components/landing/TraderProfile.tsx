import React from 'react';
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';

const TraderProfile: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-dark-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Start your Trading Journey with <span className="text-gold-500">ZionFX</span>
              </h2>
              <h3 className="text-2xl font-bold mb-6">
                Meet <span className="text-gold-500">Gold Killer</span>
              </h3>
              <p className="text-white/70 leading-relaxed">
                With over four years of experience in the forex markets, Gold Killer has mastered
                the arts of XAU/USD trading. His unique approach combines technical analysis with
                market psychology, resulting in consistent profits even in volatile markets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <div className="text-gold-500 text-3xl font-bold mb-2">$100k+</div>
                <div className="text-white/60">Trading volume</div>
              </div>
              <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <div className="text-gold-500 text-3xl font-bold mb-2">1000+</div>
                <div className="text-white/60">Students trained</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg" 
                alt="Gold Killer - Head Trader"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-dark-800/95 backdrop-blur-sm p-6 rounded-xl border border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">Gold Killer</h4>
                  <p className="text-gold-500 text-sm">Head Trader & Mentor</p>
                </div>
                <button className="px-4 py-2 bg-gold-500 text-dark-900 rounded-lg font-medium hover:bg-gold-400 transition-colors">
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraderProfile;