import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Package, 
  Gavel, 
  MessageCircle, 
  Clock,
  CheckCheck,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '@/components/common/EmptyState';
import { NotificationSkeleton } from '@/components/common/LoadingSkeleton';

// Dummy notifications
const sampleNotifications = [
  {
    id: '1',
    title: 'Order Confirmed',
    message: '✅ Your order for "Atomic Habits" has been confirmed. Ready for pickup!',
    type: 'order',
    is_read: false,
    created_date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'New Offer Received',
    message: '🎉 BookWorld submitted an offer of ₹420 for your request "The Design of Everyday Things"',
    type: 'bid',
    is_read: false,
    created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Return Reminder',
    message: '⏰ "Deep Work" is due for return in 2 days. Please return on time.',
    type: 'order',
    is_read: true,
    created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'New Message',
    message: '💬 Rahul Sharma sent you a message about your rental.',
    type: 'chat',
    is_read: true,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function BuyerNotifications() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [isLoading] = useState(false);

  const getIcon = (type) => {
    const icons = {
      order: Package,
      bid: Gavel,
      chat: MessageCircle,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      order: 'bg-blue-100 text-blue-600',
      bid: 'bg-amber-100 text-amber-600',
      chat: 'bg-purple-100 text-purple-600',
      system: 'bg-slate-100 text-slate-600'
    };
    return colors[type] || colors.system;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-slate-500">{unreadCount} unread notifications</p>
            )}
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = getIcon(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
                      !notification.is_read
                        ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500'
                        : 'bg-white'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">

                        <div className={`p-3 rounded-xl ${getIconColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                                New
                              </Badge>
                            )}
                          </div>

                          <p className="text-slate-600 text-sm">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(
                              new Date(notification.created_date),
                              { addSuffix: true }
                            )}
                          </div>
                        </div>

                        {notification.type === 'order' &&
                          notification.title.includes('Confirmed') && (
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4 mr-1" />
                              Directions
                            </Button>
                        )}

                        {notification.type === 'bid' &&
                          !notification.is_read && (
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600"
                            >
                              View Offers
                            </Button>
                        )}
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
            title="No notifications"
            description="You're all caught up! New notifications will appear here."
          />
        )}
      </div>
    </div>
  );
}
