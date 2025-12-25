import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  BookOpen, 
  Check, 
  Upload,
  AlertCircle,
  Loader2,
  IndianRupee,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';


export default function LenderUpload() {
  const navigate = useNavigate();

  const [isbn, setIsbn] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [bookFound, setBookFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadCount = 12;
  const uploadLimit = 20;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_image: '',
    description: '',
    category: '',
    condition: '',
    rent_price_per_week: ''
  });

  const fetchBookDetails = () => {
    if (!isbn) return;
    setIsFetching(true);
    setTimeout(() => {
      setFormData({
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        category: 'non-fiction',
        condition: '',
        rent_price_per_week: ''
      });
      setBookFound(true);
      setIsFetching(false);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(createPageUrl('LenderDashboard'));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-16">
      <motion.div 
        className="w-[75%] max-w-3xl space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      >

        {/* Header */}
        <Navbar />
        <div className='pt-20'/>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-black">
            Upload Your Book
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Add books to your lending collection like a pro
          </p>
        </motion.div>

        {/* Upload Limit */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-semibold">Upload Limit</span>
            <Badge className="bg-green-100 text-green-700">{uploadCount}/{uploadLimit} books</Badge>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 via-yellow-300 to-orange-400 transition-all duration-500" 
                 style={{ width: `${(uploadCount/uploadLimit)*100}%` }} />
          </div>
          {uploadCount >= uploadLimit && (
            <p className="text-yellow-700 mt-2 flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5" /> Upgrade plan to upload more
            </p>
          )}
        </motion.div>

        {/* ISBN Search */}
        <motion.div
          whileHover={{ scale: 1.01, boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <CardHeader className="p-0 mb-3">
            <CardTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
              <Search className="w-5 h-5" /> Find Book by ISBN
            </CardTitle>
          </CardHeader>
          <div className="flex gap-3">
            <Input 
              placeholder="Enter ISBN number"
              value={isbn}
              onChange={(e)=>setIsbn(e.target.value)}
              className="focus:ring-green-300 focus:border-green-400"
            />
            <Button
              onClick={fetchBookDetails}
              disabled={!isbn || isFetching}
              className="bg-green-600 hover:bg-green-700"
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
            </Button>
          </div>
          <AnimatePresence>
            {bookFound && (
              <motion.div 
                initial={{ opacity:0, y:-10 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }}
                className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2 text-green-800 font-semibold shadow-inner"
              >
                <Check className="w-5 h-5"/> Book found! Auto-filled below
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Book Details Form */}
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
        >
          <Card className="bg-white rounded-3xl shadow-2xl p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
                <BookOpen className="w-5 h-5" /> Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Book Preview */}
                {formData.cover_image && (
                  <motion.div
                    whileHover={{ rotateY: 10, rotateX: 2, scale: 1.03 }}
                    className="flex gap-4 bg-green-50 p-4 rounded-2xl shadow-md border border-green-100 transition-transform duration-500"
                  >
                    <img src={formData.cover_image} alt={formData.title} className="w-24 h-32 rounded-lg shadow-lg object-cover"/>
                    <div>
                      <h3 className="font-bold text-gray-900">{formData.title}</h3>
                      <p className="text-gray-600">{formData.author}</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800 capitalize">{formData.category || 'Uncategorized'}</Badge>
                    </div>
                  </motion.div>
                )}

                {/* Form Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Title *</Label>
                    <Input value={formData.title} onChange={(e)=>handleInputChange('title', e.target.value)} required/>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Author *</Label>
                    <Input value={formData.author} onChange={(e)=>handleInputChange('author', e.target.value)} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Cover Image URL</Label>
                  <div className="flex gap-3">
                    <Input value={formData.cover_image} onChange={(e)=>handleInputChange('cover_image', e.target.value)}/>
                    <Button type="button" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                      <ImageIcon className="w-4 h-4 mr-2"/> Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Description</Label>
                  <Textarea rows={3} value={formData.description} onChange={(e)=>handleInputChange('description', e.target.value)}/>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Category *</Label>
                    <Select value={formData.category} onValueChange={(v)=>handleInputChange('category', v)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="self-help">Self-Help</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(v)=>handleInputChange('condition', v)}>
                      <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Rental Price per Week (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400"/>
                    <Input type="number" className="pl-9" value={formData.rent_price_per_week} onChange={(e)=>handleInputChange('rent_price_per_week', e.target.value)} required/>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || uploadCount>=uploadLimit}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 py-5 text-white font-bold rounded-2xl shadow-xl transform transition-all hover:scale-105"
                >
                  {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</span> : <span className="flex items-center gap-2"><Upload className="w-4 h-4"/> Upload Book</span>}
                </Button>

              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
