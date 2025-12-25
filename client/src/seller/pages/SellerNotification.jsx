import React from 'react';
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
  Gavel,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '@/components/common/EmptyState';
import { NotificationSkeleton } from '@/components/common/LoadingSkeleton';
import Navbar from './Navbar';

const sampleNotifications = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'New order for "Clean Code" from Amit Kumar.',
    type: 'order',
    is_read: false,
    created_date: new Date().toISOString(),
    order_id: '123'
  },
  {
    id: '2',
    title: 'Bid Request Match',
    message: 'Buyer looking for "System Design Interview" (₹600 budget).',
    type: 'bid',
    is_read: false,
    created_date: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '₹380 received for "Design Patterns".',
    type: 'subscription',
    is_read: true,
    created_date: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: '4',
    title: 'Bid Request Match',
    message: 'Buyer looking for "System Design Interview" (₹600 budget).',
    type: 'bid',
    is_read: false,
    created_date: new Date(Date.now() - 3600000).toISOString()
  },
];

export default function SellerNotifications() {
  const notifications = sampleNotifications;
  const isLoading = false;

  const getIcon = (type) => {
    const icons = {
      order: Package,
      subscription: IndianRupee,
      chat: MessageCircle,
      bid: Gavel,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <Navbar />
      <div className='pt-30' />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-md">
              Stay updated with your activity
            </p>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <NotificationSkeleton key={i} />)}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n, index) => {
              const Icon = getIcon(n.type);

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.75 }}
                >
                  <Card
                    className={`group relative border transition-all ${
                      n.is_read
                        ? 'bg-white'
                        : 'bg-green-50/40 border-black/20'
                    } hover:shadow-md`}
                  >
                    {/* Unread dot */}
                    {!n.is_read && (
                      <span className="absolute left-3 top-6 h-2 w-2 rounded-full bg-red-500" />
                    )}

                    <CardContent className="p-5 flex gap-4">
                      {/* Icon */}
                      <div className="mt-1">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-slate-600" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-xl text-slate-900">
                              {n.title}
                            </h3>
                            <p className="text-md text-slate-600 mt-1">
                              {n.message}
                            </p>
                          </div>

                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.created_date), {
                              addSuffix: true
                            })}
                          </span>
                        </div>

                        {/* Actions (hover only) */}
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          {n.type === 'order' && !n.is_read && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}

                          {n.type === 'bid' && !n.is_read && (
                            <Button size="sm" className="bg-green-400 hover:bg-green-600">
                              <Gavel className="w-4 h-4 mr-1" />
                              View Bid
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            type="messages"
            title="You're all caught up"
            description="New notifications will appear here."
          />
        )}
      </div>
    </div>
  );
}
