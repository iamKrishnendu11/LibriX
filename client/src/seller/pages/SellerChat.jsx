import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Search,
  IndianRupee,
  Check,
  CheckCheck,
  ArrowLeft,
  MoreVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

/* -------------------- DATA -------------------- */
const sampleConversations = [
  {
    id: '1',
    user_name: 'Amit Kumar',
    last_message: 'Is Clean Code available?',
    last_message_time: new Date().toISOString(),
    unread: 2,
    avatar: 'AK'
  },
  {
    id: '2',
    user_name: 'Priya Sharma',
    last_message: 'I can offer ₹400 for it',
    last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: 0,
    avatar: 'PS'
  }
];

const sampleMessages = [
  { id: '1', sender_id: 'buyer', message: 'Hi, is Clean Code available?', created_date: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '2', sender_id: 'seller', message: 'Yes, it’s available!', created_date: new Date(Date.now() - 28 * 60 * 1000).toISOString() },
  { id: '3', sender_id: 'buyer', message: 'Can you do ₹400?', created_date: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
];

/* ------------------------------------------------ */

export default function SellerChat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(sampleMessages);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender_id: 'seller',
      message,
      created_date: new Date().toISOString()
    }]);
    setMessage('');
  };

  const handleSendOffer = (amount) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender_id: 'seller',
      message: `I can accept ₹${amount}`,
      created_date: new Date().toISOString()
    }]);
  };

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      {/* ================= LEFT SIDEBAR ================= */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-80 lg:w-96 bg-[#f0f2f5] border-r flex flex-col"
      >
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {sampleConversations.map(conv => (
            <motion.button
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedConversation(conv)}
              className="w-full p-4 flex gap-3 text-left items-center hover:bg-[#f5f6f6]"
            >
              <Avatar>
                <AvatarFallback className="bg-green-400 text-black">
                  {conv.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{conv.user_name}</span>
                  <span className="text-xs text-slate-400">
                    {format(new Date(conv.last_message_time), 'HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {conv.last_message}
                </p>
              </div>
            </motion.button>
          ))}
        </ScrollArea>
      </motion.div>

      {/* ================= RIGHT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* -------- EMPTY STATE -------- */}
        {!selectedConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-white flex items-center justify-center"
          >
            <div className="text-center">
              <h2 className="text-5xl font-bold mb-2">Welcome 👋<br />To Librix!</h2>
              <p className="text-slate-500 text-xl">
                Select a chat to start the conversation
              </p>
            </div>
          </motion.div>
        )}

        {/* -------- CHAT VIEW -------- */}
        {selectedConversation && (
          <>
            {/* HEADER */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="h-16 bg-[#f0f2f5] border-b px-4 flex items-center gap-3 sticky top-0 z-30"
            >
              <Avatar>
                <AvatarFallback className="bg-green-400 text-black">
                  {selectedConversation.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedConversation.user_name}</h3>
                <p className="text-xs text-green-600">online</p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedConversation(null)}
              >
                <X />
              </Button>
            </motion.div>

            <div className="flex-1 relative">

  {/* ===== MESSAGES ===== */}
  <ScrollArea
    className="h-full px-4 pt-6 pb-40"
    style={{
      backgroundImage: `url('https://personalmarketingdigital.com.br/wp-content/uploads/2018/05/background-whatsapp-7-1024x640.jpg')`,
      backgroundRepeat: 'repeat'
    }}
  >
    <AnimatePresence>
      {messages.map((msg) => {
        const isSeller = msg.sender_id === 'seller';
        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isSeller ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] shadow
              ${isSeller ? 'bg-[#d9fdd3]' : 'bg-white'}`}
            >
              <p>{msg.message}</p>
              <div className="text-xs flex justify-end gap-1 text-slate-500">
                {format(new Date(msg.created_date), 'HH:mm')}
                {isSeller && <CheckCheck className="w-3 h-3" />}
              </div>
            </div>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </AnimatePresence>
  </ScrollArea>

  {/* ===== QUICK ACTIONS (ON BG IMAGE) ===== */}
  <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className="sticky bottom-20 mb-1 z-20 flex justify-center"
>
  <div className="inline-flex gap-2 bg-white rounded-full px-3 py-1.5 shadow-lg">
    <Button size="sm" variant="outline" className='bg-green-400' onClick={() => handleSendOffer(400)}>
      <Check className="w-3 h-3 mr-1 " /> Accept ₹400
    </Button>
    <Button size="sm" variant="outline" onClick={() => handleSendOffer(420)}>
      <IndianRupee className="w-3 h-3 mr-1" /> Counter ₹420
    </Button>
  </div>
</motion.div>


</div>


            {/* INPUT */}
            <motion.div className="h-16 bg-[#f0f2f5] border-t px-4 flex items-center gap-3">
              <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="rounded-full "
              />
              <Button className='bg-green-400' onClick={handleSendMessage}>
                <Send className="w-4 h-4 " />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
