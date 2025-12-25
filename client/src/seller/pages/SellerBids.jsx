import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Gavel, 
  IndianRupee, 
  Clock, 
  User,
  Send,
  MessageCircle,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import EmptyState from '@/components/common/EmptyState';
import Navbar from './Navbar';

// ✅ Dummy bid requests data
const sampleBidRequests = [
  {
    id: '1',
    book_title: 'System Design Interview',
    author: 'Alex Xu',
    buyer_name: 'Amit Kumar',
    max_budget: 600,
    description: 'Looking for the second edition in good condition',
    status: 'open',
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    my_offer: null
  },
  {
    id: '2',
    book_title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    buyer_name: 'Priya Sharma',
    max_budget: 500,
    description: 'Need this for upcoming interviews. Any edition works.',
    status: 'offers_received',
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    my_offer: { price: 450, condition: 'good', status: 'pending' }
  },
  {
    id: '3',
    book_title: 'Clean Architecture',
    author: 'Robert C. Martin',
    buyer_name: 'Rahul Verma',
    max_budget: 550,
    description: 'Prefer hardcover but paperback also fine',
    status: 'open',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    my_offer: null
  }
];

export default function SellerBids() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerDialog, setOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    price: '',
    condition: '',
    message: ''
  });

  // ✅ Using dummy data directly
  const bidRequests = sampleBidRequests;
  const isLoading = false;

  const handleSubmitOffer = () => {
    console.log('Submitting offer:', offerData);
    setOfferDialog(false);
    setOfferData({ price: '', condition: '', message: '' });
  };

  const getStatusBadge = (status, myOffer) => {
    if (myOffer) {
      if (myOffer.status === 'accepted') {
        return <Badge className="bg-green-100 text-green-700">Offer Accepted</Badge>;
      }
      return <Badge className="bg-indigo-100 text-indigo-700">Offer Sent</Badge>;
    }

    const styles = {
      open: 'bg-blue-100 text-blue-700',
      offers_received: 'bg-amber-100 text-amber-700',
      accepted: 'bg-green-100 text-green-700',
      closed: 'bg-slate-100 text-slate-700'
    };

    const labels = {
      open: 'Open',
      offers_received: 'Has Offers',
      accepted: 'Accepted',
      closed: 'Closed'
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Header */}
      <Navbar />

      {/* HERO */}
      <div className='md:pt-30' />
      <div className="bg-gradient-to-br rounded-[2.5rem] md:w-[80%] mx-auto from-yellow-400 to-green-300 text-black pt-[30px] w-full">
  <div className="mx-auto w-[75%] max-w-[1100px] px-4 py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Gavel className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-4xl font-bold">
          Bid Requests
        </h1>
      </div>

      <p className="text-black/70">
        Buyers are looking for these books. Submit your offer to win the sale!
      </p>
    </motion.div>
  </div>
</div>




      {/* MAIN CONTENT — 80% */}
      <div className="mx-auto w-[80%] px-4 py-10">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 place-items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0 }}
            className="w-full"
          >
            <Card className="border-0 shadow-md w-full h-[140px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-7xl font-bold">
                  {bidRequests.length}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Open Requests
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full"
          >
            <Card className="border-0 shadow-sm w-full h-[140px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-7xl font-bold">
                  {bidRequests.filter(r => r.my_offer).length}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  My Offers
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full"
          >
            <Card className="border-0 shadow-sm w-full h-[140px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-7xl font-bold">
                  2
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Won Bids
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>


        {/* BID LIST */}
        <div className="space-y-6">
          {bidRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -80 : 80
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2, delay: index * 0.15 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(
                            new Date(request.created_date),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold">
                        {request.book_title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        by {request.author}
                      </p>

                      <p className="text-sm text-slate-600 mt-2">
                        "{request.description}"
                      </p>

                      <div className="flex gap-4 text-sm mt-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" /> {request.buyer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Expires {format(
                            new Date(request.expires_at),
                            "MMM d"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-3">
                      <div>
                        <div className="text-sm text-slate-500">
                          Max Budget
                        </div>
                        <div className="text-2xl font-bold text-green-500 flex items-center justify-end">
                          <IndianRupee className="w-5 h-5" />
                          {request.max_budget}
                        </div>
                      </div>

                      {!request.my_offer && (
                        <Button
                          className="bg-green-500 hover:bg-green-400 hover:text-black mr-5"
                          onClick={() => {
                            setSelectedRequest(request);
                            setOfferDialog(true);
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Offer
                        </Button>
                      )}

                      <Button variant="outline" size="sm" >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with Buyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {bidRequests.length === 0 && (
            <EmptyState
              type="search"
              title="No bid requests"
              description="Check back later for new book requests."
            />
          )}
        </div>
      </div>

      {/* OFFER DIALOG */}
      <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Offer</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <Input
                placeholder="Your price"
                type="number"
                value={offerData.price}
                onChange={(e) =>
                  setOfferData({ ...offerData, price: e.target.value })
                }
              />

              <Select
                value={offerData.condition}
                onValueChange={(v) =>
                  setOfferData({ ...offerData, condition: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Message (optional)"
                value={offerData.message}
                onChange={(e) =>
                  setOfferData({ ...offerData, message: e.target.value })
                }
              />

              <Button
                className="w-full bg-amber-500"
                disabled={!offerData.price || !offerData.condition}
                onClick={handleSubmitOffer}
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Offer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
