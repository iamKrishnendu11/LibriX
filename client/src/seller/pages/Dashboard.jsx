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
  Loader2,
  User,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';
import axios from 'axios';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // REAL BACKEND STATES
  const [books, setBooks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const sellerToken = localStorage.getItem("sellerAccessToken");
    const storedUserRaw = localStorage.getItem("sellerUser");

    if (!sellerToken || !storedUserRaw) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUserRaw));
      fetchAllDashboardData(sellerToken);
    }
  }, [navigate]);

  const fetchAllDashboardData = async (token) => {
    try {
      setIsLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // FETCH ALL DATA STREAMS
      const [booksRes, salesRes, bidsWinsRes, openBidsRes] = await Promise.all([
        axios.get('https://librix-03l6.onrender.com/api/books/my-books', config),
        axios.get('https://librix-03l6.onrender.com/api/orders/seller/all-orders', config),
        axios.get('https://librix-03l6.onrender.com/api/bids/seller/accepted-offers', config),
        axios.get('https://librix-03l6.onrender.com/api/bids/all', config)
      ]);

      // 1. SET BOOKS
      setBooks(booksRes.data || []);

      // 2. COMBINE ORDERS & BID WINS FOR RECENT ORDERS
      const allSales = [
        ...(salesRes.data.orders || []).map(o => ({
          id: o._id,
          book: o.book?.title || "Unknown Book",
          buyer: o.buyer?.name || "Customer",
          amount: o.amount,
          status: o.status
        })),
        ...(bidsWinsRes.data.offers || []).map(b => ({
          id: b._id,
          book: b.bidRequest?.bookName || "Bidding Book",
          buyer: b.buyer?.name || "Customer",
          amount: b.price,
          status: b.status
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setRecentOrders(allSales.slice(0, 4));

      // 3. SET OPEN BID REQUESTS (Active Bids Card)
      setActiveBids((openBidsRes.data.bids || []).slice(0, 3));

      // 4. CALCULATE STATS
      const totalRevenue = allSales.reduce((sum, item) => sum + (item.amount || 0), 0);
      const completedOrders = allSales.filter(o => o.status === 'delivered').length;

      setStats([
        { title: 'Books Listed', value: booksRes.data.length.toString(), icon: BookOpen, change: 'Lifetime', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        { title: 'Orders Completed', value: completedOrders.toString(), icon: ShoppingCart, change: 'Lifetime', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, change: 'Lifetime earnings', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'Open Bid Requests', value: (openBidsRes.data.bids || []).length.toString(), icon: Gavel, change: 'Buyer requests', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
      ]);

      // 5. CHART DATA (Aggregating standard sales by month)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const chartData = months.map((m, idx) => ({
        month: m,
        sales: allSales.filter(o => new Date(o.date).getMonth() === idx).length
      }));
      setSalesData(chartData);

    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        
        {/* Header Section */}
        <div className="flex pt-20 flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Welcome back, {user?.name}. Track your sales performance.</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl('SellerBids')}>
              <Button variant="outline" className="relative">
                <Gavel className="w-4 h-4 mr-2" />
                Bid Requests
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">{stats[3]?.value}</Badge>
              </Button>
            </Link>
            <Link to="/seller/uploads">
              <Button className="bg-gradient-to-r from-yellow-400 to-green-700 text-black hover:scale-110 transition-all">
                <Upload className="w-4 h-4 mr-2" />
                Upload Book
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-gradient-to-br from-green-200 to-yellow-100 border-none shadow-md hover:scale-105 transition-all rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}><stat.icon className={`w-6 h-6 ${stat.iconColor}`} /></div>
                  <ArrowUpRight className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Bids */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Monthly Sales Trend</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Gavel className="w-5 h-5 text-amber-600" /> Open Bid Requests</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activeBids.length > 0 ? activeBids.map(bid => (
                <div key={bid._id} className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-semibold text-sm text-slate-800 truncate">{bid.bookName}</p>
                  <p className="text-xs text-slate-500 truncate">{bid.comment}</p>
                </div>
              )) : <p className="text-center text-slate-400 text-sm italic">No open requests</p>}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & My Books */}
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-1 border-none shadow-sm bg-white">
            <CardHeader><CardTitle className="text-xl text-slate-800">Recent Transactions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-indigo-600" /></div>
                    <div className="min-w-0"><p className="font-semibold text-slate-900 truncate">{order.book}</p><p className="text-xs text-slate-500">Buyer: {order.buyer}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">₹{order.amount}</span>
                    <Badge className="capitalize text-[10px]">{order.status}</Badge>
                  </div>
                </div>
              )) : <p className="text-center py-6 text-slate-400 text-sm italic">No recent orders</p>}
            </CardContent>
          </Card>

          <Card className="lg:w-1/3 border-none shadow-sm bg-white">
            <CardHeader><CardTitle className="text-xl flex items-center gap-2">My Books <Badge variant="secondary" className="ml-auto">{books.length}</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {books.slice(0, 3).map((book, idx) => (
                <div key={book._id || idx} className="flex gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={book.coverImage || '/placeholder.png'} alt="Book" className="w-12 h-16 object-cover rounded-md shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{book.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{book.author}</p>
                    <Badge className="mt-2 bg-green-100 text-green-700 text-[10px]">₹{book.price}</Badge>
                  </div>
                </div>
              ))}
              {books.length > 3 && <div className="text-center pt-2"><Link to={createPageUrl('SellerUploads')} className="text-xs font-bold text-green-700">+{books.length - 3} more</Link></div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}