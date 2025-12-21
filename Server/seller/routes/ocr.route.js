import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ dest: 'uploads/temp/' });

// Ensure temp directory exists
if (!fs.existsSync('uploads/temp/')) {
    fs.mkdirSync('uploads/temp/', { recursive: true });
}

router.post('/process', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image provided' });

        // 1. Upload to Cloudinary using your preset
        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'book_descriptions',
            upload_preset: 'librix_unsigned_preset' //
        });

        // 2. Execute Python OCR script
        const scriptPath = path.resolve('ocr_feature/ocr.py');
        const pythonProcess = spawn('python', [scriptPath, req.file.path]);

        let output = "";
        pythonProcess.stdout.on('data', (data) => output += data.toString());
        
        pythonProcess.on('close', (code) => {
            // Clean up local temp file
            fs.unlinkSync(req.file.path);

            if (code !== 0) return res.status(500).json({ error: 'OCR processing failed' });

            // Return Cloudinary URL and Extracted Text
            res.json({ 
                text: output.trim(),
                imageUrl: cloudResult.secure_url 
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;