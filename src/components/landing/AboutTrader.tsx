import React, { useEffect, useRef } from 'react';
import { TrendingUp, Trophy, Users, Lightbulb } from 'lucide-react';

const AboutTrader: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add('opacity-100');
          sectionRef.current?.classList.remove('opacity-0', 'translate-y-8');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 md:py-24 bg-dark-800 transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-lg md:text-4xl text-white mb-4">
            About <span className="text-gold-500">the Trader</span>
          </h2>
          <p className="text-white/70 text-sm">
            Meet the mind behind ZionFX Academy and discover our unique approach to the forex market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden">
            <div className="relative aspect-[4/4] w-full bg-dark-700">
              <img 
                src="https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Head Trader at ZionFX" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center bg-dark-800/90 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-3 h-12 bg-gold-500 rounded mr-4"></div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white">Precious Benjamin</h3>
                    <p className="text-gold-500 text-sm">Founder, AKA <span className="italic">"ZionFX"</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-2xl text-white">
                <span className="text-gold-500">8+ </span>
                Years of Market Mastery
              </h3>
              <p className="text-white/70 leading-relaxed">
                You see, 8 years ago I was just that guy looking for a genuine way to make money online. In 2015, I made a choice most kids wouldn't even consider— I decided to drop out of school. My family thought I was out of my mind because I was studying law and doing well in school. But here's the thing: from a very young age my dream has always been to own a Lamborghini and be able to travel the world with location and time freedom.
              </p>
              <p className="text-white/70 leading-relaxed">
                Once I discovered Forex Trading and understood that it has the potential to make me some serious money, I had to go all in. I even went viral when I bought a Mercedes-Benz after profiting over $270,000 in a single trade. What I am trying to say is that Forex Trading funded and is funding my dreams and it can do the same for you.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <h4 className="font-heading font-medium text-xl text-white">What We Offer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-gold-500/30 transition-colors group">
                  <div className="text-gold-500 mb-3 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h5 className="font-heading font-medium text-white mb-2">Community</h5>
                  <p className="text-sm text-white/70">A vast community of over 100,000 awesome Fx traders sharing signals and resources.</p>
                </div>
                <div className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-gold-500/30 transition-colors group">
                  <div className="text-gold-500 mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <h5 className="font-heading font-medium text-white mb-2">Live Sessions</h5>
                  <p className="text-sm text-white/70">Weekly live trading sessions every Monday at 1:00 PM GMT+1.</p>
                </div>
                <div className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-gold-500/30 transition-colors group">
                  <div className="text-gold-500 mb-3 group-hover:scale-110 transition-transform">
                    <Trophy size={24} />
                  </div>
                  <h5 className="font-heading font-medium text-white mb-2">Forex Enlightenment</h5>
                  <p className="text-sm text-white/70">Comprehensive curriculum from basics to advanced strategies.</p>
                </div>
                <div className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-gold-500/30 transition-colors group">
                  <div className="text-gold-500 mb-3 group-hover:scale-110 transition-transform">
                    <Lightbulb size={24} />
                  </div>
                  <h5 className="font-heading font-medium text-white mb-2">1-on-1 Mentorship</h5>
                  <p className="text-sm text-white/70">Book intensive one-on-one sessions with our experienced tutors.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <blockquote className="border-l-4 border-gold-500 pl-4 italic text-white/80">
                "I started this academy to allow me to hold as many people by the hand and show them my roadmap step-by-step. This Roadmap is unlike any other trading system you've ever seen out there. I have perfected this strategy over the last seven years and used it to make over $10,000,000 in pure profit, it will save you time and help you trade SMART, not HARD!"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTrader;