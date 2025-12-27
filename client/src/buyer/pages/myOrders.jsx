import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  ShoppingBag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from './Navbar';
import buyerAxios from '../../api/axiosBuyer'; // Using your existing axios instance
import { BookCardSkeleton } from '@/components/common/LoadingSkeleton';
import { toast } from 'sonner';

export default function BuyerOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------ FETCH ORDERS FROM BACKEND ------------------
  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("buyerAccessToken");
      if (!token) return;

      // Fetching both regular orders and accepted bidding offers
      const [ordersRes, offersRes] = await Promise.all([
        buyerAxios.get('http://localhost:3000/api/orders/my-orders'),
        buyerAxios.get('http://localhost:3000/api/bids/my-accepted-offers')
      ]);

      const formattedOrders = [
        ...(ordersRes.data.orders || []).map(o => ({
          id: o._id,
          type: o.orderType || "purchase", // purchase or rental
          bookTitle: o.bookId?.title || "Unknown Book",
          author: o.bookId?.author || "Unknown Author",
          price: o.totalAmount || o.price,
          status: o.status,
          date: o.createdAt,
          image: o.bookId?.coverImage || o.bookId?.cover_image,
          dueDate: o.returnDate || null
        })),
        ...(offersRes.data.offers || []).map(off => ({
          id: off._id,
          type: "bid",
          bookTitle: off.bidRequest?.bookName || "Bidding Book",
          author: `Seller: ${off.seller?.name || 'Private Seller'}`,
          price: off.price,
          status: off.status,
          date: off.updatedAt,
          image: off.bookImage // The Cloudinary URL from the offer
        }))
      ];

      setOrders(formattedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your order history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.type === activeTab;
    const matchesSearch = order.bookTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': 
      case 'accepted': 
      case 'fulfilled': return 'bg-green-100 text-green-700 border-green-200';
      case 'active':
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'declined':
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="pt-28 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Orders</h1>
              <p className="text-slate-500 mt-2">Manage your purchases, rentals, and winning bids.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search by book name..." 
                className="pl-10 bg-slate-50 border-slate-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-8" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg px-6">All</TabsTrigger>
              <TabsTrigger value="purchase" className="rounded-lg px-6">Purchases</TabsTrigger>
              <TabsTrigger value="rental" className="rounded-lg px-6">Rentals</TabsTrigger>
              <TabsTrigger value="bid" className="rounded-lg px-6">Bids</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <BookCardSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-48 h-56 bg-slate-200 relative shrink-0">
                            <img 
                              src={order.image || "/placeholder-book.png"} 
                              alt={order.bookTitle} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className={`${order.type === 'purchase' ? 'bg-indigo-500' : order.type === 'rental' ? 'bg-orange-500' : 'bg-emerald-500'} text-white border-none`}>
                                {order.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900">{order.bookTitle}</h3>
                                  <p className="text-slate-500 text-sm">{order.author}</p>
                                </div>
                                <Badge variant="outline" className={`px-3 py-1 capitalize ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Package className="w-4 h-4" />
                                  <span>ID: ...{order.id.slice(-6)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                  <span className="text-slate-400">₹</span>
                                  <span>{order.price}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verified Transaction</span>
                              </div>
                              <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                                Details <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">No orders here</h3>
                  <p className="text-slate-400">You haven't made any {activeTab !== 'all' ? activeTab : ''} orders yet.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}