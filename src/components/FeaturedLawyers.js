"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import LawyerCard from './LawyerCard';
import { motion } from 'framer-motion';

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/lawyers/featured')
      .then(res => setLawyers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
        >
          Featured Lawyers
        </motion.h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Meet our top-rated legal experts, handpicked to assist you with your most critical needs.
        </motion.p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-[#1a1c23] rounded-2xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden h-[420px]">
              <div className="h-56 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : lawyers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-[#1a1c23] rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">No featured lawyers available right now.</h3>
          <p className="text-gray-400 mt-2">Please check back later.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {lawyers.map((lawyer) => (
            <motion.div key={lawyer._id} variants={itemVariants}>
              <LawyerCard lawyer={lawyer} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}