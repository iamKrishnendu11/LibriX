import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from '@/utils/index.js';
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  IndianRupee,
  TrendingUp,
  Upload,
  ShoppingCart,
  Package,
  ArrowUpRight,
  MessageCircle,
  Gavel,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';

// ---------------- DATA ----------------
const salesData = [
  { month: 'Jan', sales: 8 },
  { month: 'Feb', sales: 12 },
  { month: 'Mar', sales: 15 },
  { month: 'Apr', sales: 10 },
  { month: 'May', sales: 18 },
  { month: 'Jun', sales: 22 },
];

const recentOrders = [
  { id: '1', book: 'Clean Code', buyer: 'Amit Kumar', amount: 450, status: 'pending' },
  { id: '2', book: 'Design Patterns', buyer: 'Priya Sharma', amount: 380, status: 'ready' },
  { id: '3', book: 'The Pragmatic Programmer', buyer: 'Rahul Verma', amount: 520, status: 'picked_up' },
];

const activeBids = [
  { id: '1', book: 'System Design Interview', budget: 600, offers: 3 },
  { id: '2', book: 'Cracking the Coding Interview', budget: 500, offers: 5 },
];

// ---------------- COMPONENT ----------------
export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

 // AUTHENTICATION CHECK
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');
    const storedUserRaw = localStorage.getItem('user'); // Get raw string first

    // Check if user data is valid and not the string "undefined"
    if (!token || userType !== 'seller' || !storedUserRaw || storedUserRaw === "undefined") {
      console.warn("Auth failed or user data missing, redirecting...");
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        setUser(parsedUser);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        navigate('/login');
      }
    }
  }, [navigate]);
  // Prevent rendering protected content while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Books Listed',
      value: '45',
      icon: BookOpen,
      change: '+5 this week',
      bgColor: 'bg-white-500',
      iconColor: 'text-grey-600'
    },
    {
      title: 'Orders Completed',
      value: '128',
      icon: ShoppingCart,
      change: '+12 this month',
      bgColor: 'bg-white-100',
      iconColor: 'text-grey-600'
    },
    {
      title: 'Total Revenue',
      value: '₹42,850',
      icon: IndianRupee,
      change: '+₹8,200 this month',
      bgColor: 'bg-white-100',
      iconColor: 'text-grey-600'
    },
    {
      title: 'Active Bids',
      value: '7',
      icon: Gavel,
      change: '3 new requests',
      bgColor: 'bg-white-100',
      iconColor: 'text-grey-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">

        {/* ---------- HEADER ---------- */}
        <Navbar />
        <div className="flex pt-20 flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back, {user?.name || 'Seller'}. Manage your book sales and orders.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to={createPageUrl('SellerBids')}>
              <Button variant="outline" className="relative">
                <Gavel className="w-4 h-4 mr-2" />
                Bid Requests
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">3</Badge>
              </Button>
            </Link>

            <Link to={createPageUrl('SellerUpload')}>
              <Button
                className="
                  bg-gradient-to-r from-yellow-400 to-green-700 text-black
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:shadow-2xl
                  active:scale-95
                "
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Book
              </Button>
            </Link>
          </div>
        </div>

        {/* ---------- STATS GRID (GLASS) ---------- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="
            grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10
            p-4 md:p-6
            rounded-2xl
          "
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.9, ease: 'easeOut' }
                }
              }}
            >
              <Card
                className="
                  bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg
                  border border-white/20
                  rounded-4xl
                  shadow-md
                  hover:shadow-xl hover:scale-[1.04]
                  transition-all duration-300
                "
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                    </div>
                    <ArrowUpRight className="w-7 h-7 text-black" />
                  </div>

                  <div className="text-4xl font-bold bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                  <div className="text-xs text-amber-800 mt-2">{stat.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ---------- CHARTS & BIDS ---------- */}
        <div className="grid bg-gradient-to-br from-yellow-50 via-white to-green-50 lg:grid-cols-3 gap-6 mb-10">

          {/* Monthly Sales Chart */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex text-2xl items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Monthly Sales
              </CardTitle>
            </CardHeader>

            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>

                  {/* Gradient definition for bars */}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#bbf7d0" />   {/* green-200 */}
                      <stop offset="100%" stopColor="#fef9c3" /> {/* yellow-100 */}
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="sales"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1300}
                    animationEasing="linear"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bid Requests */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex text-2xl items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-600" />
                Bid Requests
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {activeBids.map(bid => (
                <div
                  key={bid.id}
                  className="p-3 bg-gradient-to-br from-green-200 to-yellow-100 backdrop-blur-lg rounded-xl"
                >
                  <p className="font-medium text-sm">{bid.book}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-amber-600">₹{bid.budget}</span>
                    <Badge className="bg-gray-100 text-green-900">
                      {bid.offers} offers
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>


        {/* ---------- RECENT ORDERS ---------- */}
        {/* Wrapper to keep right half blank */}
        <div className="flex w-full">
          
          {/* Left half – Recent Orders */}
          <motion.div
            className="w-full lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <Card className="border border-white/20 shadow-xl bg-white/40 backdrop-blur-xl">
              
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent">
                  Recent Orders
                </CardTitle>

                <Link to={createPageUrl('SellerChat')}>
                  <Button
                    size="sm"
                    className="
                      bg-gradient-to-r from-yellow-400 to-green-700 text-black
                      transition-all duration-300 ease-out
                      hover:scale-110 hover:shadow-2xl
                      active:scale-95
                    "
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentOrders.map(order => (
                  <motion.div
                    key={order.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.35, ease: "easeOut" },
                      },
                    }}
                    className="
                      flex justify-between items-center
                      p-4 rounded-xl
                      bg-gradient-to-br from-green-50 to-yellow-50
                      border border-white/30
                      hover:shadow-lg hover:scale-[1.02]
                      transition-all duration-300
                    "
                  >
                    {/* Left */}
                    <div className="flex gap-4 items-center">
                      <div className="w-11 h-11 bg-gradient-to-br from-yellow-200 to-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-black" />
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">{order.book}</p>
                        <p className="text-sm text-slate-600">
                          Buyer: {order.buyer}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex gap-4 items-center">
                      <p className="font-semibold text-slate-900">
                        ₹{order.amount}
                      </p>

                      <Badge
                        className={
                          order.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : order.status === "ready"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right half – intentionally blank */}
          <div className="hidden lg:block lg:w-1/2" />
        </div>

      </div>
    </div>
  );
}