"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, Briefcase, Clock, CheckCircle, Calendar, DollarSign, FileText, Pencil, MessageSquare, ArrowRight, User, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHires: 0,
    paidHires: 0,
    pendingPayments: 0,
    totalSpent: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/hiring/user');
        const data = res.data;
        setHires(data);

        const totalHires = data.length;
        const paidHires = data.filter(h => h.paymentStatus === 'paid').length;
        const pendingPayments = data.filter(h => h.paymentStatus === 'unpaid' && h.status === 'accepted').length;
        const totalSpent = data.filter(h => h.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

        setStats({ totalHires, paidHires, pendingPayments, totalSpent });
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  const cardVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>)}
        </div>
        <div className="h-80 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl border border-gray-100/50 dark:border-gray-700/50 rounded-3xl p-6 md:p-8 shadow-2xl dark:shadow-gray-900/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-indigo-500" /> 
              {getFormattedDate()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium flex items-center gap-2 border border-indigo-200 dark:border-indigo-800">
              <CheckCircle size={16} />
              Active
            </span>
            <button 
              onClick={() => router.push('/dashboard/user/update-profile')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 font-medium text-sm flex items-center gap-2"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Hires', value: stats.totalHires, icon: Briefcase, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Paid', value: stats.paidHires, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
          { label: 'Pending Payments', value: stats.pendingPayments, icon: Clock, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
          { label: 'Total Spent', value: `$${stats.totalSpent}`, icon: DollarSign, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`bg-white/70 dark:bg-[#1a1c23]/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${stat.color}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" /> Recent Activity
            </h3>
            <button onClick={() => router.push('/dashboard/user/hiring-history')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="p-6">
            {hires.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                <Inbox size={40} className="text-gray-300 dark:text-gray-600" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm">Start browsing lawyers and make your first hire.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hires.slice(0, 5).map((hire) => (
                  <div key={hire._id} className="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#0f1115]/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-[#1a1c23] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">Hired {hire.lawyerId?.name || 'a lawyer'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(hire.hiringDate).toLocaleDateString()} • <DollarSign size={12} /> {hire.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        hire.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                      }`}>
                        {hire.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      {hire.paymentStatus !== 'paid' && hire.status === 'accepted' && (
                        <button onClick={() => router.push('/dashboard/user/hiring-history')} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button onClick={() => router.push('/dashboard/user/hiring-history')} className="w-full flex items-center justify-between p-4 bg-gray-50/70 dark:bg-[#0f1115]/70 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1a1c23] transition-colors border border-gray-200/50 dark:border-gray-700/50 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">View Hiring History</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </button>
              <button onClick={() => router.push('/dashboard/user/update-profile')} className="w-full flex items-center justify-between p-4 bg-gray-50/70 dark:bg-[#0f1115]/70 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1a1c23] transition-colors border border-gray-200/50 dark:border-gray-700/50 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Update Profile</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </button>
              <button onClick={() => router.push('/dashboard/user/comments')} className="w-full flex items-center justify-between p-4 bg-gray-50/70 dark:bg-[#0f1115]/70 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1a1c23] transition-colors border border-gray-200/50 dark:border-gray-700/50 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MessageSquare size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Manage Comments</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <CheckCircle size={16} /> Profile Completion
            </h3>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (user?.profilePic ? 50 : 0) + (user?.name ? 50 : 0))}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-md"></div>
              </motion.div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Complete your profile to get better matches.
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {Math.min(100, (user?.profilePic ? 50 : 0) + (user?.name ? 50 : 0))}%
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}