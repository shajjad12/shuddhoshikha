/**
 * LoginView — Shuddhoshikha
 * Clean Apple-style auth screen.
 * - Email/Password → WordPress JWT
 * - Mint "লগইন করুন" button (never drops opacity)
 * - Redirects to original location after login
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation }  from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('ইউজারনেম ও পাসওয়ার্ড দিন'); return; }
    setLoading(true); setError('');
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#F4F7FB 0%,#F4F2FF 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-mint rounded-3xl flex items-center justify-center
                          shadow-lift mb-4">
            <GraduationCap className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-bengali font-bold text-2xl text-brand-charcoal">শুদ্ধশিক্ষা</h1>
          <p className="font-bengali text-sm text-brand-muted mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lift p-7 space-y-5">

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#FFF0F0' }}
              >
                <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="font-bengali text-xs text-brand-red">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="font-bengali text-xs font-semibold text-brand-muted block mb-1.5">
                ইউজারনেম বা ইমেইল
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="username / email"
                className="w-full px-4 py-3 bg-brand-base border border-gray-100 rounded-xl
                           font-data text-sm text-brand-charcoal placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-brand-mint/30
                           focus:border-brand-mint transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-bengali text-xs font-semibold text-brand-muted block mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-brand-base border border-gray-100 rounded-xl
                             font-data text-sm text-brand-charcoal placeholder:text-gray-400
                             focus:outline-none focus:ring-2 focus:ring-brand-mint/30
                             focus:border-brand-mint transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPw
                    ? <EyeOff className="w-4 h-4 text-gray-400" />
                    : <Eye    className="w-4 h-4 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <button type="button" className="font-bengali text-xs text-brand-mint hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-mint w-full py-3.5 !rounded-xl flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                />
              ) : (
                <span className="font-bengali font-bold">লগইন করুন</span>
              )}
            </button>
          </form>
        </div>

        <p className="font-bengali text-xs text-center text-brand-muted mt-6">
          অ্যাকাউন্ট নেই?{' '}
          <span className="text-brand-mint font-semibold cursor-pointer hover:underline">
            শিক্ষক/অ্যাডমিনের সাথে যোগাযোগ করুন
          </span>
        </p>
      </motion.div>
    </div>
  );
}
