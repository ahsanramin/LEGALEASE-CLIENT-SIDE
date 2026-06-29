"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, CreditCard, DollarSign, Briefcase, TrendingUp, FileText, XCircle } from 'lucide-react';

export default function AllTransactions() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    publishingCount: 0,
    hiringCount: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/transactions');
      const data = res.data;
      setTxns(data);

      const totalRevenue = data.reduce((acc, curr) => acc + curr.amount, 0);
      const publishingCount = data.filter(t => t.type === 'publishing').length;
      const hiringCount = data.filter(t => t.type === 'hiring').length;

      setStats({
        totalTransactions: data.length,
        totalRevenue,
        publishingCount,
        hiringCount
      });
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTxns = txns.filter(t => 
    t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100/50 dark:border-gray-700/50 last:border-0 animate-pulse">
      <div className="space-y-2 w-1/4">
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>)}
        </div>
        <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden p-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse ml-auto"></div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">All Transactions</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Monitor financial activity across the platform.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0f1115] px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <CreditCard size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.totalTransactions} Transactions</span>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
          { label: 'Publishing Fees', value: stats.publishingCount, icon: FileText, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
          { label: 'Hiring Fees', value: stats.hiringCount, icon: Briefcase, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Avg. Transaction', value: `$${stats.totalTransactions > 0 ? (stats.totalRevenue / stats.totalTransactions).toFixed(2) : '0.00'}`, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' }
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

      <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or Email..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-[#0f1115]/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lawyer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <XCircle size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="font-medium">No transactions found</p>
                      <p className="text-xs">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t, index) => (
                  <motion.tr
                    key={t._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-[#0f1115]/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {t.transactionId ? t.transactionId.substring(0, 14) + '...' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{t.userId?.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.lawyerId?.name || 'System'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        t.type === 'publishing' 
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      }`}>
                        {t.type === 'publishing' ? <FileText size={12} /> : <Briefcase size={12} />}
                        {t.type === 'publishing' ? 'Publishing Fee' : 'Hiring Fee'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-bold">${t.amount}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}