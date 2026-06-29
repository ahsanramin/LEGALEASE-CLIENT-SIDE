import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-[#0f1115] text-center">
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20">
        Go Back Home
      </Link>
    </div>
  );
}