"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import LawyerCard from '@/components/LawyerCard';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Filter, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

function BrowseLawyersContent() {
  const searchParams = useSearchParams();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minFee: '',
    maxFee: '',
    availability: ''
  });

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: filters.search,
        minFee: filters.minFee,
        maxFee: filters.maxFee,
        availability: filters.availability
      });
      const res = await axios.get(`/lawyers?${params.toString()}`);
      setLawyers(res.data.lawyers || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchLawyers();
  };

  const clearFilters = () => {
    setFilters({ search: '', minFee: '', maxFee: '', availability: '' });
    setCurrentPage(1);
    setTimeout(() => fetchLawyers(), 0);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <div className="bg-gray-50 dark:bg-[#1a1c23] p-6 rounded-2xl mb-10 border border-gray-200 dark:border-gray-800 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Name or Specialization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Min Fee</label>
          <input 
            type="number" 
            value={filters.minFee} 
            onChange={(e) => handleFilterChange('minFee', e.target.value)} 
            placeholder="$0"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" 
          />
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Max Fee</label>
          <input 
            type="number" 
            value={filters.maxFee} 
            onChange={(e) => handleFilterChange('maxFee', e.target.value)} 
            placeholder="$500+"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100" 
          />
        </div>
        <div className="w-40">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Availability</label>
          <select 
            value={filters.availability} 
            onChange={(e) => handleFilterChange('availability', e.target.value)} 
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Busy</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={applyFilters} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20 flex items-center gap-2">
            <Filter size={16} /> Apply
          </button>
          <button onClick={clearFilters} className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center gap-2">
            <X size={16} /> Clear
          </button>
        </div>
      </div>

      {lawyers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#1a1c23] rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No lawyers found</h3>
          <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer._id} lawyer={lawyer} />
            ))}
          </motion.div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </>
      )}
    </>
  );
}

export default function BrowseLawyers() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Browse Lawyers</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing top legal professionals</p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <BrowseLawyersContent />
      </Suspense>
    </div>
  );
}