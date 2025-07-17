import express from 'express';
import { OpenAI } from 'openai';
import { VectorStoreService } from '../services/vectorStore';
import { QAResponse } from '../types';

const router = express.Router();
const vectorStore = new VectorStoreService();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/qa - Ask questions about uploaded documents
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query is required and must be a string'
      });
    }

    // 1. Search vector database for relevant chunks
    const relevantChunks = await vectorStore.searchSimilarChunks(query, 5);

    if (relevantChunks.length === 0) {
      return res.json({
        answer: "I couldn't find any relevant information in the uploaded documents to answer your question.",
        sources: [],
        query
      });
    }

    // 2. Prepare context from relevant chunks
    const context = relevantChunks
      .map((chunk, index) => `[${index + 1}] ${chunk.content}`)
      .join('\n\n');

    // 3. Generate AI response using OpenAI
    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context from uploaded documents. 

Instructions:
- Use only the information provided in the context to answer questions
- If the context doesn't contain enough information to answer the question, say so
- Be concise but thorough in your responses
- Reference the source information when possible

Context:
${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    const answer = completion.choices[0]?.message?.content || "I couldn't generate a response.";

    const response: QAResponse = {
      answer,
      sources: relevantChunks,
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