import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Demo books data
  const myBooks = [
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      publishing_year: 1988,
      sell_price: 299,
      status: "available"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover_image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      publishing_year: 2018,
      sell_price: 450,
      status: "available"
    },
    {
      id: 3,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover_image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
      publishing_year: 2011,
      sell_price: 599,
      status: "available"
    },
    {
      id: 4,
      title: "Wings of Fire",
      author: "APJ Abdul Kalam",
      cover_image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      publishing_year: 1999,
      sell_price: 350,
      status: "sold"
    }
  ];

  // Handle barcode image upload
  const handleBarcodeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanningBarcode(true);
    
    // Create image preview URL
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate barcode scanning with demo data
    setTimeout(() => {
      setFormData({
        ...formData,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        cover_image: imageUrl,
        description: 'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        category: 'technology',
        publishing_year: '2008'
      });
      setIsScanningBarcode(false);
    }, 2000);
  };

  // Handle OCR image upload from system
  const handleOCRUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessingOCR(true);
    setUploadedImagePreview(URL.createObjectURL(file));
    
    // Simulate OCR processing with demo data
    setTimeout(() => {
      const extractedText = 'This vintage book contains classic literature from the early 20th century. First edition, printed in 1925. Includes original illustrations by the author. A must-have for collectors and literature enthusiasts.';
      setOcrText(extractedText);
      setFormData({
        ...formData,
        description: extractedText
      });
      setIsProcessingOCR(false);
    }, 2500);
  };

  const generateAudio = () => {
    setTimeout(() => {
      setAudioGenerated(true);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Book uploaded successfully!');
      // Reset form
      setFormData({
        title: '', author: '', cover_image: '', description: '',
        category: '', condition: '', publishing_year: '', sell_price: ''
      });
      setOcrText('');
      setAudioGenerated(false);
      setUploadedImagePreview(null);
    }, 1500);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Navbar />
          <div className="mb-8 pt-30">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-green-700 bg-clip-text text-transparent mb-2">
              Upload Book for Sale
            </h1>
            <p className="text-slate-500">Add a book to your store inventory</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Upload Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Barcode Scanner Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center p-6 border-2 border-dashed bg-gradient-to-br from-yellow-200 to-green-400 border-slate-200 rounded-xl">
                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ScanBarcode className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-2xl text-slate-900 mb-2">Scan Book Barcode</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a photo of the barcode on the back cover
                    </p>
                    <input 
                      ref={barcodeInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleBarcodeUpload}
                    />
                    <Button 
                      onClick={() => barcodeInputRef.current?.click()}
                      disabled={isScanningBarcode}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                      {isScanningBarcode ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Barcode Image
                        </>
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
                    <p className="text-sm text-slate-600 mb-4">
                      For old/rare books, upload an image of the book description from your device
                    </p>
                    <input 
                      ref={ocrInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleOCRUpload}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="bg-gradient-to-r from-yellow-100 to-green-300 text-black hover:from-yellow-200 hover:to-green-400"
                      disabled={isProcessingOCR}
                      onClick={() => ocrInputRef.current?.click()}
                    >
                      {isProcessingOCR ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing OCR...
                        </span>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose from Device
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Uploaded Image Preview & OCR Text */}
                  {(uploadedImagePreview || ocrText) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-4"
                    >
                      {uploadedImagePreview && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <Label className="text-sm text-slate-500 mb-2 block">Uploaded Image</Label>
                          <img 
                            src={uploadedImagePreview} 
                            alt="Uploaded" 
                            className="max-h-40 rounded-lg mx-auto"
                          />
                        </div>
                      )}
                      {ocrText && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <Label className="text-sm text-slate-500 mb-2 block">OCR Extracted Text</Label>
                          <Textarea 
                            value={ocrText}
                            onChange={(e) => setOcrText(e.target.value)}
                            rows={3}
                            className="bg-white"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
              
              {/* Book Details Form */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-100 to-green-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-green-600" />
                    Book Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Preview */}
                    {formData.cover_image && (
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                        <img 
                          src={formData.cover_image} 
                          alt={formData.title}
                          className="w-24 h-32 object-cover rounded-lg shadow-md"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900">{formData.title}</h3>
                          <p className="text-slate-500">{formData.author}</p>
                          <Badge variant="secondary" className="mt-2 capitalize">
                            {formData.category || 'Uncategorized'}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Book Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Enter book title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => handleInputChange('author', e.target.value)}
                          placeholder="Enter author name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover_image">Cover Image URL</Label>
                      <div className="flex gap-3">
                        <Input
                          id="cover_image"
                          value={formData.cover_image}
                          onChange={(e) => handleInputChange('cover_image', e.target.value)}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" className="bg-gradient-to-r from-yellow-100 to-green-300">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description">Description</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={generateAudio}
                          disabled={!formData.description}
                        >
                          {audioGenerated ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Check className="w-4 h-4" />
                              Audio Ready
                            </span>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 mr-1" />
                              Generate Audio
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of the book..."
                        rows={3}
                      />
                    </div>
                    
                    {audioGenerated && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 rounded-lg flex items-center gap-3"
                      >
                        <Button type="button" size="sm" variant="outline" className="gap-2">
                          <Volume2 className="w-4 h-4" />
                          Play Preview
                        </Button>
                        <span className="text-sm text-green-700">Audio description generated successfully</span>
                      </motion.div>
                    )}
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select 
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fiction">Fiction</SelectItem>
                            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                            <SelectItem value="self-help">Self-Help</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="biography">Biography</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="children">Children</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Condition *</Label>
                        <Select 
                          value={formData.condition}
                          onValueChange={(value) => handleInputChange('condition', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publishing_year">Publishing Year</Label>
                        <Input
                          id="publishing_year"
                          type="number"
                          value={formData.publishing_year}
                          onChange={(e) => handleInputChange('publishing_year', e.target.value)}
                          placeholder="2020"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sell_price">Selling Price (₹) *</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="sell_price"
                          type="number"
                          value={formData.sell_price}
                          onChange={(e) => handleInputChange('sell_price', e.target.value)}
                          placeholder="450"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-400 to-green-500 hover:from-yellow-500 hover:to-green-600 text-white font-semibold text-base rounded-lg shadow-lg shadow-green-500/25 transition-all duration-300 text-black py-6"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          List Book for Sale
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - My Books */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-yellow-50 h-fit sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    My Books
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                      {myBooks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {myBooks.map((book, index) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <img
                          src={book.cover_image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">
                            {book.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{book.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{book.publishing_year || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-green-500 text-white text-xs px-2 py-0.5">
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              {book.sell_price}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs capitalize ${
                                book.status === 'sold' 
                                  ? 'border-red-200 text-red-600 bg-red-50' 
                                  : 'border-green-200 text-green-600 bg-green-50'
                              }`}
                            >
                              {book.status || 'available'}
                            </Badge>
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