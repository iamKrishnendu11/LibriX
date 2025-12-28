import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; 
import EmptyState from '@/components/common/EmptyState';
import { BookCardSkeleton } from '@/components/common/LoadingSkeleton';
import buyerAxios from '@/api/axiosBuyer';
import { toast } from 'sonner';

import {
  Search,
  MapPin,
  Gavel,
  ShoppingCart,
  SlidersHorizontal,
  BookOpen,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  'All', 'Fiction', 'Non-Fiction', 'Self-Help', 'Academic', 'Biography', 'Science', 'Technology'
];

export default function BuyerHome() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buying');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // States for Bidding Form
  const [bidBookName, setBidBookName] = useState('');
  const [bidComment, setBidComment] = useState('');

  const [saleBooks, setSaleBooks] = useState([]);
  const [rentBooks, setRentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------ FETCH SALE BOOKS ------------------
  useEffect(() => {
    if (activeTab !== 'buying') return;

    const fetchSaleBooks = async () => {
      try {
        setIsLoading(true);
        const response = await buyerAxios.get('https://librix-03l6.onrender.com/api/books/for-sale');
        if (response.data.success) setSaleBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleBooks();
  }, [activeTab]);

  // ------------------ FETCH RENT BOOKS ------------------
  useEffect(() => {
    if (activeTab !== 'lending') return;

    const fetchRentBooks = async () => {
      try {
        setIsLoading(true);
        const response = await buyerAxios.get('https://librix-03l6.onrender.com/api/lend-books');
        if (response.data.success) {
          setRentBooks(response.data.books);
        }
      } catch (error) {
        console.error("Error fetching rent books:", error);
        toast.error("Failed to load rental books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentBooks();
  }, [activeTab]);

  const displayBooks =
    activeTab === "buying" ? saleBooks :
    activeTab === "lending" ? rentBooks : [];

  const filteredBooks = displayBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      book.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = async (bookId) => {
    try {
      const token = localStorage.getItem("buyerAccessToken");
      if (!token) {
        alert("Please log in first to buy a book!");
        return;
      }

      const response = await buyerAxios.post(
        'https://librix-03l6.onrender.com/api/orders/buy',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Order placed! Notification sent to seller.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  // ------------------ BID FORM SUBMISSION ------------------
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if(!bidBookName || !bidComment) {
        toast.error("Please fill in both fields");
        return;
    }

    try {
      const response = await buyerAxios.post('https://librix-03l6.onrender.com/api/bids/post-request', {
        bookName: bidBookName,
        comment: bidComment
      });

      if (response.data.success) {
        toast.success("Bidding request sent!");
        setBidBookName('');
        setBidComment('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post bid");
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-2">
      <Navbar />

      <div className='pt-25'/>
      <div className="bg-slate-50 pt-14 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-[75%] max-w-5xl px-10 py-16 rounded-[2.5rem] bg-gradient-to-br from-yellow-300 to-green-200 shadow-2xl"
        >
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-extrabold mb-4">Find Your Next Read</h1>
            <p className="mb-10">Discover books within 5 km</p>
            <div className="bg-white rounded-2xl p-4 flex gap-2 items-center">
              <Search className="w-5 h-5 text-slate-500 ml-2" />
              <Input
                placeholder={`Search books to ${activeTab === "buying" ? "buy" : "rent"}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent text-slate-900 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              <Button className="bg-green-300 hover:bg-yellow-300 text-black rounded-xl px-5 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-black">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Showing books within 5 km of your location</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex w-full max-w-lg mx-auto rounded-full bg-white p-1 shadow-md h-14">
          <TabsTrigger value="lending" className="relative flex-1 rounded-full text-sm font-semibold text-slate-700 data-[state=active]:text-white">
            {activeTab === "lending" && (
              <motion.div
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-green-400 text-black"
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Rent
            </div>
          </TabsTrigger>
          <TabsTrigger value="buying" className="relative flex-1 rounded-full text-sm font-semibold text-slate-700 data-[state=active]:text-white">
            {activeTab === "buying" && (
              <motion.div
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-green-400 text-black"
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Buy
            </div>
          </TabsTrigger>
          <TabsTrigger value="bidding" className="relative flex-1 rounded-full text-sm font-semibold text-slate-700 data-[state=active]:text-white">
            {activeTab === "bidding" && (
              <motion.div
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-green-400 text-black"
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Gavel className="w-4 h-4" /> Bid
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* CATEGORY FILTER */}
      {activeTab !== "bidding" && (
        <div className="flex justify-center mb-6">
          <div className="relative flex gap-2 overflow-x-auto scrollbar-hide bg-white p-1 rounded-full shadow-sm max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-400 text-white"
                    : "text-slate-700"
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-green-400"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BIDDING SECTION OR BOOK GRID */}
      <div className="flex flex-col items-center justify-center w-full px-4">
        {activeTab === "bidding" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Post a Bid</h2>
              <p className="text-slate-500 text-sm">Tell sellers what book you are looking for</p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">Book Name</label>
                <Input 
                  placeholder="e.g. Cracking the Coding Interview" 
                  value={bidBookName}
                  onChange={(e) => setBidBookName(e.target.value)}
                  className="mt-1 rounded-xl h-12 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">Comment</label>
                <textarea 
                  placeholder="e.g. I need the 2015 edition" 
                  value={bidComment}
                  onChange={(e) => setBidComment(e.target.value)}
                  className="mt-1 w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent min-h-[100px]"
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-12 bg-green-400 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enter
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div className="flex flex-wrap justify-center gap-6 w-full">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <BookCardSkeleton key={i} />)
              : filteredBooks.length > 0
              ? filteredBooks.map(book => {
                  const isBuyTab = activeTab === "buying";
                  return (
                    <motion.div
                      key={book._id || book.id}
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg p-4 w-64 flex flex-col items-center text-center hover:scale-105 transition-transform">
                        <img
                          src={isBuyTab ? book.coverImage : book.cover_image}
                          alt={book.title}
                          className="w-32 h-44 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-slate-500 mb-1">{book.author}</p>
                        <p className="text-xs text-slate-400 mb-2">
                          {isBuyTab 
                            ? `Shop: ${book.seller?.shopName || "BookBazaar"}`
                            : `Lender: ${book.lenderId?.name || "Private Lender"}`
                          }
                        </p>

                        {isBuyTab ? (
                          <p className="text-sm font-bold mb-2 text-green-600">
                            Buy: ₹{book.price}
                          </p>
                        ) : (
                          <p className="text-sm font-bold mb-2 text-slate-700">
                            Rent: ₹{book.rent_price_per_week}/week
                          </p>
                        )}

                        {isBuyTab && (
                          <Button
                            onClick={() => handleBuyNow(book._id)}
                            className="w-full mt-2 bg-green-400 hover:bg-yellow-400 text-black font-semibold rounded-lg"
                          >
                            Buy Now
                          </Button>
                        )}

                        <Button
                          onClick={() =>
                            navigate(`/buyer/lendBook-details/${book._id || book.id}`, { state: { book, mode: activeTab } })
                          }
                          className="w-full mt-2 bg-green-200 hover:bg-yellow-200 text-black font-semibold rounded-lg"
                        >
                          View More
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              : <EmptyState />}
          </motion.div>
        )}
      </div>
    </div>
  );
}