"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const { register, googleLogin } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await register(formData);
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create an Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" required />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">I want to register as:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="accent-indigo-600" />
                <span>Client</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="lawyer" checked={formData.role === 'lawyer'} onChange={handleChange} className="accent-indigo-600" />
                <span>Lawyer</span>
              </label>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">Register</button>
        </form>
        <div className="my-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <GoogleLoginButton onSuccess={googleLogin} />
        <p className="mt-4 text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Login</Link></p>
      </motion.div>
    </div>
  );
}