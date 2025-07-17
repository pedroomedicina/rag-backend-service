import express from 'express';
import { QAResponse } from '../types';

const router = express.Router();

// POST /api/qa - Ask questions about uploaded documents
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query is required and must be a string'
      });
    }

    // TODO: Implement vector search and AI response
    // This will include:
    // 1. Convert query to embedding
    // 2. Search vector database for relevant chunks
    // 3. Use AI to generate answer based on context
    // 4. Stream the response

    const response: QAResponse = {
      answer: "This is a placeholder response. Vector search and AI integration will be implemented next.",
      sources: [],
      query
    };

    res.json(response);

  } catch (error) {
    console.error('QA processing error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process query'
    });
  }
});

export { router as qaRoutes }; 