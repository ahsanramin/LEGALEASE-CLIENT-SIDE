"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Pencil, X, Check, MessageSquare, Calendar, Loader2 } from 'lucide-react';

export default function UserComments() {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/comments/user');
      setComments(res.data);
    } catch (error) {
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/comments/${id}`);
      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (id) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      await axios.put(`/comments/${id}`, { content: editContent });
      toast.success('Comment updated successfully');
      setEditingId(null);
      setIsModalOpen(false);
      fetchComments();
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1c23] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
          ))}
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
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">My Comments</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your reviews and feedback on lawyers.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0f1115] px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <MessageSquare size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {comments.length} Comments
          </span>
        </div>
      </motion.div>

      {comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-[#1a1c23]/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-12 text-center shadow-lg"
        >
          <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No comments yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">When you comment on a lawyer's profile, they will appear here.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              variants={itemVariants}
              className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-md border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{comment.lawyerId?.name || 'Unknown Lawyer'}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar size={14} /> {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => { setEditingId(comment._id); setEditContent(comment.content); setIsModalOpen(true); }}
                    className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-105"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    disabled={deletingId === comment._id}
                    className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === comment._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Pencil size={24} className="text-indigo-600" /> Edit Comment
              </h3>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-4 bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 min-h-[120px] resize-none outline-none"
                placeholder="Update your comment..."
                rows={4}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                  className="px-5 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEdit(editingId)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                >
                  <Check size={18} /> Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}