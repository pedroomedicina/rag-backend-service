import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { Chunk } from '../types';

interface StoredChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    documentId: string;
    chunkIndex: number;
    filename: string;
    originalName: string;
    source: string;
  };
}

export class VectorStoreService {
  private static instance: VectorStoreService | null = null;
  private embeddings: OpenAIEmbeddings;
  private chunks: StoredChunk[] = [];

  private constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small'
    });
  }

  public static getInstance(): VectorStoreService {
    if (!VectorStoreService.instance) {
      VectorStoreService.instance = new VectorStoreService();
    }
    return VectorStoreService.instance;
  }

  async addDocumentChunks(
    documentId: string, 
    chunks: string[], 
    metadata: { filename: string; originalName: string }
  ): Promise<void> {
    try {
      console.log(`🔄 Processing ${chunks.length} chunks for embedding...`);
      
      // Generate embeddings for all chunks
      const embeddings = await this.embeddings.embedDocuments(chunks);
      
      // Store chunks with embeddings
      for (let i = 0; i < chunks.length; i++) {
        const chunkId = `${documentId}-chunk-${i}`;
        const storedChunk: StoredChunk = {
          id: chunkId,
          content: chunks[i],
          embedding: embeddings[i],
          metadata: {
            documentId,
            chunkIndex: i,
            filename: metadata.filename,
            originalName: metadata.originalName,
            source: `${metadata.originalName}#chunk-${i}`
          }
        };
        
        // Remove any existing chunks with the same ID
        this.chunks = this.chunks.filter(c => c.id !== chunkId);
        this.chunks.push(storedChunk);
      }

      console.log(`✅ Added ${chunks.length} chunks to in-memory vector store for document ${documentId}`);
      console.log(`📊 Total chunks in store: ${this.chunks.length}`);
    } catch (error) {
      console.error('Error adding chunks to vector store:', error);
      throw new Error(`Failed to store document chunks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchSimilarChunks(query: string, topK: number = 5): Promise<Chunk[]> {
    try {
      if (this.chunks.length === 0) {
        console.log('No chunks available for search');
        return [];
      }

      console.log(`🔍 Searching ${this.chunks.length} chunks for query: "${query}"`);
      
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      // Calculate cosine similarity for each chunk
      const similarities = this.chunks.map(chunk => ({
        chunk,
        similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
      }));
      
      // Debug: Show all similarity scores
      console.log('All similarity scores:');
      similarities.forEach((item, index) => {
        console.log(`  Chunk ${index}: ${item.similarity.toFixed(4)} - "${item.chunk.content.substring(0, 50)}..."`);
      });
      
      // Sort by similarity (highest first) and take top K
      const topResults = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
      
      // Convert to our Chunk interface
      const results: Chunk[] = topResults.map(({ chunk, similarity }) => ({
        id: chunk.id,
        content: chunk.content,
        metadata: {
          documentId: chunk.metadata.documentId,
          chunkIndex: chunk.metadata.chunkIndex,
          startIndex: 0,
          endIndex: chunk.content.length
        },
        embedding: undefined, // Don't return embeddings in search results
        score: similarity
      }));

      console.log(`🎯 Found ${results.length} similar chunks (scores: ${results.map(r => r.score?.toFixed(3)).join(', ')})`);
      return results;
    } catch (error) {
      console.error('Error searching vector store:', error);
      throw new Error(`Failed to search similar chunks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length');
    }
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const beforeCount = this.chunks.length;
      this.chunks = this.chunks.filter(chunk => chunk.metadata.documentId !== documentId);
      const deletedCount = beforeCount - this.chunks.length;
      console.log(`🗑️ Deleted ${deletedCount} chunks for document ${documentId}`);
    } catch (error) {
      console.error('Error deleting document from vector store:', error);
      throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCollectionInfo(): Promise<{ count: number; collectionName: string }> {
    try {
      return {
        count: this.chunks.length,
        collectionName: 'in-memory-store'
      };
    } catch (error) {
      console.error('Error getting collection info:', error);
      return { count: 0, collectionName: 'in-memory-store' };
    }
  }
} 