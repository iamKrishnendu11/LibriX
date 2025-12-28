import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { motion } from "framer-motion";
import { Loader2, IndianRupee, TrendingUp } from "lucide-react";

export default function UploadedBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
 const fetchBooks = async () => {
  try {
    // 1. Double check this matches exactly what is in your Application tab
    const token = localStorage.getItem('lenderAccessToken'); 
    
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      return;
    }

    // 2. Updated URL: Ensure it hits the specific lend-books endpoint
    const response = await fetch('https://librix-03l6.onrender.com/api/lend-books/my-books', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Ensure no extra quotes/spaces
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Response Status:", response.status);

    if (response.status === 401) {
       console.error("401 Unauthorized: The token is invalid or expired.");
       // Optional: localStorage.clear(); navigate('/login');
       return;
    }

    const data = await response.json();
    if (data.success) {
      setBooks(data.books);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    setIsLoading(false);
  }
};

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-30 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-[85%] max-w-5xl px-12 py-16 rounded-[2.5rem]
          bg-gradient-to-br from-yellow-300 to-green-200 text-center shadow-2xl"
        >
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900">
            Manage Your Listings
          </h1>
          <p className="text-lg text-slate-700">
            Track your shared books and earnings at a glance.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
            <p className="text-slate-500 font-medium">Loading your collection...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 
                hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Book Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm uppercase">
                      {book.condition}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                  
                  <div className="w-full grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-green-50 rounded-2xl p-2">
                      <p className="text-[10px] text-green-600 font-bold uppercase">Weekly Rent</p>
                      <p className="font-bold text-slate-800 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3" />{book.rent_price_per_week}
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-2">
                      <p className="text-[10px] text-yellow-600 font-bold uppercase">Total Revenue</p>
                      <p className="font-bold text-slate-800 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-yellow-500" />
                        ₹{Math.floor(Math.random() * 1000) + 500} {/* Dummy Revenue */}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full py-6 bg-gradient-to-r from-green-400 to-yellow-400 hover:from-green-500 hover:to-yellow-500 
                  text-white font-bold rounded-2xl shadow-lg border-none transform transition hover:scale-[1.02] active:scale-95">
                    View More Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your shelf is empty"
            description="Start uploading books to see them here."
          />
        )}
      </div>
    </div>
  );
}