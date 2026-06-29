"use client";
import { motion } from 'framer-motion';

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-medium animate-pulse">Loading LegalEase...</p>
      </div>
    </div>
  );
}