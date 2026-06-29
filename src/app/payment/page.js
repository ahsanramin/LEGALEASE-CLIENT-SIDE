"use client";
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentForm({ amount, purpose, lawyerId, hiringId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    saveInfo: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      let clientSecret = '';
      let paymentIntentId = '';
      
      if (purpose === 'publishing') {
        const pubRes = await axios.post('/payments/lawyer-publish', { amount });
        clientSecret = pubRes.data.clientSecret;
      } else {
        const hireRes = await axios.post(`/hiring/${hiringId}/pay`, { amount });
        clientSecret = hireRes.data.clientSecret;
      }

      const cardElement = elements.getElement(CardElement);
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (confirmError) {
        toast.error(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        paymentIntentId = paymentIntent.id;
        if (purpose === 'publishing') {
          await axios.post('/payments/confirm-publish', { paymentIntentId });
          toast.success('Publishing fee paid successfully! Profile will be published.');
        } else {
          await axios.post('/payments/confirm-hire', { paymentIntentId });
          toast.success('Hiring fee paid successfully!');
        }

        if (user?.role === 'lawyer') {
          router.push('/dashboard/lawyer');
        } else {
          router.push('/dashboard/user/hiring-history?payment_success=true');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Payment failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contact Information</h3>
          <input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#16181d] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            required
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Payment method</h3>
          <div className="bg-[#16181d] border border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-white font-medium border-b border-gray-700/50 pb-3">
              <CreditCard size={18} className="text-indigo-400" />
              <span>Card</span>
            </div>
            <div className="bg-[#0f1115] p-3 rounded-lg border border-gray-700/50 hover:border-indigo-500/50 transition-colors">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#fff',
                      '::placeholder': { color: '#a0aec0' },
                      iconColor: '#a0aec0',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Cardholder Name</h3>
          <input
            type="text"
            placeholder="Full name on card"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#16181d] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            required
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Country or Region</h3>
          <select className="w-full bg-[#16181d] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm">
            <option>Bangladesh</option>
            <option>United States</option>
            <option>India</option>
            <option>United Kingdom</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="saveInfo"
          checked={formData.saveInfo}
          onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
          className="accent-indigo-600 w-4 h-4 rounded border-gray-600 focus:ring-indigo-500"
        />
        <label htmlFor="saveInfo" className="text-sm text-gray-400 cursor-pointer">
          Save my information for faster checkout
        </label>
      </div>

      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1 border-t border-gray-800 pt-4">
        <Lock size={12} /> Pay securely on this site.
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02]"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
}

// 🔥 useSearchParams ব্যবহার করা অংশটিকে আলাদা করে Suspense দিয়ে র্যাপ করা হয়েছে
function PaymentContent() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount')) || 0;
  const purpose = searchParams.get('purpose') || 'hiring';
  const lawyerId = searchParams.get('lawyerId') || '';
  const hiringId = searchParams.get('hiringId') || '';
  const [currency, setCurrency] = useState('USD');

  const getTitle = () => {
    if (purpose === 'publishing') return 'LegalEase Publishing Fee';
    return 'LegalEase Consultation';
  };

  const getDescription = () => {
    if (purpose === 'publishing') return 'One-time payment to publish your profile';
    return 'Access to legal consultation';
  };

  return (
    <>
      <div className="space-y-8 sticky top-28">
        <div className="flex items-center gap-4 text-gray-400">
          <ArrowLeft className="cursor-pointer hover:text-white transition-colors" onClick={() => window.history.back()} />
          <Lock size={16} />
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/20 px-3 py-1 rounded-full uppercase tracking-wider">Secure Checkout</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/30 shadow-2xl"
        >
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Choose a currency:</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrency('BDT')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${currency === 'BDT' ? 'border-white bg-transparent' : 'border-gray-700 bg-[#16181d]'}`}
              >
                <span className="text-xl">🇧🇩</span>
                <div className="text-left">
                  <span className="block font-semibold">BDT {(amount * 127).toFixed(2)}</span>
                </div>
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${currency === 'USD' ? 'border-white bg-transparent' : 'border-gray-700 bg-[#16181d]'}`}
              >
                <span className="text-xl">🇺🇸</span>
                <div className="text-left">
                  <span className="block font-semibold">${amount.toFixed(2)}</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">1 USD = 127.0000 BDT</p>
          </div>

          <div className="border-t border-gray-700/50 pt-6 flex flex-col md:flex-row justify-between gap-2">
            <div>
              <h4 className="font-bold text-xl text-white">{getTitle()}</h4>
              <p className="text-sm text-gray-400">{getDescription()}</p>
            </div>
            <div className="text-3xl font-extrabold text-indigo-400">
              {currency === 'BDT' ? `BDT ${(amount * 127).toFixed(2)}` : `$${amount.toFixed(2)}`}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#131418] border border-gray-800/80 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <CreditCard size={22} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Payment Details</h2>
        </div>
        <Elements stripe={stripePromise}>
          <PaymentForm amount={amount} purpose={purpose} lawyerId={lawyerId} hiringId={hiringId} />
        </Elements>
      </motion.div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <Suspense fallback={<div className="text-gray-400">Loading payment details...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}