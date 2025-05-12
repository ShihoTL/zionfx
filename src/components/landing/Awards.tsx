import React, { useEffect, useRef } from 'react';
import { Award, Medal, Trophy, Star, ThumbsUp } from 'lucide-react';

interface AwardItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  year: string;
  description: string;
}

const awards: AwardItem[] = [
  {
    id: 1,
    icon: <Trophy className="text-gold-500" size={32} />,
    title: "Best Forex Education Provider",
    year: "2024",
    description: "Awarded by Forex Trading Excellence for comprehensive curriculum and student results."
  },
  {
    id: 2,
    icon: <Medal className="text-gold-500" size={32} />,
    title: "Trader's Choice Award",
    year: "2023",
    description: "Voted #1 by a community of over 50,000 traders worldwide."
  },
  {
    id: 3,
    icon: <Star className="text-gold-500" size={32} />,
    title: "Trading Strategy Innovation",
    year: "2023",
    description: "Recognized for pioneering new approaches to market analysis and execution."
  },
  {
    id: 4,
    icon: <Award className="text-gold-500" size={32} />,
    title: "Excellence in Mentorship",
    year: "2022",
    description: "Awarded for outstanding trader development and personal guidance."
  },
  {
    id: 5,
    icon: <ThumbsUp className="text-gold-500" size={32} />,
    title: "Highest Student Satisfaction",
    year: "2022",
    description: "Achieved 98% satisfaction rating from academy graduates."
  }
];

const Awards: React.FC = () => {
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
      id="awards" 
      ref={sectionRef}
      className="py-16 md:py-24 bg-dark-800 transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Awards & <span className="text-gold-500">Recognition</span>
          </h2>
          <p className="text-white/70">
            Our commitment to excellence has been recognized by the forex trading community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <div 
              key={award.id}
              className="bg-dark-700 rounded-xl p-6 border border-dark-600 hover:border-gold-500/30 transition-all hover:-translate-y-1 duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  {award.icon}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-white mb-1">
                    {award.title}
                  </h3>
                  <p className="text-gold-500 text-sm mb-3">{award.year}</p>
                  <p className="text-white/70 text-sm">{award.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-dark-900 to-dark-700 rounded-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-heading font-semibold text-xl text-white mb-2">
                Join an Award-Winning Trading Academy
              </h3>
              <p className="text-white/70">
                Experience the difference that has earned us recognition across the industry.
              </p>
            </div>
            <div>
              <button className="px-6 py-3 bg-gold-500 text-dark-900 rounded-md font-medium hover:bg-gold-400 transition-colors">
                Sign In to Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;