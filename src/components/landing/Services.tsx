import React from 'react';
import { TrendingUp, Signal, Award } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-dark-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-gold-500">ZionFX</span>?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Learn from Gold Killer and gain access to professional trading strategies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gold-500 rounded-xl p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-dark-900 mb-4">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-dark-900 font-heading font-semibold text-xl mb-3">
              Live Trading Sessions
            </h3>
            <p className="text-dark-900/80">
              Watch and learn as Gold Killer trades XAU/USD live, breaking down market trends and key levels in real time.
            </p>
          </div>

          <div className="bg-gold-500 rounded-xl p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-dark-900 mb-4">
              <Signal size={32} />
            </div>
            <h3 className="text-dark-900 font-heading font-semibold text-xl mb-3">
              Premium Signals
            </h3>
            <p className="text-dark-900/80">
              Gain access to high-accuracy trade signals that help you maximize profits with strategic entries and exits.
            </p>
          </div>

          <div className="bg-gold-500 rounded-xl p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-dark-900 mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-dark-900 font-heading font-semibold text-xl mb-3">
              Elite Mentorship
            </h3>
            <p className="text-dark-900/80">
              Get direct mentorship from Gold Killer, including 1-on-1 coaching, technical analysis, and trading psychology insights.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-dark-900 text-gold-500 rounded-lg font-semibold hover:bg-dark-700 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;