// controllers/book.controller.js
import Book from "../models/book.model.js";
import Seller from "../models/seller.model.js";
import { spawn } from "child_process";
import path from "path";

// --- 1. OCR Tool (Optional Utility) ---
export const processOCR = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded for OCR." });

  // Correcting the path to your ocr.py script
  const scriptPath = path.join(process.cwd(), 'ocr_feature', 'ocr.py');
  const imagePath = req.file.path; 

  const pythonProcess = spawn('python', [scriptPath, imagePath]);

  let result = "";
  pythonProcess.stdout.on('data', (data) => (result += data.toString()));
  
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ success: true, extractedText: result.trim() });
    } else {
      res.status(500).json({ error: "OCR failed to process image." });
    }
  });
};

// --- 2. List Book (Final Submission) ---
// controllers/book.controller.js
// controllers/book.controller.js
export const createBook = async (req, res) => {
  try {
    // Use req.sellerId assigned by sellerProtect middleware
    const bookData = { ...req.body, seller: req.sellerId }; 
    const newBook = await Book.create(bookData);

    // Update the Seller's inventory array
    await Seller.findByIdAndUpdate(req.sellerId, { 
      $push: { inventory: newBook._id } 
    });

    res.status(201).json({ success: true, book: newBook });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. View, Update, and Delete ---
export const getMyBooks = async (req, res) => {
  const books = await Book.find({ seller: req.sellerId });
  res.status(200).json(books);
};

export const updateBook = async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedBook);
};

export const deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Book removed" });
};

export const getBooksForSale = async (req, res) => {
  try {
    // This only fetches from the Book collection (Sellers)
    const books = await Book.find().populate('seller', 'shopName'); 
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};