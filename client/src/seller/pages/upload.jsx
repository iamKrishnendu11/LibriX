// upload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from '@ericblade/quagga2';
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
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function SellerUpload() {
  const navigate = useNavigate();
  const barcodeInputRef = useRef(null);
  const ocrInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [books, setBooks] = useState([]); // State for real books from backend
  
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

  // --- Real Logic: Fetch Books from Backend ---
const fetchMyBooks = async () => {
  const token = localStorage.getItem('sellerAccessToken'); 

  if (!token) {
    console.warn("No token found for fetching books");
    return;
  }

  try {
    const response = await fetch('https://librix-03l6.onrender.com/api/books/my-books', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Ensure there is a space after Bearer
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Books received:", data); // Check your console to see if data arrives
      setBooks(data); 
    } else {
      console.error("Failed to fetch books:", response.status);
    }
  } catch (error) {
    console.error("Network error fetching books:", error);
  }
};

  useEffect(() => {
    fetchMyBooks();
  }, []);

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
          category: book.categories?.[0]?.toLowerCase() || '',
          cover_image: book.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
          publishing_year: book.publishedDate?.split("-")[0] || ''
        }));
      } else {
        alert("No book found for this ISBN.");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setIsScanningBarcode(false);
    }
  };

  // 2. Barcode Scanning
  const handleBarcodeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanningBarcode(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      Quagga.decodeSingle({
        src: event.target.result,
        decoder: { readers: ["ean_reader", "code_128_reader"] },
      }, (result) => {
        if (result && result.codeResult) fetchBookDetails(result.codeResult.code);
        else { alert("Could not detect barcode."); setIsScanningBarcode(false); }
      });
    };
    reader.readAsDataURL(file);
  };

  // 3. Cloudinary Upload
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
    } catch (err) { alert("Image upload failed."); } finally { setIsUploadingImage(false); }
  };

  // 4. OCR Integration
  const handleOCRUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingOCR(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', file);
    try {
      const response = await fetch('https://librix-03l6.onrender.com/api/ocr/process', {
        method: 'POST', body: formDataToSend,
      });
      if (!response.ok) throw new Error("OCR processing failed");
      const data = await response.json();
      setFormData(prev => ({ ...prev, description: data.extractedText }));
    } catch (error) {
      alert("Python OCR failed. Ensure backend and Python are running.");
    } finally { setIsProcessingOCR(false); }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 5. Form Submission to Backend
 // Inside your handleSubmit function in upload.jsx
// upload.jsx
// Inside upload.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Use the exact key name you saved during login
  const token = localStorage.getItem('sellerAccessToken'); 

  try {
    const response = await fetch('https://librix-03l6.onrender.com/api/books/add', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Critical: Ensure a space exists after 'Bearer'
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          publishingYear: formData.publishing_year,
          price: formData.sell_price,
          coverImage: formData.cover_image
      }),
    });

    if (response.status === 401 || response.status === 403) {
       alert("Session expired. Please login again.");
       return navigate('/seller/login');
    }

    if (response.ok) {
      alert('Book uploaded successfully!');
      setFormData({ title: '', author: '', cover_image: '', description: '', category: '', condition: '', publishing_year: '', sell_price: '' });
      fetchMyBooks(); 
    }
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    setIsSubmitting(false);
  }
};
  const generateAudio = () => {
    setTimeout(() => setAudioGenerated(true), 1500);
  };

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
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                    >
                      {isScanningBarcode ? <Loader2 className="animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Upload Barcode Image</>}
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
                      className="bg-gradient-to-r from-yellow-100 to-green-300 text-black"
                      disabled={isProcessingOCR}
                      onClick={() => ocrInputRef.current?.click()}
                    >
                      {isProcessingOCR ? <Loader2 className="animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Choose from Device</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Book Details Form */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-100 to-green-50">
                <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><BookOpen className="w-8 h-8 text-green-600" /> Book Details</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formData.cover_image && (
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                        <img src={formData.cover_image} alt="preview" className="w-24 h-32 object-cover rounded-lg shadow-md" />
                        <div>
                          <h3 className="font-semibold">{formData.title || "Untitled"}</h3>
                          <p className="text-slate-500">{formData.author || "Unknown Author"}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Book Title *</Label>
                        <Input value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Author *</Label>
                        <Input value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cover Image URL</Label>
                      <div className="flex gap-3">
                        <Input value={formData.cover_image} onChange={(e) => handleInputChange('cover_image', e.target.value)} className="flex-1" />
                        <input ref={coverInputRef} type="file" className="hidden" onChange={handleCoverUpload} />
                        <Button type="button" variant="outline" className="bg-gradient-to-r from-yellow-100 to-green-300" onClick={() => coverInputRef.current?.click()}>
                          {isUploadingImage ? <Loader2 className="animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={generateAudio} disabled={!formData.description}>
                          {audioGenerated ? <Check className="w-4 h-4 text-green-600" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="fiction">Fiction</SelectItem>
                            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                            <SelectItem value="self-help">Self-Help</SelectItem>
                            <SelectItem value="biography">Biography</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Condition *</Label>
                        <Select value={formData.condition} onValueChange={(v) => handleInputChange('condition', v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input type="number" value={formData.publishing_year} onChange={(e) => handleInputChange('publishing_year', e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Selling Price (₹) *</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="number" value={formData.sell_price} onChange={(e) => handleInputChange('sell_price', e.target.value)} className="pl-9" required />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold py-6">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> List Book for Sale</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Real-time Sidebar showing Backend Data */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-yellow-50 h-fit sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" /> My Books
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">{books.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {books.map((book, index) => (
                      <motion.div key={book._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md">
                        <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">{book.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><User className="w-3 h-3" /> <span className="truncate">{book.author}</span></div>
                          <div className="flex items-center gap-1 mt-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-green-500 text-white text-xs px-2 py-0.5"><IndianRupee className="w-3 h-3 mr-0.5" />{book.price}</Badge>
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