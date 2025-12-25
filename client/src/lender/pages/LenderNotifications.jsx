import React, { useState } from 'react';
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

/* ✅ Dummy Notifications */
const sampleNotifications = [
  {
    id: '1',
    title: 'New Rental Order',
    message: '📦 "Atomic Habits" has been rented by Amit Kumar. Please pack the book for pickup.',
    type: 'order',
    is_read: false,
    created_date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Book Returned',
    message: '✅ "Deep Work" has been returned by Priya Sharma in good condition.',
    type: 'order',
    is_read: false,
    created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '💰 You received ₹150 for the rental of "The Alchemist".',
    type: 'subscription',
    is_read: true,
    created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Subscription Reminder',
    message: '⏰ Your Basic plan will expire in 5 days. Renew now to continue lending.',
    type: 'subscription',
    is_read: true,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'New Message',
    message: '💬 Rahul Verma sent you a message about "Sapiens".',
    type: 'chat',
    is_read: true,
    created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function LenderNotifications() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type) => {
    const icons = {
      order: Package,
      subscription: IndianRupee,
      chat: MessageCircle,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      order: 'bg-green-300 text-black',
      subscription: 'bg-green-200 text-black',
      chat: 'bg-yellow-200 text-black',
      system: 'bg-yellow-100 text-black'
    };
    return colors[type] || colors.system;
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="flex flex-col items-center">

        {/* Header */}
        <Navbar />
        <div className='pt-20' />
        <div className="w-1/2 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-slate-500 text-md mb-4">
              {unreadCount} unread notifications
            </p>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification Feed */}
        <div className="space-y-6 flex flex-col items-center w-full md:w-[60%]">
          {notifications.map((n, index) => {
            const Icon = getIcon(n.type);

            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.75 }}
                className="w-[75%]"
              >
                <Card
                  className={`group relative border transition-all hover:shadow-md ${
                    n.is_read
                      ? 'bg-white'
                      : 'bg-green-50/60 border-l-4 border-green-300'
                  }`}
                >
                  {/* Unread dot */}
                  {!n.is_read && (
                    <span className="absolute left-3 top-6 h-2 w-2 rounded-full bg-red-500" />
                  )}

                  <CardContent className="p-5 flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${getIconColor(n.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-lg md:text-xl">
                          {n.title}
                        </h3>
                        {!n.is_read && (
                          <Badge className="bg-green-100 text-black text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm md:text-md">{n.message}</p>

                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(n.created_date), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Hover Actions */}
                    {!n.is_read && n.type === 'order' && (
                      <div className="ml-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button size="sm" className="bg-green-400 text-black hover:bg-green-500">
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
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
