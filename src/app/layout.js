import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import './globals.css';

export const metadata = {
  title: 'LegalEase - Find & Hire Expert Legal Counsel',
  description: 'Online Lawyer Hiring Platform',
  icons: {
    icon: '/logo.png', // আপনার ফাইলের নাম অনুযায়ী পরিবর্তন করুন
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <Providers>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}