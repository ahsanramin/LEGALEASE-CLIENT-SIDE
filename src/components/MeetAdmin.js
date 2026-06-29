"use client";
import { motion } from 'framer-motion';

export default function MeetAdmin() {
  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white dark:bg-[#1a1c23] p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative z-10"
        >
          <img
            src="https://i.ibb.co.com/nM76705K/655b9bd17d3d.jpg"
            alt="Ahsan Labib Ramin"
            className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl border-4 border-indigo-100 dark:border-indigo-900/30 object-cover aspect-square"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
            Meet the Admin
          </h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">Ahsan Labib Ramin</p>
          <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            With over 10 years of experience in legal tech, Ahsan is passionate about bridging the gap between clients and top legal talent. LegalEase is his vision to democratize access to justice worldwide.
          </p>
          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}