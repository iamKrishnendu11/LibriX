import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/lender/pages/Navbar";
import { 
  BookOpen, 
  IndianRupee, 
  TrendingUp,
  Upload,
  Eye,
  Clock,
  ArrowUpRight,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import lenderAxios from '@/api/axiosLender';
import { toast } from 'sonner';

export default function LenderDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    revenueData: [],
    categoryData: [],
    recentRentals: []
  });

  // ---------------- FETCH DASHBOARD DATA ----------------
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("lenderAccessToken");
      if (!token) return;

      // ✅ Fetching both orders and aggregated analytics
      const [ordersRes, analyticsRes] = await Promise.all([
      lenderAxios.get("http://localhost:3000/api/rent-orders/lender/orders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        lenderAxios.get("http://localhost:3000/api/rent-orders/lender/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders;

        // 1. Calculate Stats
        const totalLent = orders.length;
        const activeRentals = orders.filter(o => o.status === 'pending' || o.status === 'active').length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        
        // 2. Format Category Data
        const categories = {};
        orders.forEach(o => {
          const cat = o.book?.category || 'Other';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        const formattedCategories = Object.keys(categories).map((cat, i) => ({
          name: cat,
          value: categories[cat],
          color: ['#10b981', '#f59e0b', '#6366f1', '#8b5cf6', '#94a3b8'][i % 5]
        }));

        // 3. Update Stats Array
        const statsArr = [
          { title: 'Total Books Lent', value: totalLent.toString(), icon: BookOpen, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', change: 'Lifetime' },
          { title: 'Active Rentals', value: activeRentals.toString(), icon: Eye, bgColor: 'bg-purple-50', iconColor: 'text-purple-600', change: 'Currently out' },
          { title: 'Revenue Earned', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, bgColor: 'bg-green-50', iconColor: 'text-green-600', change: 'Total earnings' },
          { title: 'Recent Activity', value: orders.length > 0 ? 'Active' : 'None', icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-600', change: 'Last updated' },
        ];

        setDashboardData({
          stats: statsArr,
          revenueData: analyticsRes.data.revenueData || [], // ✅ Live data from backend
          categoryData: formattedCategories,
          recentRentals: orders.slice(0, 4)
        });
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error("Failed to sync dashboard analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-30 gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent">Lender Dashboard</h1>
            <p className="text-slate-500">Track your real-time book rentals and earnings</p>
          </div>
          <Link to={createPageUrl('LenderUpload')}>
            <Button className="bg-gradient-to-r from-yellow-400 to-green-700 text-black transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl active:scale-95">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Book
            </Button>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardData.stats.map((stat) => (
            <motion.div key={stat.title} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="bg-gradient-to-br from-green-200 to-yellow-100 border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <Card className="border-none shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  {dashboardData.revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <BarChart3 className="w-8 h-8 opacity-20" />
                      <p className="text-sm italic">Aggregate revenue data will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-none shadow-md bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-700" />
                  Lent by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.categoryData.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dashboardData.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {dashboardData.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 w-full px-4">
                      {dashboardData.categoryData.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs font-medium text-slate-600 truncate">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data available</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Rentals List */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">Recent Transactions</CardTitle>
            <Link to={createPageUrl("LenderOrders")}>
              <Button variant="ghost" size="sm" className="text-green-700">View All History</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {dashboardData.recentRentals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.recentRentals.map((rental) => (
                  <div key={rental._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{rental.book?.title}</p>
                      <p className="text-xs text-slate-500 truncate">Buyer: {rental.buyer?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={rental.status === "delivered" ? "bg-green-100 text-green-700 border-none" : "bg-amber-100 text-amber-700 border-none"}>
                        {rental.status === "delivered" ? "Completed" : "Active"}
                      </Badge>
                      <div className="text-right font-bold text-slate-900 text-sm">₹{rental.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-sm">No recent transactions found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}