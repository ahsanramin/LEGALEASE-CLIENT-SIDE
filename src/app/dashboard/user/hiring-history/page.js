"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, DollarSign, FileText, XCircle, Calendar, Inbox } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserHiringHistory() {
  const { user } = useAuth();
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [stats, setStats] = useState({
    totalHires: 0,
    paidHires: 0,
    unpaidHires: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchHires();
  }, []);

  const fetchHires = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/hiring/user');
      const data = res.data;
      setHires(data);

      const totalHires = data.length;
      const paidHires = data.filter(h => h.paymentStatus === 'paid').length;
      const unpaidHires = data.filter(h => h.paymentStatus === 'unpaid' && h.status === 'accepted').length;
      const totalSpent = data.filter(h => h.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

      setStats({ totalHires, paidHires, unpaidHires, totalSpent });
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (hiringId, lawyerFee, lawyerId) => {
    router.push(`/payment?amount=${lawyerFee}&purpose=hiring&hiringId=${hiringId}&lawyerId=${lawyerId}`);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const getHiringStatus = (status) => {
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

  const getPaymentStatus = (status) => {
    return status === 'paid' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
        <CheckCircle2 size={14} /> Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
        Unpaid
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>)}
        </div>
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            ))}
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
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/70 dark:border-gray-800/70 pb-6"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Hiring History</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Track your hiring requests and payments.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0f1115] px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <FileText size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {hires.length} Total Hires
          </span>
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
          { label: 'Paid', value: stats.paidHires, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
          { label: 'Pending Payments', value: stats.unpaidHires, icon: Clock, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#1a1c23] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-[#0f1115]/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lawyer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hiring Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {hires.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium">No hiring history found</p>
                      <p className="text-xs">Start browsing lawyers and hire your first professional.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                hires.map((hire) => (
                  <tr key={hire._id} className="group hover:bg-gray-50/50 dark:hover:bg-[#0f1115]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{hire.lawyerId?.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{hire.lawyerId?.specialization}</td>
                    <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-bold">${hire.amount}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(hire.hiringDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getHiringStatus(hire.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentStatus(hire.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {hire.paymentStatus === 'paid' ? (
                        <button 
                          disabled 
                          className="px-4 py-2 bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 rounded-lg cursor-not-allowed font-medium text-sm"
                        >
                          Paid
                        </button>
                      ) : hire.status === 'accepted' ? (
                        <button 
                          onClick={() => handlePay(hire._id, hire.amount, hire.lawyerId._id)} 
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20 font-medium text-sm flex items-center gap-2 mx-auto w-fit"
                        >
                          <DollarSign size={16} /> Pay Now
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Awaiting Acceptance
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