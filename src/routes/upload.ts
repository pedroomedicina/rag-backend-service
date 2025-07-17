import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentProcessor } from '../services/documentProcessor';
import { VectorStoreService } from '../services/vectorStore';
import { UploadResponse } from '../types';

const router = express.Router();
const documentProcessor = new DocumentProcessor();
const vectorStore = new VectorStoreService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

// POST /api/upload - Upload and process document
router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const documentId = uuidv4();
    const filePath = req.file.path;
    const filename = req.file.originalname;

    // Process the document
    const { content, chunks } = await documentProcessor.processDocument(filePath, filename);

    // Store chunks in vector database
    await vectorStore.addDocumentChunks(documentId, chunks, {
      filename: req.file.filename,
      originalName: filename
    });

    const response: UploadResponse = {
      success: true,
      documentId,
      filename,
      chunks: chunks.length,
      message: `Document processed successfully. Created ${chunks.length} chunks.`
    };

    res.json(response);

  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process document'
    });
  }
});

export { router as uploadRoutes }; 