"use client";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
  const router = useRouter();

  const plans = [
    {
      name: 'Client',
      price: '$0',
      features: ['Browse Lawyers', 'Hire Professionals', 'Leave Reviews', 'Secure Payments'],
      cta: 'Get Started',
      popular: false // এই লাইনটি true করা হয়েছে
    },
    {
      name: 'Lawyer',
      price: '$10,000',
      features: ['One-time Publishing Fee', 'Unlimited Listings', 'Hiring History', 'Case Management'],
      cta: 'Publish Profile',
      popular: false // এই লাইনটি false করা হয়েছে
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Bulk Hiring', 'Priority Support', 'Analytics Dashboard', 'Custom Branding'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4"
        >
          Choose Your Plan
        </motion.h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Flexible pricing for every legal professional and client.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative p-8 rounded-2xl shadow-xl border-2 transition-all hover:scale-105 ${
              plan.popular
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1c23]'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{plan.name}</h3>
            <p className="text-4xl font-extrabold mt-4 mb-6 text-indigo-600 dark:text-indigo-400">{plan.price}</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-600 dark:text-gray-400">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                if (plan.name === 'Lawyer') router.push('/payment?amount=10000&purpose=publishing');
                else if (plan.name === 'Enterprise') window.location.href = 'mailto:admin@gmail.com';
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}