import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Loader2, Home, Store, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [userType, setUserType] = useState('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const userTypes = [
    { 
      id: 'buyer', 
      label: 'Buyer', 
      icon: Home, 
      description: 'Property inquiries'
    },
    { 
      id: 'seller', 
      label: 'Seller', 
      icon: Store, 
      description: 'Listing support'
    },
    { 
      id: 'lender', 
      label: 'Lender', 
      icon: Landmark, 
      description: 'Partnership queries'
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
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <section id='help' className="relative py-24 bg-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-50 to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-yellow-50 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-black bg-yellow-200 rounded-full border border-amber-200 mb-6">
            Get In Touch
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Let's{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you with all your property needs.
          </p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-3 mb-10"
        >
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            const isActive = userType === type.id;
            
            return (
              <motion.button
                key={type.id}
                onClick={() => setUserType(type.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'text-white shadow-xl'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:shadow-lg'
                }`}
              >
                {/* Animated Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Glow Effect */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-200 blur-xl text-black opacity-50"
                  />
                )}

                <div className="relative flex items-center gap-2">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span>{type.label}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="relative bg-white backdrop-blur-sm border-2 border-gray-200 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-green-400/10 to-transparent rounded-full blur-3xl" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={userType}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="mb-8">
                <motion.div 
                  className="flex items-center gap-3 mb-3"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-200 flex items-center justify-center shadow-lg"
                  >
                    {React.createElement(userTypes.find(t => t.id === userType).icon, {
                      className: "w-6 h-6 text-white"
                    })}
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Contact Us
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-yellow-600 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {userTypes.find(t => t.id === userType).label} Inquiry
                    </motion.p>
                  </div>
                </motion.div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {userTypes.find(t => t.id === userType).description}
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-sm text-gray-700 font-medium">Full Name *</label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Phone */}
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

                  {/* Subject */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="text-sm text-gray-700 font-medium">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Property inquiry, consultation, etc."
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all"
                    />
                  </motion.div>
                </div>

                {/* Message */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-sm text-gray-700 font-medium">Your Message *</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className={`pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all resize-none ${
                        errors.message ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div 
                  className="pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold text-base rounded-lg shadow-lg shadow-green-500/25 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
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
                          <span>Message sent successfully! We'll be in touch soon.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          <span>Something went wrong. Please try again.</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}