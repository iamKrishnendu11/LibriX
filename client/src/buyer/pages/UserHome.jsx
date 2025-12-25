import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from './Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BookCard from '@/components/common/BookCard';
import EmptyState from '@/components/common/EmptyState';
import { BookCardSkeleton } from '@/components/common/LoadingSkeleton';
import axios from 'axios'; // Ensure axios is installed

import { 
  Search, 
  MapPin, 
  Gavel, 
  ShoppingCart, 
  SlidersHorizontal,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Sample data kept ONLY for the Rent tab until you create lendbook.model.js backend
const sampleLendBooks = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    listing_type: 'lend',
    rent_price_per_week: 50,
    category: 'self-help'
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover_image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    listing_type: 'lend',
    rent_price_per_week: 60,
    category: 'non-fiction'
  }
];

const categories = [
  'All', 'Fiction', 'Non-Fiction', 'Self-Help', 'Academic', 'Biography', 'Science', 'Technology'
];

export default function BuyerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buying'); // Default to Buy as requested
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // ✅ States for real database data
  const [saleBooks, setSaleBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch Sale Books from database
  useEffect(() => {
    const fetchSaleBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/books/for-sale');
        if (response.data.success) {
          setSaleBooks(response.data.books);
        }
      } catch (error) {
        console.error("Error fetching sale books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'buying') {
      fetchSaleBooks();
    }
  }, [activeTab]);

  // Combined logic to handle both tabs
  const displayBooks = activeTab === 'buying' ? saleBooks : sampleLendBooks;

  const filteredBooks = displayBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      book.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-2">
      {/* Hero Section */}
      <Navbar />
      <div className="bg-slate-50 pt-14 pb-8 md:pt-30 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-[75%] max-w-5xl px-10 md:px-16 py-16 md:py-15 rounded-[2.5rem] bg-gradient-to-br from-yellow-300 to-green-200 text-black shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Find Your Next Read</h1>
            <p className="text-black text-lg mb-10">Discover books from lenders and sellers within 5 km — curated for readers</p>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-1 md:p-4 shadow-xl flex items-center gap-1">
              <Search className="w-5 h-5 text-slate-500 ml-2" />
              <Input
                type="text"
                placeholder={`Search books to ${activeTab === 'buying' ? 'buy' : 'rent'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent text-slate-900 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              <Button className="bg-green-300 hover:bg-yellow-300 text-black rounded-xl px-5">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
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

      <div className="container justify-center mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-3">
          <TabsList className="flex w-full max-w-lg mx-auto rounded-full bg-white p-1 shadow-md h-14">
            {[
              { value: "lending", label: "Rent", icon: BookOpen },
              { value: "buying", label: "Buy", icon: ShoppingCart },
              { value: "bidding", label: "Bid", icon: Gavel },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative flex-1 rounded-full text-sm font-semibold text-slate-700 transition-colors data-[state=active]:text-white"
              >
                {activeTab === value && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-green-400 text-black"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Categories */}
        {activeTab !== "bidding" && (
          <div className="flex justify-center mb-6">
            <div className="relative flex gap-2 overflow-x-auto scrollbar-hide bg-white p-1 rounded-full shadow-sm max-w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap text-slate-700 transition-colors"
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-green-400"
                    />
                  )}
                  <span className={`relative z-10 ${selectedCategory === category ? "text-white" : "text-slate-700"}`}>
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'bidding' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[300px] min-w-[75%] bg-gradient-to-br from-green-100 to-yellow-200 rounded-2xl text-center mx-auto max-w-xl p-8"
          >
            <Gavel className="w-12 h-12 text-green-400 mb-4" />
            <h2 className="text-4xl font-bold mb-2">Reverse Bidding</h2>
            <p className="text-slate-600 mb-6">Post a request and let sellers compete for the best price.</p>
            <Link to={createPageUrl('ReverseBidding')}>
              <Button className="bg-green-500 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg">
                Request a Book
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {isLoading
              ? Array(8).fill(0).map((_, i) => <BookCardSkeleton key={i} />)
              : filteredBooks.length > 0
              ? filteredBooks.map((book) => {
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
                          src={book.coverImage || book.cover_image}
                          alt={book.title}
                          className="w-32 h-44 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-slate-500 mb-1">{book.author}</p>
                        <p className="text-xs text-slate-400 mb-2">
                          Shop: {book.seller?.shopName || "BookBazaar"}
                        </p>

                        {isBuyTab ? (
                          <p className="text-sm font-bold mb-2 text-green-600">
                            Buy: ₹{book.price}
                          </p>
                        ) : (
                          <p className="text-sm font-medium mb-2 text-slate-700">
                            Rent: ₹{book.rent_price_per_week}/week
                          </p>
                        )}

                        <Button className="bg-green-400 hover:bg-yellow-400 text-black w-full mt-2 rounded-lg font-semibold">
                          {isBuyTab ? "Buy Now" : "Rent Now"}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              : (
                <EmptyState
                  type="search"
                  title="No books found"
                  description="Try adjusting your search or filters."
                />
              )}
          </motion.div>
        )}
      </div>
    </div>
  );
}