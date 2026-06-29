"use client";
import { motion } from 'framer-motion';

export default function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Clients' },
    { value: '500+', label: 'Expert Lawyers' },
    { value: '5K+', label: 'Successful Cases' },
    { value: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-3xl text-white text-center shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Our Impact in Numbers</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <h4 className="text-5xl font-extrabold">{stat.value}</h4>
              <p className="text-white/80 text-lg mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}