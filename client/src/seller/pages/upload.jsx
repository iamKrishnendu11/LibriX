import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from '@ericblade/quagga2'; // Added for real scanning
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
  ScanBarcode, 
  BookOpen, 
  Upload,
  Loader2,
  IndianRupee,
  Image as ImageIcon,
  FileText,
  Volume2,
  Check,
  User,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function SellerUpload() {
  const navigate = useNavigate();
  const barcodeInputRef = useRef(null);
  const ocrInputRef = useRef(null);
  const coverInputRef = useRef(null); // Ref for manual cover upload
  
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_image: '',
    description: '',
    category: '',
    condition: '',
    publishing_year: '',
    sell_price: ''
  });

  // --- Real Logic Integration ---

  // 1. Fetch from Google Books
  const fetchBookDetails = async (isbn) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();

      if (data.totalItems > 0) {
        const book = data.items[0].volumeInfo;
        setFormData(prev => ({
          ...prev,
          title: book.title || '',
          author: book.authors?.join(", ") || '',
          description:  '',
          category: book.categories?.[0]?.toLowerCase() || '',
          cover_image: book.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
          publishing_year: book.publishedDate?.split("-")[0] || ''
        }));
      } else {
        alert("No book found for this ISBN. Please enter details manually.");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setIsScanningBarcode(false);
    }
  };

  // 2. Real Barcode Scanning with Quagga
  const handleBarcodeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanningBarcode(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      Quagga.decodeSingle({
        src: event.target.result,
        decoder: { readers: ["ean_reader", "code_128_reader"] },
        locate: true,
      }, (result) => {
        if (result && result.codeResult) {
          fetchBookDetails(result.codeResult.code);
        } else {
          alert("Could not detect barcode. Try a clearer photo.");
          setIsScanningBarcode(false);
        }
      });
    };
    reader.readAsDataURL(file);
  };

  // 3. Real Cloudinary Upload for Cover Image
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "librix_unsigned_preset"); // Use your exact preset name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dn7hujmwl/image/upload", {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      handleInputChange('cover_image', fileData.secure_url);
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- End of Real Logic ---

  // Keeping your existing OCR Simulation
  // Replace the handleOCRUpload function in your upload.jsx
const handleOCRUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Keep your existing UI loading states
  setIsProcessingOCR(true);
  setUploadedImagePreview(URL.createObjectURL(file));

  // Prepare the image for the backend API
  const formDataToSend = new FormData();
  formDataToSend.append('image', file);

  try {
    // Call your Node.js backend (running on port 3000)
    const response = await fetch('http://localhost:3000/api/ocr/process', {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) throw new Error("OCR processing failed");

    const data = await response.json();

    // Fill the description field and update preview with real data from Python
    setOcrText(data.text);
    setFormData(prev => ({ 
      ...prev, 
      description: data.text 
    }));

  } catch (error) {
    console.error("OCR Error:", error);
    alert("Python OCR failed. Ensure your backend server and Python environment are running.");
  } finally {
    setIsProcessingOCR(false);
  }
};

  const generateAudio = () => {
    setTimeout(() => setAudioGenerated(true), 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Book uploaded successfully!');
      setFormData({
        title: '', author: '', cover_image: '', description: '',
        category: '', condition: '', publishing_year: '', sell_price: ''
      });
      setOcrText('');
      setAudioGenerated(false);
      setUploadedImagePreview(null);
    }, 1500);
  };

  // Keeping your demo list for the sidebar
  const myBooks = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", publishing_year: 1988, sell_price: 299, status: "available" },
    { id: 2, title: "Atomic Habits", author: "James Clear", cover_image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", publishing_year: 2018, sell_price: 450, status: "available" },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", cover_image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", publishing_year: 2011, sell_price: 599, status: "available" },
    { id: 4, title: "Wings of Fire", author: "APJ Abdul Kalam", cover_image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", publishing_year: 1999, sell_price: 350, status: "sold" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Navbar />
          <div className="mb-8 pt-30">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent mb-2">
              Upload Book for Sale
            </h1>
            <p className="text-slate-500">Add a book to your store inventory</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Barcode Scanner Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center p-6 border-2 border-dashed bg-gradient-to-br from-yellow-200 to-green-400 border-slate-200 rounded-xl">
                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ScanBarcode className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-2xl text-slate-900 mb-2">Scan Book Barcode</h3>
                    <p className="text-sm text-slate-600 mb-4">Upload a photo of the barcode on the back cover</p>
                    <input ref={barcodeInputRef} type="file" accept="image/*" className="hidden" onChange={handleBarcodeUpload} />
                    <Button 
                      onClick={() => barcodeInputRef.current?.click()}
                      disabled={isScanningBarcode}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                      {isScanningBarcode ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                        </span>
                      ) : (
                        <><Upload className="w-4 h-4 mr-2" /> Upload Barcode Image</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* OCR Upload Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center bg-gradient-to-br from-yellow-200 to-green-400 p-6 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-2xl text-slate-900 mb-2">Upload Description Image</h3>
                    <p className="text-sm text-slate-600 mb-4">For old/rare books, upload an image of the book description</p>
                    <input ref={ocrInputRef} type="file" accept="image/*" className="hidden" onChange={handleOCRUpload} />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="bg-gradient-to-r from-yellow-100 to-green-300 text-black hover:from-yellow-200 hover:to-green-400"
                      disabled={isProcessingOCR}
                      onClick={() => ocrInputRef.current?.click()}
                    >
                      {isProcessingOCR ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing OCR...</span>
                      ) : (
                        <><Upload className="w-4 h-4 mr-2" /> Choose from Device</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Book Details Form */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-100 to-green-50">
                <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><BookOpen className="w-8 h-8 text-green-600" /> Book Details</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Preview */}
                    {formData.cover_image && (
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                        <img src={formData.cover_image} alt={formData.title} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                        <div>
                          <h3 className="font-semibold text-slate-900">{formData.title || "Untitled"}</h3>
                          <p className="text-slate-500">{formData.author || "Unknown Author"}</p>
                          <Badge variant="secondary" className="mt-2 capitalize">{formData.category || 'Uncategorized'}</Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Book Title *</Label>
                        <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter book title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input id="author" value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} placeholder="Enter author name" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover_image">Cover Image URL</Label>
                      <div className="flex gap-3">
                        <Input id="cover_image" value={formData.cover_image} onChange={(e) => handleInputChange('cover_image', e.target.value)} placeholder="https://..." className="flex-1" />
                        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="bg-gradient-to-r from-yellow-100 to-green-300"
                          disabled={isUploadingImage}
                          onClick={() => coverInputRef.current?.click()}
                        >
                          {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ImageIcon className="w-4 h-4 mr-2" /> Upload</>}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description">Description</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={generateAudio} disabled={!formData.description}>
                          {audioGenerated ? <span className="flex items-center gap-1 text-green-600"><Check className="w-4 h-4" /> Audio Ready</span> : <><Volume2 className="w-4 h-4 mr-1" /> Generate Audio</>}
                        </Button>
                      </div>
                      <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Brief description of the book..." rows={3} />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="fiction">Fiction</SelectItem>
                            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                            <SelectItem value="self-help">Self-Help</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Condition *</Label>
                        <Select value={formData.condition} onValueChange={(v) => handleInputChange('condition', v)}>
                          <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publishing_year">Publishing Year</Label>
                        <Input id="publishing_year" type="number" value={formData.publishing_year} onChange={(e) => handleInputChange('publishing_year', e.target.value)} placeholder="2020" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sell_price">Selling Price (₹) *</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input id="sell_price" type="number" value={formData.sell_price} onChange={(e) => handleInputChange('sell_price', e.target.value)} placeholder="450" className="pl-9" required />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-yellow-400 to-green-500 hover:from-yellow-500 hover:to-green-600 text-white font-semibold text-base rounded-lg shadow-lg py-6">
                      {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</span> : <><Upload className="w-4 h-4 mr-2" /> List Book for Sale</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar remains the same */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-yellow-50 h-fit sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" /> My Books
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">{myBooks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {myBooks.map((book, index) => (
                      <motion.div key={book.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md">
                        <img src={book.cover_image} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{book.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><User className="w-3 h-3" /> <span className="truncate">{book.author}</span></div>
                          <div className="flex items-center gap-1 mt-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-green-500 text-white text-xs px-2 py-0.5"><IndianRupee className="w-3 h-3 mr-0.5" />{book.sell_price}</Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}