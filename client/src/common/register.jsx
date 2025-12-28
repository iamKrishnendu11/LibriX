import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, Phone, CheckCircle, AlertCircle, Loader2, Home, Store, Landmark, MapPin, Lock, ShoppingBag, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom'; // Added useNavigate

// CHANGE THIS TO MATCH YOUR BACKEND PORT
const API_URL = import.meta.env.VITE_API_URL || "https://librix-03l6.onrender.com/api";

export default function Register() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate(); // Hook for redirection

  const [userType, setUserType] = useState('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    gstNumber: ''
  });

  const [errors, setErrors] = useState({});

  const userTypes = [
    { 
      id: 'buyer', 
      label: 'Buyer', 
      icon: Home, 
      description: 'Looking to purchase property',
      longDescription: 'Register as a buyer to explore properties, connect with sellers, and find your dream home or investment opportunity.'
    },
    { 
      id: 'seller', 
      label: 'Seller', 
      icon: Store, 
      description: 'Want to sell your property',
      longDescription: 'List your properties, reach potential buyers, and manage your real estate business with our comprehensive seller tools.'
    },
    { 
      id: 'lender', 
      label: 'Lender', 
      icon: Landmark, 
      description: 'Provide financing solutions',
      longDescription: 'Connect with buyers and sellers, offer financing solutions, and grow your lending business through our platform.'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Seller-specific validation
    if (userType === 'seller') {
      if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
      if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
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
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      };

      if (userType === 'seller') {
        payload.shopName = formData.shopName;
        payload.gstNumber = formData.gstNumber;
        payload.shopAddress = formData.address; 
      }

      const response = await fetch(`${API_URL}/${userType}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      // --- LOGIC FOR AUTO-LOGIN ---
      // --- ROLE-SAFE AUTO-LOGIN ---
if (data.accessToken) {
  // 🔥 Clear legacy / conflicting tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("buyerAccessToken");
  localStorage.removeItem("sellerAccessToken");
  localStorage.removeItem("lenderAccessToken");

  // 🔥 Store token by role
  if (userType === "buyer") {
    localStorage.setItem("buyerAccessToken", data.accessToken);
  } else if (userType === "seller") {
    localStorage.setItem("sellerAccessToken", data.accessToken);
  } else if (userType === "lender") {
    localStorage.setItem("lenderAccessToken", data.accessToken);
  }

  // Common data
  localStorage.setItem(
    "user",
    JSON.stringify(data.user || { name: formData.name })
  );
  localStorage.setItem("userType", userType);
}

      setSubmitStatus('success');

      setTimeout(() => {
        setSubmitStatus(null);
        // If they are a seller and we have a token, go to dashboard. Else, go to login.
        if (userType === 'seller' && data.accessToken) {
          navigate("/seller/dashboard");
        } else {
          navigate("/login"); 
        }
      }, 2000);

    } catch (error) {
      console.error("Register Error:", error);
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
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300/5 rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full border border-green-200 mb-6">
            Join Us Today
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Create Your{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">
              Account
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your role and start your journey with us. Whether you're buying, selling, or lending.
          </p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
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
                className={`relative p-6 rounded-2xl text-left transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-br from-yellow-100 to-green-50 border-2 border-yellow-400 shadow-lg shadow-yellow-200/50'
                    : 'bg-white border border-gray-200 hover:border-yellow-300 hover:shadow-md'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-3 right-3"
                    initial={false}
                  >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400" />
                  </motion.div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-yellow-400 to-green-400' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} />
                </div>

                <h3 className={`text-lg font-semibold mb-1 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                  {type.label}
                </h3>
                <p className={`text-sm ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="bg-white backdrop-blur-sm border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={userType}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  {React.createElement(userTypes.find(t => t.id === userType).icon, {
                    className: "w-7 h-7 text-green-600"
                  })}
                  <h3 className="text-2xl font-bold text-gray-900">
                    Register as {userTypes.find(t => t.id === userType).label}
                  </h3>
                </div>
                <p className="text-gray-600 ml-10">
                  {userTypes.find(t => t.id === userType).longDescription}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-green-500 rounded-full"></div>
                    Personal Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">{userType === 'lender' ? 'Full Name' : 'Name'} *</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="John Doe"
                          className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                            errors.name ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Email */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">Email Address *</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="john@example.com"
                          className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Phone Number */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">Phone Number *</label>
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

                    {/* Address - Full Width */}
                    <motion.div 
                      className="space-y-2 md:col-span-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">Address *</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Textarea
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          placeholder="123 Main Street, City, State, ZIP"
                          rows={3}
                          className={`pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all resize-none ${
                            errors.address ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.address && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.address}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>

                {/* Seller-specific fields */}
                {userType === 'seller' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-green-500 rounded-full"></div>
                      Business Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="text-sm text-gray-700 font-medium">Shop Name *</label>
                        <div className="relative group">
                          <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                          <Input
                            value={formData.shopName}
                            onChange={(e) => handleChange('shopName', e.target.value)}
                            placeholder="My Shop Name"
                            className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                              errors.shopName ? 'border-red-500' : ''
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.shopName && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.shopName}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <label className="text-sm text-gray-700 font-medium">GST Number *</label>
                        <div className="relative group">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                          <Input
                            value={formData.gstNumber}
                            onChange={(e) => handleChange('gstNumber', e.target.value)}
                            placeholder="22AAAAA0000A1Z5"
                            className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                              errors.gstNumber ? 'border-red-500' : ''
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.gstNumber && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.gstNumber}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Security Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-green-500 rounded-full"></div>
                    Security
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Password */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: userType === 'seller' ? 0.4 : 0.3 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">Password *</label>
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

                    {/* Confirm Password */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: userType === 'seller' ? 0.45 : 0.35 }}
                    >
                      <label className="text-sm text-gray-700 font-medium">Confirm Password *</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          placeholder="••••••••"
                          className={`pl-12 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all ${
                            errors.confirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div 
                  className="pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: userType === 'seller' ? 0.5 : 0.4 }}
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
                          <Send className="w-5 h-5 mr-2" />
                          Create {userTypes.find(t => t.id === userType).label} Account
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Status Message */}
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
                          <span>Account created successfully! Welcome aboard.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          <span>{serverError || "Something went wrong. Please try again."}</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          By creating an account, you agree to our{' '}
          <span className="text-green-600 hover:text-green-700 cursor-pointer transition-colors font-medium">Terms of Service</span>
          {' '}and{' '}
          <span className="text-green-600 hover:text-green-700 cursor-pointer transition-colors font-medium">Privacy Policy</span>
        </motion.p>
      </div>
    </section>
  );
}