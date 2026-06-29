"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}