"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShortlistToggle({ lawyerId }) {
  const { user } = useAuth();
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios.get(`/users/shortlist/check/${lawyerId}`)
      .then(res => setIsShortlisted(res.data.isShortlisted))
      .catch(() => {});
  }, [user, lawyerId]);

  const toggleShortlist = async () => {
    if (!user) {
      toast.error('Please login to shortlist');
      return;
    }
    setLoading(true);
    try {
      if (isShortlisted) {
        await axios.delete(`/users/shortlist/${lawyerId}`);
        toast.success('Removed from shortlist');
      } else {
        await axios.post(`/users/shortlist/${lawyerId}`);
        toast.success('Added to shortlist');
      }
      setIsShortlisted(!isShortlisted);
    } catch (error) {
      toast.error('Failed to update shortlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleShortlist}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <Heart
        size={20}
        className={isShortlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
    </button>
  );
}