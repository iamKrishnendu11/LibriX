import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  Volume2,
  VolumeX,
  MessageCircle,
  Star,
  User,
  Check,
  Heart,
  Calendar,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import buyerAxios from '@/api/axiosBuyer';
import { toast } from 'sonner';

export default function LendBookDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract book data passed from UserHome.jsx
  const { book } = location.state || {}; 

  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // States for the Rental Popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Book details not found. <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button></p>
      </div>
    );
  }

  const rentalOptions = [1, 2, 4, 8];

  // Logic to send order to Backend
  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    try {
      const token = localStorage.getItem('buyerAccessToken'); //
      
      if (!token) {
        toast.error("Please login as a buyer to rent books");
        return navigate('/login');
      }

      const response = await buyerAxios.post(
        'https://librix-03l6.onrender.com/api/rent-orders/rent', 
        { 
          bookId: book._id, 
          durationWeeks: selectedWeeks 
        },
        { headers: { Authorization: `Bearer ${token}` } } //
      );

      if (response.data.success) {
        toast.success(`Order confirmed for ${selectedWeeks} weeks!`);
        setIsModalOpen(false);
        // Navigate to home or orders page
        setTimeout(() => navigate('/buyer/home'), 1500);
      }
    } catch (error) {
      console.error("Rental Error:", error);
      toast.error(error.response?.data?.message || "Failed to place rental order");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Navbar />
      <div className='pt-22' />
      <div className="flex justify-center">
        <div className="w-[75%] space-y-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-[300px_1fr] gap-8">
                  <div className="space-y-4">
                    <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />

                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
                        />
                      </button>

                      <div className="absolute bottom-4 right-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="backdrop-blur-md bg-white/80"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
                          Listen Description
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 uppercase">
                          {book.condition}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 uppercase">
                          {book.category}
                        </Badge>
                      </div>
                      <h2 className="text-4xl font-extrabold text-slate-900">{book.title}</h2>
                      <p className="text-xl text-slate-500 mt-1 italic">by {book.author}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="font-bold text-slate-700">4.5</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800">About this book</h3>
                      <p className="text-slate-600 leading-relaxed bg-slate-100/50 p-4 rounded-xl border border-slate-100">
                        {book.description || "The lender has not provided a description for this copy."}
                      </p>
                    </div>

                    <Card className="border-slate-100 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-yellow-300 rounded-full flex items-center justify-center shadow-inner">
                          <User className="text-white w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">
                            {book.lenderId?.name || "Verified Lender"}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-green-500" /> {book.lenderId?.address || "Location available on request"}
                          </p>
                        </div>
                        <Button variant="outline" className='border-green-200 text-green-700 hover:bg-green-50'>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Lender
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 border-0 shadow-lg overflow-hidden">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-slate-600 font-medium">Rental Price</span>
                            <span className="text-xs text-slate-400 italic">Billed weekly</span>
                          </div>
                          <span className="text-3xl font-black text-slate-900">
                            ₹{book.rent_price_per_week}<span className="text-sm font-normal text-slate-500"> /week</span>
                          </span>
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 h-14 text-lg bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                          >
                            <Calendar className="w-5 h-5 mr-2" /> Rent Now
                          </Button>
                        </div>

                        <div className="flex justify-center text-xs text-slate-500 font-medium gap-4 pt-2">
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Secure Deposit</span>
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Easy Pickup</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* --- RENTAL POPUP MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Select Duration</h3>
                <p className="text-slate-500">How many weeks would you like to rent?</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {rentalOptions.map((weeks) => (
                  <button
                    key={weeks}
                    onClick={() => setSelectedWeeks(weeks)}
                    className={`relative p-5 rounded-3xl border-2 transition-all duration-300 text-center ${
                      selectedWeeks === weeks
                        ? "border-green-500 bg-green-50 shadow-inner"
                        : "border-slate-100 hover:border-green-200 bg-white"
                    }`}
                  >
                    <span className={`block text-2xl font-black ${selectedWeeks === weeks ? "text-green-700" : "text-slate-700"}`}>
                      {weeks}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {weeks === 1 ? 'Week' : 'Weeks'}
                    </span>
                    {selectedWeeks === weeks && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex justify-between items-center border border-slate-100">
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-bold uppercase">Total for {selectedWeeks} Weeks</p>
                  <p className="text-sm text-slate-600">₹{book.rent_price_per_week} x {selectedWeeks}</p>
                </div>
                <p className="text-3xl font-black text-green-600">₹{book.rent_price_per_week * selectedWeeks}</p>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full h-16 bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-white font-bold text-xl rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {isOrdering ? <Loader2 className="w-6 h-6 animate-spin" /> : "Click here to order"}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}