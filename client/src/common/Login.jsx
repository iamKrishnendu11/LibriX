import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LogIn, Phone, Lock, CheckCircle, AlertCircle, Loader2, Home, Store, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils/index.js';

// CHANGE THIS TO MATCH YOUR BACKEND PORT
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function login() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  const [userType, setUserType] = useState('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const userTypes = [
    { 
      id: 'buyer', 
      label: 'Buyer', 
      icon: Home, 
      description: 'Access your buyer account'
    },
    { 
      id: 'seller', 
      label: 'Seller', 
      icon: Store, 
      description: 'Manage your listings'
    },
    { 
      id: 'lender', 
      label: 'Lender', 
      icon: Landmark, 
      description: 'View lending dashboard'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setServerError("");

    try {
      const response = await fetch(`${API_URL}/${userType}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user || { name: "User" }));
      localStorage.setItem("userType", userType);

      setSubmitStatus('success');
      
      setTimeout(() => {
        setSubmitStatus(null);
        // --- UPDATED NAVIGATION LOGIC ---
        if (userType === 'seller') {
          navigate("/seller/dashboard"); 
        } else if (userType === 'buyer') {
          navigate("/buyer/home"); // Navigates buyer to home
        } else if (userType === 'lender') {
          navigate("/lender/dashboard"); // Navigates lender if applicable
        } else {
          navigate("/"); 
        }
      }, 1500);

    } catch (error) {
      setSubmitStatus('error');
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <section className="relative min-h-screen py-32 bg-gradient-to-br from-yellow-50 via-white to-green-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300/5 rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full border border-green-200 mb-6">
            Welcome Back
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Sign{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">
              In
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Access your account and continue your journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            const isActive = userType === type.id;
            
            return (
              <motion.button
                key={type.id}
                onClick={() => setUserType(type.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl text-center transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-br from-yellow-100 to-green-50 border-2 border-yellow-400 shadow-lg shadow-yellow-200/50'
                    : 'bg-white border border-gray-200 hover:border-yellow-300 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLoginIndicator"
                    className="absolute top-2 right-2"
                    initial={false}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-green-400" />
                  </motion.div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-yellow-400 to-green-400' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                  {type.label}
                </h3>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="bg-white backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-sm text-gray-700 font-medium">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700 font-medium">Password</label>
                <button type="button" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 to-green-500 hover:from-yellow-500 hover:to-green-600 text-white font-semibold text-base rounded-lg shadow-lg shadow-green-500/25 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In as {userTypes.find(t => t.id === userType).label}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl ${
                    submitStatus === 'success'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                >
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Login successful! Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>{serverError || "Invalid credentials. Please try again."}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <Link to={createPageUrl('Register')}>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 font-semibold rounded-lg transition-all duration-300"
              >
                Create an Account
              </Button>
            </Link>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          Protected by industry-standard encryption
        </motion.p>
      </div>
    </section>
  );
}