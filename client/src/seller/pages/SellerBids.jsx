import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Clock, 
  User,
  Send,
  MessageCircle,
  Check,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '@/components/common/EmptyState';
import Navbar from './Navbar';
import { toast } from 'sonner';

export default function SellerBids() {
  const [bidRequests, setBidRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerDialog, setOfferDialog] = useState(false);
  
  const [offerData, setOfferData] = useState({
    price: '',
    condition: '',
    message: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  // 1. FETCH ALL OPEN BIDS
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get('https://librix-03l6.onrender.com/api/bids/all');
        if (response.data.success) {
          setBidRequests(response.data.bids);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast.error("Failed to load bid requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBids();
  }, []);

  // 2. HANDLE IMAGE SELECTION
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferData({ ...offerData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. SUBMIT OFFER TO BACKEND
  const handleSubmitOffer = async () => {
    try {
      const token = localStorage.getItem("sellerAccessToken");
      if (!token) {
        toast.error("Please log in as a seller to submit offers");
        return;
      }

      const formData = new FormData();
      formData.append('bidId', selectedRequest._id);
      formData.append('buyerId', selectedRequest.buyer._id); // Needed for notification
      formData.append('bookName', selectedRequest.bookName); // Needed for notification title
      formData.append('price', offerData.price);
      formData.append('condition', offerData.condition);
      formData.append('message', offerData.message);
      
      if (offerData.image) {
        formData.append('image', offerData.image); // Matches upload.single("image") in route
      }

      const response = await axios.post(
        'https://librix-03l6.onrender.com/api/bids/create-offer',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Required for files
          }
        }
      );

      if (response.data.success) {
        toast.success("Offer sent to buyer! Notification sent.");
        setOfferDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error("Submit Offer Error:", error);
      toast.error(error.response?.data?.message || "Failed to send offer");
    }
  };

  const resetForm = () => {
    setOfferData({ price: '', condition: '', message: '', image: null });
    setImagePreview(null);
  };

  if (isLoading) return <div className="text-center mt-20">Loading bid requests...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <Navbar />

      <div className='md:pt-30' />
      <div className="bg-gradient-to-br rounded-[2.5rem] md:w-[80%] mx-auto from-yellow-400 to-green-300 text-black pt-[30px] w-full shadow-lg">
        <div className="mx-auto w-[75%] max-w-[1100px] px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gavel className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-4xl font-bold">Bid Requests</h1>
            </div>
            <p className="text-black/70 font-medium">Buyers are looking for these books. Submit your offer to win the sale!</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-[80%] px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 place-items-center">
          <Card className="border-0 shadow-md w-full h-[140px] flex items-center justify-center">
            <CardContent className="text-center">
              <div className="text-7xl font-bold">{bidRequests.length}</div>
              <div className="text-sm text-slate-500 mt-1">Open Requests</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {bidRequests.map((request, index) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-800">{request.bookName}</h3>
                      <p className="text-sm text-slate-600 mt-2 italic">"{request.comment}"</p>
                      <div className="flex gap-4 text-sm mt-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" /> 
                          {request.buyer?.name || "Interested Buyer"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end gap-3">
                      <Button
                        className="bg-green-500 hover:bg-green-400 text-white w-full md:w-auto font-bold px-6"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOfferDialog(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" /> Submit Offer
                      </Button>
                      <Button variant="outline" size="sm" className="w-full md:w-auto border-slate-200">
                        <MessageCircle className="w-4 h-4 mr-2" /> Chat with Buyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {bidRequests.length === 0 && <EmptyState type="search" title="No bid requests" description="Check back later." />}
        </div>
      </div>

      {/* OFFER POPUP DIALOG */}
      <Dialog open={offerDialog} onOpenChange={(open) => { setOfferDialog(open); if(!open) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Send className="w-5 h-5 text-green-500" />
              Submit Your Offer
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 pt-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Book Name</p>
                <p className="text-sm font-semibold text-slate-800">{selectedRequest.bookName}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Book Photo</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="book-image-upload"
                  />
                  <label
                    htmlFor="book-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all overflow-hidden"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Upload book condition image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
                  <Input
                    placeholder="500"
                    type="number"
                    value={offerData.price}
                    onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                    className="rounded-lg h-10 focus:ring-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Condition</label>
                  <Select value={offerData.condition} onValueChange={(v) => setOfferData({ ...offerData, condition: v })}>
                    <SelectTrigger className="rounded-lg h-10 focus:ring-green-400">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Acceptable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Comments</label>
                <textarea
                  placeholder="Tell the buyer about the book..."
                  value={offerData.message}
                  onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                  className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[80px]"
                />
              </div>

              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white h-11 rounded-lg font-bold transition-all shadow-md active:scale-95"
                disabled={!offerData.price || !offerData.condition || !offerData.image}
                onClick={handleSubmitOffer}
              >
                <Check className="w-4 h-4 mr-2" />
                Submit My Offer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}