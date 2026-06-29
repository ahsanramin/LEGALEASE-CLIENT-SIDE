"use client";
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import LawyerCard from '@/components/LawyerCard';
import toast from 'react-hot-toast';

export default function ShortlistPage() {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axios.get('/users/shortlist')
      .then(res => setLawyers(res.data))
      .catch(err => toast.error('Failed to load shortlist'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="pt-24 px-4 text-center">Please login to view your shortlist.</div>;
  if (loading) return <div className="pt-24 px-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">My Shortlist</h1>
      {lawyers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No lawyers in your shortlist yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer._id} lawyer={lawyer} />
          ))}
        </div>
      )}
    </div>
  );
}