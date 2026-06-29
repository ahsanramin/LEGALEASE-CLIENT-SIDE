"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Camera, MapPin, Briefcase, DollarSign, Pencil, CheckCircle2, XCircle, User, FileText, CloudUpload, Eye, Calendar } from 'lucide-react';

export default function ManageLegalProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    specialization: '',
    fee: '',
    image: '',
    experience: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get('/lawyers/me/profile')
      .then(res => {
        setProfile(res.data);
        setForm({
          name: res.data.name || '',
          bio: res.data.bio || '',
          specialization: res.data.specialization || '',
          fee: res.data.fee || '',
          image: res.data.image || '',
          experience: res.data.experience || '',
          location: res.data.location || ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getProfileStrength = () => {
    let score = 0;
    if (form.image) score += 20;
    if (form.name && form.name.length > 2) score += 10;
    if (form.specialization && form.specialization.length > 2) score += 15;
    if (form.bio && form.bio.length > 30) score += 20;
    if (form.fee && parseFloat(form.fee) > 0) score += 15;
    if (form.experience && parseFloat(form.experience) > 0) score += 10;
    if (form.location && form.location.length > 2) score += 10;
    return Math.min(100, score);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axios.post('/upload', data);
      setForm({ ...form, image: res.data.url });
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profile) {
        await axios.put(`/lawyers/${profile._id}`, form);
        toast.success('Profile updated successfully');
      } else {
        const res = await axios.post('/lawyers', { ...form, stripePaymentId: 'paid' });
        setProfile(res.data);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      if (!profile) {
        toast.error('Please save your profile first');
        return;
      }
      if (!profile.isPublished) {
        router.push(`/payment?amount=10000&purpose=publishing&lawyerId=${profile._id}`);
        return;
      }
      await axios.patch(`/lawyers/${profile._id}/status`, { isPublished: !profile.isPublished });
      setProfile({ ...profile, isPublished: !profile.isPublished });
      toast.success(profile.isPublished ? 'Profile unpublished' : 'Profile published');
    } catch (error) {
      toast.error('Failed to toggle publish status');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );

  const strength = getProfileStrength();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/70 dark:border-gray-800/70 pb-6"
      >
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Manage Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Update your professional details and manage your public presence.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit shadow-sm border ${
            profile?.isPublished 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}>
            {profile?.isPublished ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {profile?.isPublished ? 'Published' : 'Unpublished'}
          </span>
          <button
            onClick={handlePublishToggle}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg flex items-center gap-2 ${
              profile?.isPublished 
                ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'
            }`}
          >
            {profile?.isPublished ? 'Unpublish' : 'Publish Profile ($10,000)'}
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl border border-gray-100/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl dark:shadow-gray-900/40 hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <img 
                  src={form.image || 'https://ui-avatars.com/api/?name=Lawyer&background=indigo&size=200&color=fff'} 
                  alt="Profile" 
                  className="relative h-32 w-32 rounded-full object-cover border-4 border-white dark:border-[#1a1c23] shadow-xl"
                />
                <label 
                  htmlFor="image-upload" 
                  className="absolute bottom-1 right-1 bg-white dark:bg-[#1a1c23] p-2.5 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-lg group-hover:scale-110 z-20"
                >
                  <Camera size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {uploading && <p className="text-xs text-indigo-600 animate-pulse -mt-2 mb-2">Uploading...</p>}
              
              <div className="w-full space-y-3 mt-2">
                <div className="flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-100/70 dark:bg-[#0f1115]/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 w-full text-sm backdrop-blur-sm shadow-sm">
                  <Briefcase size={16} className="text-indigo-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{form.experience || '0'} Years</span>
                </div>
                <div className="flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-100/70 dark:bg-[#0f1115]/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 w-full text-sm backdrop-blur-sm shadow-sm">
                  <MapPin size={16} className="text-indigo-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{form.location || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-[#1a1c23]/50 backdrop-blur-sm border border-gray-100/30 dark:border-gray-700/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Profile Strength</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{strength}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
              >
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/30 blur-md"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-sm border border-gray-100/70 dark:border-gray-700/70 rounded-3xl shadow-2xl dark:shadow-gray-900/40 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8 relative z-10">
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Basic Info</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Specialization</label>
                    <input
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder="e.g. Corporate Law"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Professional Summary</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm resize-none min-h-[130px]"
                      placeholder="Write a brief description about your expertise..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                    <FileText size={20} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Professional Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <DollarSign size={16} className="text-gray-400" /> Fee ($)
                    </label>
                    <input
                      type="number"
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder="e.g. 200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Briefcase size={16} className="text-gray-400" /> Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <MapPin size={16} className="text-gray-400" /> Location
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-sm border border-gray-100/70 dark:border-gray-700/70 rounded-3xl shadow-2xl dark:shadow-gray-900/40 overflow-hidden p-8">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60"></div>
            
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                <Eye size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Publish Status</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f1115]/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  profile?.isPublished 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {profile?.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f1115]/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Calendar size={14} /> {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <button 
                  onClick={() => router.push(`/lawyer/${profile?._id}`)}
                  className="w-full py-3.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-2xl font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Preview Live Profile
                </button>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CloudUpload size={18} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}