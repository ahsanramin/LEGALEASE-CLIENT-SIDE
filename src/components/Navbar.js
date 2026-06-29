"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, User, Search, LogOut, ChevronDown, FileText, MessageSquare, Briefcase, Users, CreditCard, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/register')) return null;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(storedTheme === 'dark');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains('dark');
    const newTheme = isCurrentlyDark ? 'light' : 'dark';
    setIsDark(!isCurrentlyDark);
    localStorage.setItem('theme', newTheme);
    if (isCurrentlyDark) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/browse-lawyers?search=${searchTerm}`);
      setIsMobileOpen(false);
    }
  };

  const getDashboardLinks = (role) => {
    if (role === 'user') {
      return [
        { name: 'Hiring History', href: '/dashboard/user/hiring-history', icon: FileText },
        { name: 'Update Profile', href: '/dashboard/user/update-profile', icon: User },
        { name: 'My Comments', href: '/dashboard/user/comments', icon: MessageSquare },
      ];
    } else if (role === 'lawyer') {
      return [
        { name: 'Hiring History', href: '/dashboard/lawyer/hiring-history', icon: FileText },
        { name: 'Manage Profile', href: '/dashboard/lawyer/manage-legal-profile', icon: Briefcase },
      ];
    } else if (role === 'admin') {
      return [
        { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
        { name: 'Transactions', href: '/dashboard/admin/all-transactions', icon: CreditCard },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
      ];
    }
    return [];
  };

  const dashboardLinks = user ? getDashboardLinks(user.role) : [];

  const isActive = (href) => {
    if (href === '/') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f1115] border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="https://cdn.vectorstock.com/i/1000v/20/56/justice-and-law-logo-icon-vector-29552056.jpg" 
                alt="LegalEase Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900/50 group-hover:border-indigo-500 transition-colors" 
              />
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">LegalEase</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/" className={`text-sm font-medium transition-colors relative ${isActive('/') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                Home
                {isActive('/') && <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>}
              </Link>
              <Link href="/browse-lawyers" className={`text-sm font-medium transition-colors relative ${isActive('/browse-lawyers') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                Browse Lawyers
                {isActive('/browse-lawyers') && <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>}
              </Link>
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <Link
                    href={`/dashboard/${user.role}`}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${isActive(`/dashboard/${user.role}`) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                  >
                    Dashboard
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="cursor-pointer"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </Link>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden py-1.5"
                      >
                        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">My Account</p>
                        </div>
                        {dashboardLinks.map((link) => (
                          <Link 
                            key={link.href} 
                            href={link.href} 
                            onClick={() => setIsDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive(link.href) ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                          >
                            <link.icon size={16} className="opacity-70" />
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm lg:max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full bg-gray-100 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-shadow"
              />
            </form>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700 dark:text-gray-300" />}
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Link href={`/dashboard/${user.role}`} className="flex items-center gap-2.5 group">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-all">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Link href="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">Login</Link>
                <Link href="/register" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/20">Register</Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden gap-2">
            {mounted && (
              <button onClick={toggleTheme} className="p-2">
                {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
              </button>
            )}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-700 dark:text-gray-300">
              {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800 py-5 space-y-3 bg-white dark:bg-[#0f1115]"
            >
              <Link href="/" className="block text-sm font-medium hover:text-indigo-600 transition-colors py-2" onClick={closeMobileMenu}>Home</Link>
              <Link href="/browse-lawyers" className="block text-sm font-medium hover:text-indigo-600 transition-colors py-2" onClick={closeMobileMenu}>Browse Lawyers</Link>
              <form onSubmit={handleSearch} className="relative my-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:outline-none"
                />
              </form>
              {user ? (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      {user.profilePic ? <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" /> : <User size={18} className="text-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/${user.role}`} className="block text-sm font-medium hover:text-indigo-600 transition-colors py-2" onClick={closeMobileMenu}>Dashboard</Link>
                  <button onClick={() => { logout(); closeMobileMenu(); }} className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors py-2">Logout</button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                  <Link href="/login" className="w-full text-center py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={closeMobileMenu}>Login</Link>
                  <Link href="/register" className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md" onClick={closeMobileMenu}>Register</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}