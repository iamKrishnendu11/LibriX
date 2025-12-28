import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, BookOpen, Calendar, IndianRupee, User, AlertTriangle, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from './Navbar';
import axios from 'axios'; // Use your lender axios instance if you have one
import { toast } from 'sonner';

export default function LenderOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  const fetchLenderOrders = async () => {
    try {
      const token = localStorage.getItem("lenderAccessToken");
      if (!token) return;

      const res = await axios.get("https://librix-03l6.onrender.com/api/rent-orders/lender/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching lender orders:", error);
      toast.error("Failed to load rental history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLenderOrders();
  }, []);

  // ---------------- LOGIC ----------------
  const filteredOrders = orders.filter(order => {
    const status = order.status.toLowerCase();
    const matchesTab = activeTab === "all" || status === activeTab;
    const matchesSearch = (order.book?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (order.buyer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': 
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) return <div className="text-center mt-40">Loading your history...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Rental History</h1>
              <p className="text-slate-500 mt-2">Manage your lent books and track upcoming returns.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search by book or borrower..." 
                className="pl-10 bg-slate-50 border-slate-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-8" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg px-6">All Rentals</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg px-6">Active</TabsTrigger>
              <TabsTrigger value="delivered" className="rounded-lg px-6">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div key={order._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group bg-white">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-44 h-56 md:h-auto relative overflow-hidden bg-slate-100">
                          <img 
                            src={order.book?.coverImage || order.book?.cover_image} 
                            alt="Book" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 border-none backdrop-blur-md">
                            {order.durationWeeks} Weeks
                          </Badge>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                                  {order.book?.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-500">
                                  <User className="w-3.5 h-3.5" />
                                  <span className="text-sm font-medium">Borrower: {order.buyer?.name}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-bold capitalize ${getStatusStyle(order.status)}`}>
                                {order.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 bg-slate-50/50 rounded-2xl px-4 border border-slate-100">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Order ID</span>
                                <span className="text-xs font-mono font-semibold text-slate-700">#{order._id.slice(-8)}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Lent Date</span>
                                <span className="text-sm font-semibold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Due Date</span>
                                <span className="text-sm font-semibold text-slate-700">{new Date(order.dueDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Earnings</span>
                                <div className="flex items-center text-green-600 font-bold">
                                  <span className="text-xs mr-0.5">₹</span>
                                  <span>{order.amount}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span>Verified Rental Agreement</span>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                              View Agreement <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No rentals found</h3>
                <p className="text-slate-400">Your rental history will appear here once someone borrows your books.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}