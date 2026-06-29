"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  // ড্যাশবোর্ড, লগইন এবং রেজিস্টার পৃষ্ঠায় ফুটার লুকিয়ে যাবে
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/register')) return null;

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-[#0f1115] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.vectorstock.com/i/1000v/20/56/justice-and-law-logo-icon-vector-29552056.jpg" 
                alt="LegalEase Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900/50" 
              />
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">LegalEase</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Find & Hire Expert Legal Counsel online. Trusted by thousands for secure, seamless legal connections.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h5>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Follow Us</h5>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-600 transition-colors duration-200" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Newsletter</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Get the latest legal tips and updates directly in your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:bg-[#1a1c23] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100" 
              />
              <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} LegalEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}