"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Camera, User, Pencil, CloudUpload, CheckCircle2 } from 'lucide-react';

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfilePic(res.data.url);
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch('/users/profile', { name, profilePic });
      setUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Update Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Keep your personal information up to date.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-2xl dark:shadow-gray-900/40 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 relative z-10">
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src={profilePic || 'https://ui-avatars.com/api/?name=User&background=indigo&size=200&color=fff'} 
                alt="Profile" 
                className="relative h-32 w-32 rounded-full object-cover border-4 border-white dark:border-[#1a1c23] shadow-xl"
              />
              <label 
                htmlFor="image-upload" 
                className="absolute bottom-1 right-1 bg-white dark:bg-[#1a1c23] p-2.5 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-lg group-hover:scale-110 z-20"
              >
                <Camera size={20} className="text-indigo-600 dark:text-indigo-400" />
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {uploading && <p className="text-xs text-indigo-600 animate-pulse">Uploading...</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400">Click the camera icon to upload a new photo</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User size={18} className="text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CloudUpload size={18} /> Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}