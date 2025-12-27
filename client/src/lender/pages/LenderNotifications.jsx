import React, { useState, useEffect } from 'react';
import lenderAxios from '@/api/axiosLender';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Package,
  IndianRupee,
  MessageCircle,
  Clock,
  CheckCheck,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Navbar from './Navbar';

export default function LenderNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Notifications from Backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await lenderAxios.get('http://localhost:3000/api/rent-orders/lender/notifications', {
          withCredentials: true // If using cookies/sessions
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    const icons = {
      order_request: Package,
      payment: IndianRupee,
      chat: MessageCircle,
      order_update: Bell
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      order_request: 'bg-green-300 text-black',
      payment: 'bg-green-200 text-black',
      chat: 'bg-yellow-200 text-black',
      order_update: 'bg-yellow-100 text-black'
    };
    return colors[type] || 'bg-slate-100';
  };

  const markAllAsRead = async () => {
    try {
      await lenderAxios.put('http://localhost:3000/api/notifications/mark-all-read', {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading notifications...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="flex flex-col items-center">
        <Navbar />
        <div className='pt-20' />
        <div className="w-1/2 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Notifications</h1>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        </div>

        <div className="space-y-6 flex flex-col items-center w-full md:w-[60%]">
          {notifications.map((n, index) => {
            const Icon = getIcon(n.type);

            return (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-[75%]"
              >
                <Card className={`group relative border transition-all hover:shadow-md ${n.isRead ? 'bg-white' : 'bg-green-50/60 border-l-4 border-green-300'}`}>
                  {!n.isRead && <span className="absolute left-3 top-6 h-2 w-2 rounded-full bg-red-500" />}

                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getIconColor(n.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-lg md:text-xl">{n.title}</h3>
                        {!n.isRead && <Badge className="bg-green-100 text-black text-xs">New</Badge>}
                      </div>
                      <p className="text-slate-600 text-sm md:text-md">{n.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </div>
                    </div>

                    {/* ✅ CONDITIONAL BUTTON LOGIC */}
                    {/* Only show buttons if the recipient is a 'seller' (Buying flow) */}
                    {/* Hide buttons if recipient is 'lender' (Rental flow) */}
                    {!n.isRead && n.recipientModel === 'seller' && n.type === 'order_request' && (
                      <div className="ml-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button size="sm" className="bg-green-400 text-black hover:bg-green-500">
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    )}

                    {/* Optional: Show Auto-Confirmed badge for Lenders */}
                    {n.recipientModel === 'lender' && n.type === 'order_request' && (
                       <Badge variant="outline" className="text-green-600 border-green-200">Auto-Confirmed</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}