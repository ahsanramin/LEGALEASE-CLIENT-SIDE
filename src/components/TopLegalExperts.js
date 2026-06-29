"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function TopLegalExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/lawyers/top')
      .then(res => setExperts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const SkeletonCard = () => (
    <div className="flex flex-col items-center bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/60 dark:border-gray-800/60 animate-pulse">
      <div className="h-28 w-28 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-4"></div>
      <div className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
    </div>
  );

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent dark:from-indigo-500/10 dark:via-purple-500/10 rounded-4xl p-6 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
          >
            Top Legal Experts
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            The most sought-after lawyers on our platform, trusted by hundreds of clients for exceptional legal service.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : experts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No top experts available at the moment.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          >
            {experts.map((expert, index) => (
              <motion.div
                key={expert._id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative flex flex-col items-center p-8 bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-gray-900/40 transition-all duration-300 border border-gray-200/60 dark:border-gray-800/60 group"
              >
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border-2 border-white dark:border-[#0f1115] tracking-wide z-10">
                  #{index + 1}
                </div>
                
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <img
                    src={expert.image || 'https://ui-avatars.com/api/?name=Expert&background=random&size=200'}
                    alt={expert.name}
                    className="relative h-28 w-28 rounded-full object-cover border-4 border-white dark:border-[#0f1115] shadow-lg group-hover:border-indigo-400 transition-colors"
                  />
                </div>

                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">{expert.name}</h4>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1 text-center">{expert.specialization}</p>
                
                <div className="w-full mt-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {expert.bio ? expert.bio.substring(0, 80) + (expert.bio.length > 80 ? '...' : '') : 'Experienced legal professional.'}
                  </p>
                </div>

                <div className="w-full mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${expert.isBusy ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {expert.isBusy ? 'Busy' : 'Available'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(expert.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="w-full mt-4 flex items-center justify-between pt-4 border-t border-gray-200/70 dark:border-gray-700/70">
                  <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-bold text-lg">
                    <DollarSign size={16} />
                    <span>{expert.fee} <span className="text-xs font-normal text-gray-400">/hr</span></span>
                  </div>
                  <Link
                    href={`/lawyer/${expert._id}`}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20"
                  >
                    Hire Now
                  </Link>
                </div>

                <div className="w-full mt-3 flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Users size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium text-indigo-700 dark:text-indigo-400">{expert.hireCount || 0} Hires</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}