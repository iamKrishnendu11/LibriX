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
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Added for your logic

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- YOUR CLOUDINARY LOGIC INTEGRATED ---
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "librix_unsigned_preset"); 
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dn7hujmwl/image/upload", {
        method: "POST", body: data,
      });
      const fileData = await res.json();
      handleInputChange('cover_image', fileData.secure_url);
    } catch (err) { 
      alert("Image upload failed."); 
    } finally { 
      setIsUploadingImage(false); 
    }
  };

  // --- REAL GOOGLE BOOKS API FETCH ---
  const fetchBookDetails = async () => {
    if (!isbn) return;
    setIsFetching(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await res.json();
      if (data.totalItems > 0) {
        const book = data.items[0].volumeInfo;
        setFormData(prev => ({
          ...prev,
          title: book.title || '',
          author: book.authors?.join(", ") || '',
          description: book.description || '',
          category: book.categories?.[0]?.toLowerCase() || '',
          cover_image: book.imageLinks?.thumbnail?.replace("http:", "https:") || prev.cover_image
        }));
        setBookFound(true);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://librix-03l6.onrender.com/api/lend-books/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lenderAccessToken')}`
        },
        body: JSON.stringify({ ...formData, isbn })
      });
      const result = await response.json();
      if (result.success) navigate(createPageUrl('LenderDashboard'));
    } catch (error) {
      alert("Upload to backend failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-16">
      <motion.div className="w-[75%] max-w-3xl space-y-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
        <Navbar />
        <div className='pt-20'/>
        
        {/* Header/Limit sections remain unchanged from your screenshots */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-black">Upload Your Book</h1>
          <p className="text-gray-500 mt-2 text-lg">Add books to your lending collection like a pro</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-semibold">Upload Limit</span>
            <Badge className="bg-green-100 text-green-700">{uploadCount}/{uploadLimit} books</Badge>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 via-yellow-300 to-orange-400" style={{ width: `${(uploadCount/uploadLimit)*100}%` }} />
          </div>
        </div>

        {/* ISBN Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <CardHeader className="p-0 mb-3"><CardTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold"><Search className="w-5 h-5" /> Find Book by ISBN</CardTitle></CardHeader>
          <div className="flex gap-3">
            <Input placeholder="Enter ISBN number" value={isbn} onChange={(e)=>setIsbn(e.target.value)} />
            <Button onClick={fetchBookDetails} disabled={!isbn || isFetching} className="bg-green-600 hover:bg-green-700">
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
            </Button>
          </div>
          {bookFound && <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2 text-green-800 font-semibold shadow-inner"><Check className="w-5 h-5"/> Book found! Auto-filled below</div>}
        </div>

        {/* Form Section */}
        <Card className="bg-white rounded-3xl shadow-2xl p-6">
          <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold"><BookOpen className="w-5 h-5" /> Book Details</CardTitle></CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={formData.title} onChange={(e)=>handleInputChange('title', e.target.value)} required/></div>
                <div className="space-y-2"><Label>Author *</Label><Input value={formData.author} onChange={(e)=>handleInputChange('author', e.target.value)} required/></div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <div className="flex gap-3">
                  <Input value={formData.cover_image} onChange={(e)=>handleInputChange('cover_image', e.target.value)}/>
                  <input type="file" id="cover-upload" className="hidden" onChange={handleCoverUpload} accept="image/*" />
                  <Button asChild type="button" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                    <label htmlFor="cover-upload" className="flex items-center cursor-pointer">
                      {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <ImageIcon className="w-4 h-4 mr-2"/>} Upload
                    </label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={formData.description} onChange={(e)=>handleInputChange('description', e.target.value)}/></div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
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
                  <Label>Condition *</Label>
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
                <Label>Rental Price per Week (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400"/>
                  <Input type="number" className="pl-9" value={formData.rent_price_per_week} onChange={(e)=>handleInputChange('rent_price_per_week', e.target.value)} required/>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting || isUploadingImage} className="w-full bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 py-5 text-white font-bold rounded-2xl shadow-xl transform transition-all hover:scale-105">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Upload className="w-4 h-4 mr-2"/>} Upload Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}