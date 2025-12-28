import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, ShoppingBag, Calendar, User, CheckCircle2, 
  ChevronRight, Gavel, Truck, IndianRupee, MoreVertical, Loader2
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
import axiosSeller from '@/api/axiosSeller';
import { toast } from 'sonner';

export default function SellerOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- FETCH DATA FROM BACKEND ----------------
  const fetchSalesHistory = async () => {
    try {
      const token = localStorage.getItem("sellerAccessToken");
      if (!token) return;

      // Fetch standard sales and bidding offers simultaneously
      const [salesRes, bidsRes] = await Promise.all([
        axiosSeller.get("https://librix-03l6.onrender.com/api/orders/seller/all-orders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosSeller.get("https://librix-03l6.onrender.com/api/bids/seller/accepted-offers", { // Create this in bid controller
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const formattedSales = [
        ...(salesRes.data.orders || []).map(o => ({
          id: o._id,
          type: "standard",
          bookTitle: o.book?.title || "Unknown Book",
          buyerName: o.buyer?.name || "Customer",
          amount: o.amount,
          status: o.status,
          date: o.createdAt,
          image: o.book?.coverImage || o.book?.cover_image
        })),
        ...(bidsRes.data.offers || []).map(b => ({
          id: b._id,
          type: "bid",
          bookTitle: b.bidRequest?.bookName || "Bidding Book",
          buyerName: b.buyer?.name || "Customer",
          amount: b.price,
          status: b.status,
          date: b.updatedAt,
          image: b.bookImage // Cloudinary URL from offer
        }))
      ];

      setOrders(formattedSales.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  // ---------------- LOGIC ----------------
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.type === activeTab;
    const matchesSearch = order.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
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
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Sales History</h1>
              <p className="text-slate-500 mt-2">Manage your direct sales and reverse bidding wins in one place.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search by book or buyer..." 
                className="pl-10 bg-slate-50 border-slate-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-8" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg px-6">All Sales</TabsTrigger>
              <TabsTrigger value="standard" className="rounded-lg px-6">Standard Sale</TabsTrigger>
              <TabsTrigger value="bid" className="rounded-lg px-6">Bidding Wins</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group bg-white">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-44 h-56 md:h-auto relative overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={order.image || "/placeholder-book.png"} 
                            alt="Book" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <Badge className={`absolute top-3 left-3 border-none shadow-sm ${
                            order.type === 'bid' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
                          }`}>
                            {order.type === 'bid' ? <Gavel className="w-3 h-3 mr-1" /> : <ShoppingBag className="w-3 h-3 mr-1" />}
                            {order.type.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900">{order.bookTitle}</h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-500">
                                  <User className="w-3.5 h-3.5" />
                                  <span className="text-sm font-medium">Buyer: {order.buyerName}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-bold capitalize ${getStatusStyle(order.status)}`}>
                                {order.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 bg-slate-50/50 rounded-2xl px-4 border border-slate-100">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Sale ID</span>
                                <span className="text-xs font-mono font-semibold text-slate-700">#{order.id.slice(-6)}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Sold Date</span>
                                <span className="text-sm font-semibold text-slate-700">{new Date(order.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Income</span>
                                <div className="flex items-center text-green-600 font-bold">
                                  <span className="text-xs mr-0.5">₹</span>
                                  <span>{order.amount}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Method</span>
                                <span className="text-sm font-semibold text-slate-700 capitalize">{order.type} Sale</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              {order.status === "delivered" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Truck className="w-4 h-4 text-amber-500" />
                              )}
                              <span>{order.status === "delivered" ? "Payment cleared to wallet" : "Order processing"}</span>
                            </div>
                            <Button variant="ghost" className="text-xs font-bold text-indigo-600">
                              View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No sales found</h3>
                <p className="text-slate-500">Your sales and bidding wins will appear here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}