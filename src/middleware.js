"use client";
import { createContext, useState, useEffect, useContext } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const token = res.data.token;
      
      localStorage.setItem('token', token);
      document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;

      setUser(res.data.user);
      toast.success('Logged in successfully!');
      if (res.data.user.role === 'lawyer') {
        router.push('/dashboard/lawyer');
      } else if (res.data.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      const token = res.data.token;
      
      localStorage.setItem('token', token);
      document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;

      setUser(res.data.user);
      toast.success('Account created successfully!');
      
      router.push('/');
      
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  const googleLogin = async (userData) => {
    try {
      const res = await axios.post('/auth/google', userData);
      const token = res.data.token;
      
      localStorage.setItem('token', token);
      document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;

      setUser(res.data.user);
      toast.success('Google login successful!');
      if (res.data.user.role === 'lawyer') {
        router.push('/dashboard/lawyer');
      } else if (res.data.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

    setUser(null);
    router.push('/login');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);