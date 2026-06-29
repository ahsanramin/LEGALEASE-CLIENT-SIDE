"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Check, X, Clock, CheckCircle2, XCircle, User, Calendar, DollarSign, FileText, Inbox } from 'lucide-react';

export default function LawyerHiringHistory() {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0 });

  useEffect(() => {
    fetchHires();
  }, []);

  const fetchHires = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/hiring/lawyer');
      setHires(res.data);
      setNotFound(false);
      
      // ক্যালকুলেট স্ট্যাটিস্টিক্স
      const pending = res.data.filter(h => h.status === 'pending').length;
      const accepted = res.data.filter(h => h.status === 'accepted').length;
      const rejected = res.data.filter(h => h.status === 'rejected').length;
      setStats({ pending, accepted, rejected });
      
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch requests');
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`/hiring/${id}`, { status });
      toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      fetchHires();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  // লোডিং স্কেলেটন ডিজাইন
  const SkeletonRow = () => (
    <div className="animate-pulse flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
        ))}
      </div>
      <div className="bg-white dark:bg-[#1a1c23] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
      </div>
    </div>
  );

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1a1c23] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
        <FileText size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Profile Not Found</h3>
        <p className="text-gray-500 mt-2 text-sm">
          Please go to <span className="text-indigo-600 font-medium hover:underline cursor-pointer" onClick={() => window.location.href='/dashboard/lawyer/manage-legal-profile'}>Manage Profile</span> and save your profile first.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
      accepted: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
      rejected: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statsCards = [
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/70 dark:border-gray-800/70 pb-6"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Hiring Requests</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage incoming hiring requests from clients.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0f1115] px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <User size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {hires.length} Total Requests
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statsCards.map((stat, index) => (
          <div key={stat.label} className={`bg-white dark:bg-[#1a1c23] rounded-2xl shadow-md border ${stat.color} p-5 flex items-center gap-4`}>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#1a1c23] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-[#0f1115]/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {hires.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium">No hiring requests yet</p>
                      <p className="text-xs">When clients hire you, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                hires.map((hire) => (
                  <tr key={hire._id} className="group hover:bg-gray-50/50 dark:hover:bg-[#0f1115]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{hire.userId?.name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(hire.hiringDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                        <DollarSign size={14} />
                        {hire.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(hire.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {hire.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatus(hire._id, 'accepted')} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors text-xs font-medium shadow-sm"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button 
                            onClick={() => handleStatus(hire._id, 'rejected')} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-xs font-medium shadow-sm"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {hire.status.charAt(0).toUpperCase() + hire.status.slice(1)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}