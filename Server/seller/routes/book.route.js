// routes/book.routes.js
import express from "express";
import { createBook, getMyBooks, updateBook, deleteBook, processOCR, getBooksForSale} from "../controllers/book.controller.js";
import { sellerProtect } from "../middlewares/auth.middleware.js";
import upload from "../../configs/multer.js"; 

const router = express.Router();

// OCR Route: Call this when "Upload Description Image" is clicked
router.post("/process-ocr", sellerProtect, upload.single('descriptionImage'), processOCR);

// Standard CRUD Routes
router.post("/add", sellerProtect, createBook);
router.get("/my-books", sellerProtect, getMyBooks);
router.put("/edit/:id", sellerProtect, updateBook);
router.delete("/delete/:id", sellerProtect, deleteBook);

router.get("/for-sale", getBooksForSale);

export default router;