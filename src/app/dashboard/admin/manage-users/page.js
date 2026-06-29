"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Shield, User, Search, X, AlertCircle, Loader2, Users } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const roles = ['user', 'lawyer', 'admin'];
    const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
    if (!confirm(`Change role from "${currentRole}" to "${nextRole}"?`)) return;
    try {
      await axios.put(`/admin/users/${id}/role`, { role: nextRole });
      toast.success(`Role changed to ${nextRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeletingId(userToDelete);
    setIsDeleteModalOpen(false);
    try {
      await axios.delete(`/admin/users/${userToDelete}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100/50 dark:border-gray-700/50 last:border-0 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex gap-3">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden p-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
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
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Manage Users</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Oversee platform users, assign roles, and manage accounts.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0f1115] px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{users.length} Total</span>
        </div>
      </motion.div>

      <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60"></div>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-[#0f1115]/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="font-medium">No users found</p>
                      <p className="text-xs">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-[#0f1115]/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img 
                        src={u.profilePic || 'https://ui-avatars.com/api/?name=User&background=indigo&color=fff'} 
                        alt={u.name} 
                        className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{u.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' :
                        u.role === 'lawyer' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        <Shield size={12} />
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleRoleChange(u._id, u.role)} 
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all hover:scale-105"
                        title="Change Role"
                      >
                        <User size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u._id)} 
                        disabled={deletingId === u._id}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete User"
                      >
                        {deletingId === u._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                <AlertCircle size={32} />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Delete User</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this user? This action cannot be undone and will permanently remove all associated data.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-500/20 flex items-center gap-2"
                >
                  <Trash2 size={18} /> Delete User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}