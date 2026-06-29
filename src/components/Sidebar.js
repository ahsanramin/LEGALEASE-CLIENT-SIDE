"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, User, MessageSquare, Users, CreditCard, BarChart3, Briefcase, Home } from 'lucide-react';

export default function Sidebar({ role }) {
  const pathname = usePathname();
  
  const userLinks = [
    { name: 'Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
    { name: 'Hiring History', href: '/dashboard/user/hiring-history', icon: FileText },
    { name: 'Update Profile', href: '/dashboard/user/update-profile', icon: User },
    { name: 'My Comments', href: '/dashboard/user/comments', icon: MessageSquare },
  ];
  
  const lawyerLinks = [
    { name: 'Dashboard', href: '/dashboard/lawyer', icon: LayoutDashboard },
    { name: 'Hiring History', href: '/dashboard/lawyer/hiring-history', icon: FileText },
    { name: 'Manage Profile', href: '/dashboard/lawyer/manage-legal-profile', icon: Briefcase },
  ];
  
  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
    { name: 'Transactions', href: '/dashboard/admin/all-transactions', icon: CreditCard },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  ];

  let links = [];
  if (role === 'user') links = userLinks;
  else if (role === 'lawyer') links = lawyerLinks;
  else if (role === 'admin') links = adminLinks;

  return (
    <aside className="w-64 h-full overflow-y-auto bg-white dark:bg-[#131418] border-r border-gray-200 dark:border-gray-800 p-4 hidden md:block">
      <h2 className="text-lg font-bold mb-6 px-2 text-gray-800 dark:text-gray-200">Dashboard</h2>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard/admin' && pathname.startsWith(link.href));
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
        
        {/* সকল রোলের জন্য Back to Home লিংক */}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}