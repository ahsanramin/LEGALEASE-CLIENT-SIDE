"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, DollarSign, Calendar, CheckCircle, UserCog, FileText, ArrowRight, Activity, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get('/admin/analytics'),
          axios.get('/admin/users')
        ]);
        setStats(analyticsRes.data);
        setRecentUsers(usersRes.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
            <div className="h-32 bg-gray-100 dark:bg-[#1a1c23] rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Manage Users', icon: UserCog, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', href: '/dashboard/admin/manage-users' },
    { label: 'All Transactions', icon: FileText, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', href: '/dashboard/admin/all-transactions' },
    { label: 'View Analytics', icon: TrendingUp, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', href: '/dashboard/admin/analytics' },
  ];

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
              Good to see you, {user?.name || 'Admin'}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-indigo-500" /> 
              {getFormattedDate()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle size={16} />
              System Online
            </span>
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
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Total Lawyers', value: stats.totalLawyers, icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
          { label: 'Total Hires', value: stats.totalHires, icon: TrendingUp, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
          { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' }
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
              <Users size={20} className="text-indigo-600" /> Recent Users
            </h3>
            <button onClick={() => router.push('/dashboard/admin/manage-users')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="p-6">
            {recentUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                <Users size={40} className="text-gray-300 dark:text-gray-600" />
                <p className="font-medium">No users registered yet</p>
                <p className="text-sm">Users will appear here as they join the platform.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u._id} className="group flex items-center justify-between p-3.5 bg-gray-50/60 dark:bg-[#0f1115]/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-[#1a1c23] transition-all">
                    <div className="flex items-center gap-3">
                      <img src={u.profilePic || 'https://ui-avatars.com/api/?name=User&background=indigo&color=fff'} alt={u.name} className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {u.role}
                    </span>
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
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(action.href)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/70 dark:bg-[#0f1115]/70 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1a1c23] transition-colors border border-gray-200/50 dark:border-gray-700/50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon size={18} />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Activity size={16} /> System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50/60 dark:bg-[#0f1115]/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Platform Health</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={14} /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50/60 dark:bg-[#0f1115]/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Services</span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">100%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50/60 dark:bg-[#0f1115]/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reported Issues</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={14} /> 0
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}