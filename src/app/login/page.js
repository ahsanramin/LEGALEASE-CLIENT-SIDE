"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 dark:from-[#0f1115] dark:via-[#1e1b4b] dark:to-[#0f1115] relative px-4 py-8 overflow-hidden">
      <Link 
        href="/" 
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 text-sm font-medium text-gray-100 hover:text-white dark:text-gray-400 dark:hover:text-indigo-400 transition-colors bg-black/30 dark:bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
      >
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <img 
            src="https://cdn.vectorstock.com/i/1000v/20/56/justice-and-law-logo-icon-vector-29552056.jpg" 
            alt="LegalEase Logo" 
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900/50" 
          />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Login to LegalEase</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" 
            required 
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">Login</button>
        </form>
        <div className="my-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <GoogleLoginButton onSuccess={googleLogin} />
        <p className="mt-4 text-center text-sm text-gray-500">Don't have an account? <Link href="/register" className="text-indigo-600 hover:underline">Register</Link></p>
      </motion.div>
    </div>
  );
}