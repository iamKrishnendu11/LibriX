import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Buyer",
      type: "buyer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5,
      text: "Outstanding service! The team helped me find my dream home within my budget. The entire process was smooth and transparent."
    },
    {
      name: "Michael Chen",
      role: "Real Estate Seller",
      type: "seller",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 5,
      text: "I was able to sell my property in just 3 weeks! Their marketing strategy and professional approach exceeded my expectations."
    },
    {
      name: "Emily Rodriguez",
      role: "First-Time Buyer",
      type: "buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5,
      text: "As a first-time buyer, I was nervous about the process. The team guided me every step of the way with patience."
    },
    {
      name: "David Thompson",
      role: "Property Investor",
      type: "lender",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      rating: 5,
      text: "Professional, reliable, and knowledgeable. They helped me build a profitable property portfolio."
    },
    {
      name: "Lisa Anderson",
      role: "Home Seller",
      type: "seller",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      rating: 5,
      text: "Sold my home above asking price! The photography, staging advice, and negotiation skills were top-notch."
    },
    {
      name: "James Wilson",
      role: "Commercial Buyer",
      type: "buyer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      rating: 5,
      text: "Their commercial property expertise is unmatched. Found the perfect location for my business."
    },
    {
      name: "Rachel Green",
      role: "Property Buyer",
      type: "buyer",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      rating: 5,
      text: "Amazing experience from start to finish. They truly care about finding the right home for you."
    },
    {
      name: "Thomas Martinez",
      role: "Real Estate Investor",
      type: "lender",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      rating: 5,
      text: "Their market knowledge and investment advice have been invaluable to growing my portfolio."
    },
    {
      name: "Amanda White",
      role: "Property Seller",
      type: "seller",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      rating: 5,
      text: "Exceptional service and results. They marketed my property beautifully and got multiple offers."
    }
  ];

  const typeColors = {
    buyer: "from-blue-400 to-cyan-400",
    seller: "from-yellow-400 to-orange-400",
    lender: "from-green-400 to-emerald-400"
  };

  // Split testimonials into 3 rows
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);
  const row3 = testimonials.slice(6, 9);

  const TestimonialCard = ({ testimonial, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[350px] mx-4"
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="absolute -top-3 -left-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${typeColors[testimonial.type]} flex items-center justify-center shadow-lg`}>
            <Quote className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
          "{testimonial.text}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${typeColors[testimonial.type]} rounded-full blur-sm opacity-50`} />
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="relative w-12 h-12 rounded-full object-cover border-2 border-white"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-24 bg-gradient-to-br from-green-50 via-white to-yellow-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 px-4"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full border border-green-200 mb-6">
            Client Success Stories
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">
              Say
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
          </p>
        </motion.div>

        {/* Infinite Scrolling Testimonials - Row 1 (Left to Right) */}
        <div className="relative mb-8">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [0, -1050],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...row1, ...row1, ...row1].map((testimonial, index) => (
                <TestimonialCard key={`row1-${index}`} testimonial={testimonial} index={index} />
              ))}
            </motion.div>
          </div>
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-green-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none" />
        </div>

        {/* Infinite Scrolling Testimonials - Row 2 (Right to Left) */}
        <div className="relative mb-8">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [-1050, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...row2, ...row2, ...row2].map((testimonial, index) => (
                <TestimonialCard key={`row2-${index}`} testimonial={testimonial} index={index} />
              ))}
            </motion.div>
          </div>
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-green-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none" />
        </div>

        {/* Infinite Scrolling Testimonials - Row 3 (Left to Right) */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [0, -1050],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 22,
                  ease: "linear",
                },
              }}
            >
              {[...row3, ...row3, ...row3].map((testimonial, index) => (
                <TestimonialCard key={`row3-${index}`} testimonial={testimonial} index={index} />
              ))}
            </motion.div>
          </div>
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-green-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-yellow-50 to-transparent pointer-events-none" />
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4"
        >
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "1000+", label: "Properties Sold" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "50+", label: "Industry Awards" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 1 + index * 0.1,
                  type: "spring",
                  stiffness: 200 
                }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}