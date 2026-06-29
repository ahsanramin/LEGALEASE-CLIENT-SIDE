"use client";
import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
        >
          Contact Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 mb-4 max-w-2xl mx-auto"
        >
          Have questions or want to partner with us? Our support team is just a message away.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-white dark:bg-[#1a1c23] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <form className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Write your message here..."
                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-h-[130px] resize-none"
                rows={4}
              />
            </div>
            <button
              type="button"
              className="w-full py-3.5 bg-indigo-600 text-white font-bold text-base rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/20 mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}