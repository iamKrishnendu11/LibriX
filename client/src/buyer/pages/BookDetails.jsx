import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  ShoppingCart,
  Volume2,
  VolumeX,
  MessageCircle,
  Star,
  User,
  Check,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

/* ✅ 5 BOOKS */
const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
    rent_price_per_week: 50,
    sell_price: 450,
    condition: 'like-new',
    distance: 2.3,
    category: 'self-help',
    owner_name: 'Rahul Sharma',
    address: 'Andheri West, Mumbai'
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=800&fit=crop',
    description: 'Rules for focused success in a distracted world.',
    rent_price_per_week: 45,
    sell_price: 400,
    condition: 'good',
    distance: 3.1,
    category: 'productivity',
    owner_name: 'Amit Verma',
    address: 'Salt Lake, Kolkata'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop',
    description: 'A Handbook of Agile Software Craftsmanship.',
    rent_price_per_week: 60,
    sell_price: 520,
    condition: 'like-new',
    distance: 1.8,
    category: 'programming',
    owner_name: 'Sourav Das',
    address: 'Behala, Kolkata'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    cover_image: 'https://images.unsplash.com/photo-1524578271613-eb4a9d6f04e4?w=600&h=800&fit=crop',
    description: 'Your Journey to Mastery.',
    rent_price_per_week: 55,
    sell_price: 480,
    condition: 'good',
    distance: 4.2,
    category: 'technology',
    owner_name: 'Ritika Sen',
    address: 'Garia, Kolkata'
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=800&fit=crop',
    description: 'Explores the two systems that drive the way we think.',
    rent_price_per_week: 40,
    sell_price: 430,
    condition: 'fair',
    distance: 5.0,
    category: 'psychology',
    owner_name: 'Neha Gupta',
    address: 'Howrah, Kolkata'
  }
];

export default function BookList() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [playing, setPlaying] = useState({});

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Navbar />
      <div className='pt-22' />
      <div className="flex justify-center">
        <div className="w-[75%] space-y-8">
          {/* BACK */}
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 1.5 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-[260px_1fr] gap-6">
                    {/* IMAGE */}
                    <div className="relative h-[380px] rounded-xl overflow-hidden">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />

                      <button
                        onClick={() =>
                          setFavorites({ ...favorites, [index]: !favorites[index] })
                        }
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites[index]
                              ? 'fill-red-500 text-red-500'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-3 right-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setPlaying({ ...playing, [index]: !playing[index] })
                          }
                        >
                          {playing[index] ? (
                            <VolumeX className="w-4 h-4 mr-1" />
                          ) : (
                            <Volume2 className="w-4 h-4 mr-1" />
                          )}
                          Listen
                        </Button>
                      </div>

                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {book.distance} km away
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge>{book.condition}</Badge>
                          <Badge variant="secondary">{book.category}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold">{book.title}</h2>
                        <p className="text-slate-600">by {book.author}</p>
                      </div>

                      {/* RATING */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= 4
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-slate-500">4.0</span>
                      </div>

                      {/* ABOUT */}
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">About this book</h3>
                          <p className="text-slate-600">{book.description}</p>
                        </CardContent>
                      </Card>

                      {/* OWNER */}
                      <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="text-black" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{book.owner_name}</p>
                            <p className="text-sm text-slate-500">{book.address}</p>
                          </div>
                          <Button variant="outline" size="sm" className='bg-green-100'>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </CardContent>
                      </Card>

                      {/* RENT + BUY */}
                      <Card className="bg-green-100">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Rent / week</span>
                            <span className="font-semibold text-green-600">
                              ₹{book.rent_price_per_week}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Buy Price</span>
                            <span className="font-semibold text-black">
                              ₹{book.sell_price}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-white text-black hover:bg-amber-100">
                              <BookOpen className="w-4 h-4 mr-1" />
                              Rent
                            </Button>
                            <Button className="flex-1 text-black bg-green-300 hover:bg-green-500">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Buy
                            </Button>
                          </div>

                          <div className="flex justify-center text-xs text-slate-500 text-semibold gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            Secure payment • Easy pickup
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
