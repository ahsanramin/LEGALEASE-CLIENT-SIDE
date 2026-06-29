"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Briefcase, ArrowRight } from 'lucide-react';

export default function LawyerCard({ lawyer }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100/70 dark:border-gray-800/60 bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/40 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-white/90 dark:hover:bg-[#1a1c23]/90"
    >
      <Link href={`/lawyer/${lawyer._id}`} className="flex flex-col h-full relative z-10">
        <div className="relative w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={lawyer.image || 'https://ui-avatars.com/api/?name=Lawyer&background=random&size=400'}
            alt={lawyer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className={`w-1.5 h-1.5 rounded-full ${lawyer.isBusy ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className={`${lawyer.isBusy ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {lawyer.isBusy ? 'Busy' : 'Available'}
            </span>
          </div>
          
          {lawyer.location && (
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
              <MapPin size={12} />
              <span className="truncate max-w-[80px]">{lawyer.location}</span>
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate max-w-[70%]">{lawyer.name}</h3>
            {lawyer.experience && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full border border-indigo-200/30 dark:border-indigo-800/30">
                <Briefcase size={12} />
                {lawyer.experience} Yrs
              </span>
            )}
          </div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{lawyer.specialization}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 flex-grow h-8">
            {lawyer.bio ? lawyer.bio.substring(0, 100) + (lawyer.bio.length > 100 ? '...' : '') : 'Experienced legal professional.'}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-bold text-lg">
              <DollarSign size={16} />
              <span>{lawyer.fee} <span className="text-xs font-normal text-gray-400">/hr</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              {lawyer.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(lawyer.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 w-full">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-center border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 group-hover:shadow-md">
              Hire Now
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}