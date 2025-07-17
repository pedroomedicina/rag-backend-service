"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const documentProcessor_1 = require("../services/documentProcessor");
const vectorStore_1 = require("../services/vectorStore");
const router = express_1.default.Router();
exports.uploadRoutes = router;
const documentProcessor = new documentProcessor_1.DocumentProcessor();
const vectorStore = new vectorStore_1.VectorStoreService();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.txt'];
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(fileExtension)) {
            cb(null, true);
        }
        else {
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
        const documentId = (0, uuid_1.v4)();
        const filePath = req.file.path;
        const filename = req.file.originalname;
        // Process the document
        const { content, chunks } = await documentProcessor.processDocument(filePath, filename);
        // Store chunks in vector database
        await vectorStore.addDocumentChunks(documentId, chunks, {
            filename: req.file.filename,
            originalName: filename
        });
        const response = {
            success: true,
            documentId,
            filename,
            chunks: chunks.length,
            message: `Document processed successfully. Created ${chunks.length} chunks.`
        };
        res.json(response);
    }
    catch (error) {
        console.error('Upload processing error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to process document'
        });
    }
});
//# sourceMappingURL=upload.js.map