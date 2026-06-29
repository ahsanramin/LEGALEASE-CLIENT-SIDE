"use client";
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Browse & Discover',
      desc: 'Search for lawyers based on specialization, location, or ratings.',
      icon: (
        <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: 'Hire & Pay Securely',
      desc: 'Request to hire and pay through our secure Stripe-integrated system.',
      icon: (
        <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Consult & Review',
      desc: 'Get legal advice and rate your experience to help the community.',
      icon: (
        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
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
          How LegalEase Works
        </motion.h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Three simple steps to connect with the best legal professionals.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="flex flex-col items-center p-8 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-6">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-center">{step.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">{step.desc}</p>
            <span className="mt-6 text-indigo-600 text-sm font-semibold flex items-center gap-2">
              Step {index + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}