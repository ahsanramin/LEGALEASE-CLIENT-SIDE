"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, MessageSquare, MapPin, Briefcase, User, CheckCircle2, Star, ArrowRight } from 'lucide-react';

export default function LawyerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLawyerDetails();
      fetchComments();
    }
  }, [id]);

  const fetchLawyerDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/lawyers/${id}`);
      setLawyer(res.data);
    } catch (error) {
      toast.error('Failed to load lawyer details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/lawyer/${id}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments');
    }
  };

  const handleHire = async () => {
    if (!user) {
      toast.error('Please login to hire a lawyer');
      router.push('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only clients can hire lawyers');
      return;
    }
    setIsHiring(true);
    try {
      const res = await axios.post('/hiring', {
        lawyerId: id,
        amount: lawyer.fee
      });
      toast.success('Hiring request sent successfully!');
      setShowModal(false);
      router.push('/dashboard/user/hiring-history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsHiring(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      router.push('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only clients can comment');
      return;
    }
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    setIsPostingComment(true);
    try {
      await axios.post('/comments', { lawyerId: id, content: commentContent });
      toast.success('Comment posted successfully');
      setCommentContent('');
      fetchComments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  if (loading) return <div className="pt-24 px-4 max-w-5xl mx-auto pb-12"><LoadingSkeleton type="details" /></div>;
  if (!lawyer) return <div className="pt-24 px-4 max-w-5xl mx-auto pb-12 text-center text-gray-500">Lawyer not found</div>;

  const stats = [
    { label: 'Joined', value: new Date(lawyer.createdAt).toLocaleDateString(), icon: Calendar },
    { label: 'Fee', value: `$${lawyer.fee}/hr`, icon: DollarSign },
    { label: 'Experience', value: lawyer.experience ? `${lawyer.experience} Years` : 'N/A', icon: Briefcase },
    { label: 'Location', value: lawyer.location || 'N/A', icon: MapPin },
  ];

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto pb-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-2xl dark:shadow-gray-900/40 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
          <div className="md:col-span-1 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-70"></div>
              <img
                src={lawyer.image || 'https://ui-avatars.com/api/?name=Lawyer&background=indigo&size=512&color=fff'}
                alt={lawyer.name}
                className="relative h-40 w-40 rounded-full object-cover border-4 border-white dark:border-[#1a1c23] shadow-xl"
              />
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm border ${
                  lawyer.isBusy 
                    ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800' 
                    : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${lawyer.isBusy ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  {lawyer.isBusy ? 'Busy' : 'Available'}
                </span>
              </div>
              <button 
                onClick={() => setShowModal(true)} 
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                Hire Now <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100">{lawyer.name}</h1>
              <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mt-1">{lawyer.specialization}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50/50 dark:bg-[#0f1115]/50 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-medium">
                    <stat.icon size={14} className="text-indigo-500" />
                    {stat.label}
                  </div>
                  <p className="text-base font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-2">Professional Summary</h4>
              <p>{lawyer.bio}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8"
      >
        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <MessageSquare size={22} className="text-indigo-600" /> Client Reviews & Comments
        </h4>
        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center py-4">No comments yet. Be the first to share your experience!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50/70 dark:bg-[#0f1115]/70 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <img src={comment.userId?.profilePic || 'https://ui-avatars.com/api/?name=User&background=random'} alt="User" className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{comment.userId?.name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handlePostComment} className="flex flex-col sm:flex-row gap-3 mt-2">
          <input 
            type="text" 
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
            placeholder={user ? "Share your experience..." : "Login to comment..."} 
            disabled={!user}
            className="flex-1 px-4 py-3 bg-gray-50/60 dark:bg-[#0f1115]/60 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1c23] focus:border-transparent transition-all text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!user || isPostingComment}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPostingComment ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <><MessageSquare size={18} /> Post Comment</>
            )}
          </button>
        </form>
        {!user && (
          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1"><User size={12} /> Please login to post a comment.</p>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-indigo-100">
                  <img src={lawyer.image || 'https://ui-avatars.com/api/?name=Lawyer'} alt={lawyer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Confirm Hiring</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">You are about to hire <span className="font-medium text-indigo-600">{lawyer.name}</span></p>
                </div>
              </div>
              <div className="bg-gray-50/80 dark:bg-[#0f1115]/80 rounded-2xl p-4 space-y-3 mb-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Specialization:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{lawyer.specialization}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Consultation Fee:</span>
                  <span className="font-bold text-indigo-600 text-lg">${lawyer.fee}</span>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleHire} 
                  disabled={isHiring}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isHiring ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <><CheckCircle2 size={18} /> Confirm Hire</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}