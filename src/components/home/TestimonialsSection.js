import React from 'react';
import { StarIcon } from 'lucide-react';

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I was stuck in a rut with my living room. RoomDev gave me ideas I never would have thought of. My space feels brand new!",
      name: "Sarah K.",
      role: "Homeowner",
      rating: 5,
    },
    {
      quote: "As a real estate agent, I use this to show clients the potential of a property. It's a total game-changer. So fast and easy.",
      name: "Mark T.",
      role: "Real Estate Agent",
      rating: 5,
    },
    {
      quote: "This is so much fun! I've redesigned my bedroom 10 different ways. The quality of the renders is amazing for a free tool.",
      name: "Jessica L.",
      role: "Design Enthusiast",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Loved by Thousands of Home Designers
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-green-500" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6 flex-grow">&quot;{testimonial.quote}&quot;</p>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;