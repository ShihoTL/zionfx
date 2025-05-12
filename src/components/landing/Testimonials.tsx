import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    content: "ZionFX Academy transformed my approach to forex trading. The strategies I learned have given me consistent results that I never thought possible. Jonathan's mentorship has been invaluable.",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    content: "After trying multiple forex courses, ZionFX stands out by miles. The focus on psychology and real market conditions helped me overcome my trading blocks. Now I trade with confidence.",
    image: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Madrid, Spain",
    content: "The personal attention from ZionFX mentors makes all the difference. They don't just teach you to follow signals blindly – they teach you to understand the market and make your own decisions.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 4,
    name: "David Okonkwo",
    location: "Lagos, Nigeria",
    content: "I went from losing trades consistently to achieving my first profitable month after just 8 weeks with ZionFX. The structured approach and community support are exactly what I needed.",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-16 md:py-24 bg-dark-900 transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Trader <span className="text-gold-500">Testimonials</span>
          </h2>
          <p className="text-white/70">
            Hear from our community of successful traders who have transformed their results with ZionFX.
          </p>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-dark-800 rounded-xl p-6 md:p-8 border border-dark-700">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading font-medium text-white">{testimonial.name}</h4>
                          <p className="text-sm text-white/60">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="flex text-gold-500">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="#FFD700" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-white/80 italic mb-6">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-dark-800 text-white p-3 rounded-full border border-dark-600 hover:text-gold-500 hidden md:block transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-dark-800 text-white p-3 rounded-full border border-dark-600 hover:text-gold-500 hidden md:block transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-gold-500' : 'bg-dark-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;