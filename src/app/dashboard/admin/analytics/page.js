"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  
  const chartData = [
    { name: 'Jan', hires: 4 }, { name: 'Feb', hires: 8 }, { name: 'Mar', hires: 12 },
    { name: 'Apr', hires: 15 }, { name: 'May', hires: 20 }, { name: 'Jun', hires: 24 }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/admin/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
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
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-indigo-500" /> 
              {getFormattedDate()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium flex items-center gap-2 border border-indigo-200 dark:border-indigo-800">
              <TrendingUp size={16} />
              Real-time Data
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
          { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Total Lawyers', value: data.totalLawyers, icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
          { label: 'Total Hires', value: data.totalHires, icon: TrendingUp, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
          { label: 'Total Revenue', value: `$${data.totalRevenue}`, icon: DollarSign, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' }
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
            <div className="absolute right-4 top-4 opacity-20">
              <ArrowUpRight size={24} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" /> Monthly Hiring Trend
          </h3>
          <div className="w-full min-h-[320px] h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-stroke)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--chart-tick-color)' }} />
                <YAxis tick={{ fill: 'var(--chart-tick-color)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--chart-grid-stroke)', 
                    color: 'var(--foreground)',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }} 
                  cursor={{ stroke: 'var(--chart-grid-stroke)', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hires" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  fill="url(#colorHires)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}