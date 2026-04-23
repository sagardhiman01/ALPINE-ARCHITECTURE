import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Vikram Sethi",
    role: "Proprietor, Heritage Villas",
    text: "Alpine Studios transformed our vision into a breathtaking reality. Their attention to detail and understanding of modern aesthetics is unparalleled in the industry.",
    rating: 5
  },
  {
    name: "Anjali Sharma",
    role: "Director, Wellness Center",
    text: "The healthcare project they designed for us is a perfect blend of functionality and serenity. Their team is professional, innovative, and highly responsive.",
    rating: 5
  },
  {
    name: "Rajesh Malhotra",
    role: "CEO, Nexa Corp",
    text: "Working with Alpine was a seamless experience. They delivered a corporate headquarters that truly reflects our brand's authority and forward-thinking nature.",
    rating: 5
  }
];

const Reviews = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#DAA520] blur-[150px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h4 className="text-[#DAA520] font-sans font-semibold tracking-[0.3em] text-[10px] uppercase mb-4 animate-fade-in">Testimonials</h4>
          <h2 className="text-4xl sm:text-5xl font-serif mb-6 animate-fade-in-up">Client Perspectives</h2>
          <div className="w-20 h-1 bg-[#DAA520] mx-auto opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div 
              key={idx}
              className="group relative p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-[#DAA520]/50 transition-all duration-700 hover:-translate-y-4 animate-fade-in-up"
              style={{ animationDelay: `${0.2 * idx}s` }}
            >
              {/* Animated Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#DAA520]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-between items-start">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#DAA520] text-[#DAA520]" />
                    ))}
                  </div>
                  <Quote className="text-zinc-700 group-hover:text-[#DAA520]/30 transition-colors duration-500" size={32} />
                </div>

                <p className="text-gray-400 text-base leading-relaxed mb-8 italic group-hover:text-gray-200 transition-colors duration-500">
                  "{review.text}"
                </p>

                <div>
                  <h5 className="text-white font-sans font-bold text-sm tracking-widest uppercase mb-1">
                    {review.name}
                  </h5>
                  <p className="text-[#DAA520] text-[10px] uppercase tracking-[0.2em] font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
              
              {/* Corner accent */}
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#DAA520] opacity-0 group-hover:opacity-100 group-hover:scale-[10] transition-all duration-700 rounded-full blur-[1px]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
