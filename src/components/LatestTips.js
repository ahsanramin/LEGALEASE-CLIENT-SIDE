"use client";
import { motion } from 'framer-motion';

export default function LatestTips() {
  const tips = [
    { title: 'New Corporate Laws 2026', desc: 'A brief overview of the latest updates in corporate law and how they affect businesses.' },
    { title: 'Family Mediation Guide', desc: 'Understanding the mediation process and how it can resolve family disputes amicably.' },
    { title: 'Top 5 Criminal Defense Tactics', desc: 'Essential strategies every criminal defense lawyer should know in 2026.' }
  ];

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 rounded-3xl text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Latest Legal Tips & Articles
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/80 max-w-2xl mx-auto mb-10"
        >
          Stay informed with our curated legal insights and expert advice.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-colors border border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">{index + 1}</span>
                <h4 className="font-bold text-lg">{tip.title}</h4>
              </div>
              <p className="text-sm text-white/80">{tip.desc}</p>
              <span className="text-xs block mt-4 font-semibold underline underline-offset-4 cursor-pointer hover:opacity-80">Read more →</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}