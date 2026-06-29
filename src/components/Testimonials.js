"use client";
import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Ahmed',
      role: 'Corporate Lawyer',
      text: '"LegalEase helped me find a top corporate lawyer in just 24 hours. The process was seamless and incredibly fast."',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&background=random&size=100'
    },
    {
      name: 'John Doe',
      role: 'Family Advocate',
      text: '"As a family lawyer, I’ve never seen a platform this efficient. My clients love the transparency and ease of use."',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random&size=100'
    },
    {
      name: 'Emily Chen',
      role: 'Real Estate Expert',
      text: '"I found my perfect real estate lawyer through LegalEase. The secure payment system gave me peace of mind."',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random&size=100'
    }
  ];

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
        >
          Client Testimonials
        </motion.h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Hear from our satisfied clients who found their perfect legal match.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white dark:bg-[#1a1c23] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={item.avatar} alt={item.name} className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900/30" />
              <div>
                <h5 className="font-bold text-lg">{item.name}</h5>
                <p className="text-xs text-indigo-600 font-medium">{item.role}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}