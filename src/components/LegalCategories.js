"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LegalCategories() {
  const router = useRouter();

  const categories = [
    {
      name: 'Criminal',
      desc: 'Defend your rights & criminal litigation',
      icon: (
        <svg className="w-9 h-9 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      name: 'Corporate',
      desc: 'Business, mergers & commercial law',
      icon: (
        <svg className="w-9 h-9 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Family',
      desc: 'Marriage, divorce & child custody',
      icon: (
        <svg className="w-9 h-9 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Real Estate',
      desc: 'Property, land & housing disputes',
      icon: (
        <svg className="w-9 h-9 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Immigration',
      desc: 'Visas, residency & citizenship law',
      icon: (
        <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
        </svg>
      )
    },
    {
      name: 'Employment',
      desc: 'Workplace rights, contracts & labor',
      icon: (
        <svg className="w-9 h-9 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
        >
          Legal Categories
        </motion.h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Explore specialized legal areas. Click on any category to instantly filter and find the right lawyer for your needs.
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => router.push(`/browse-lawyers?search=${cat.name}`)}
            className="relative group bg-white dark:bg-[#1a1c23] rounded-2xl p-8 shadow-lg hover:shadow-2xl dark:shadow-gray-900/40 transition-all duration-300 border border-gray-200 dark:border-gray-800 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-50 dark:bg-[#0f1115] rounded-2xl group-hover:bg-white dark:group-hover:bg-[#1a1c23] transition-colors shadow-inner">
                {cat.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-2">{cat.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{cat.desc}</p>
              <span className="mt-4 text-indigo-600 text-sm font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse <span className="text-lg leading-none">→</span>
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}