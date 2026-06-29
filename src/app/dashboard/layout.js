"use client";
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f1115]">
      <Sidebar role={user?.role} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <Link
          href="/"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-[#1a1c23] dark:text-gray-200 dark:hover:bg-[#0f1115]"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        {children}
      </main>
    </div>
  );
}