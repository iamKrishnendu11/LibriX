import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { 
  Bell, Package, IndianRupee, Gavel, Check, X 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import buyerAxios from "@/api/axiosBuyer";
import { getSocket } from "@/socket";

import Navbar from './Navbar';
import EmptyState from '@/components/common/EmptyState';
import { NotificationSkeleton } from '@/components/common/LoadingSkeleton';
import { toast } from 'sonner';

export default function BuyerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- FETCH NOTIFICATIONS ----------------
  // ... imports ...
  const fetchNotifications = async () => {
    const token = localStorage.getItem("buyerAccessToken");
    if (!token) return;

    try {
      const res = await buyerAxios.get(
        "https://librix-03l6.onrender.com/api/orders/buyer/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ PREVENT OVERWRITE: Keep handled status if server hasn't updated yet
      setNotifications(prev => {
        return res.data.map(newN => {
          const existingN = prev.find(p => p._id === newN._id);
          if (existingN && existingN.orderStatus !== "pending" && newN.orderStatus === "pending") {
            return { ...newN, orderStatus: existingN.orderStatus };
          }
          return newN;
        });
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
// ... rest of component ...

  // ---------------- HANDLE OFFER RESPONSE ----------------
  const handleOfferAction = async (notification, action) => {
    try {
      const res = await buyerAxios.post("https://librix-03l6.onrender.com/api/bids/respond-offer", {
        offerId: notification.orderId,
        action: action
      });

      if (res.data.success) {
        toast.success(`Offer ${action}ed!`);
        
        // ✅ IMMEDIATE LOCAL UPDATE: Update the state so buttons disappear instantly
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, orderStatus: action === 'accept' ? 'accepted' : 'declined' } : n
        ));
      }
    } catch (error) {
      toast.error("Failed to process offer");
    }
  };

  // ---------------- INITIAL LOAD + POLLING ----------------
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // Polling every 5 seconds as a fallback
    return () => clearInterval(interval);
  }, []);

  // ---------------- SOCKET.IO REALTIME ----------------
  useEffect(() => {
    const socket = getSocket("buyer");
    if (!socket) return;

    const handleNewNotification = () => {
      fetchNotifications();
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, []);

  const getIcon = (type) => {
    const icons = {
      order_request: Package,
      payment: IndianRupee,
      order_update: Bell,
      bid: Gavel,
    };
    return icons[type] || Bell;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <Navbar />
      <div className="pt-30" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-5xl font-bold text-slate-900 mb-8">Notifications</h1>

        {isLoading ? (
          <div className="space-y-4"><NotificationSkeleton /></div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = getIcon(n.type);
              const isOffer = n.title.includes("Offer");

              return (
                <motion.div key={n._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className={`relative border transition-all ${n.isRead ? "bg-white" : "bg-green-50/40 border-green-200"}`}>
                    <CardContent className="p-5 flex gap-4">
                      <div className="mt-1 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-slate-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-xl">{n.title}</h3>
                          <span className="text-xs text-slate-400">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>

                        <p className="text-slate-600 mt-1">{n.message}</p>

                        {/* ✅ UPDATED OFFER UI SECTION */}
                        {isOffer && (
                          <div className="mt-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex gap-4">
                              <div className="w-20 h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                {n.imageUrl ? (
                                   <img src={n.imageUrl} alt="Book" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Package /></div>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                {/* ✅ CHECK STATUS: If status is 'pending', show buttons. Otherwise, show text. */}
                                {n.orderStatus === "pending" ? (
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleOfferAction(n, "accept")}
                                      className="bg-green-500 hover:bg-green-600 text-white flex-1 h-10"
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      onClick={() => handleOfferAction(n, "decline")}
                                      variant="outline" 
                                      className="text-red-500 border-red-200 flex-1 h-10"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                ) : (
                                  <p className={`text-lg font-bold ${n.orderStatus === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>
                                    You {n.orderStatus} the order
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {n.orderStatus && !isOffer && (
                          <p className="mt-3 text-sm font-medium text-slate-600">
                            Order status: <span className="capitalize">{n.orderStatus}</span>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState type="messages" title="No notifications yet" />
        )}
      </div>
    </div>
  );
}