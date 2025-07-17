"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStoreService = void 0;
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const openai_1 = require("@langchain/openai");
class VectorStoreService {
    constructor() {
        this.embeddings = new openai_1.OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small'
        });
        this.chroma = new chroma_1.Chroma(this.embeddings, {
            collectionName: 'rag-documents',
            url: `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT}`,
            collectionMetadata: {
                'hnsw:space': 'cosine'
            }
        });
    }
    async addDocumentChunks(documentId, chunks, metadata) {
        try {
            // Convert chunks to LangChain documents with metadata
            const documents = chunks.map((chunk, index) => ({
                pageContent: chunk,
                metadata: {
                    documentId,
                    chunkIndex: index,
                    filename: metadata.filename,
                    originalName: metadata.originalName,
                    source: `${metadata.originalName}#chunk-${index}`
                }
            }));
            // Generate unique IDs for each chunk
            const ids = chunks.map((_, index) => `${documentId}-chunk-${index}`);
            // Add documents to Chroma
            await this.chroma.addDocuments(documents, { ids });
            console.log(`✅ Added ${chunks.length} chunks to vector store for document ${documentId}`);
        }
        catch (error) {
            console.error('Error adding chunks to vector store:', error);
            throw new Error(`Failed to store document chunks: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchSimilarChunks(query, topK = 5) {
        try {
            // Perform similarity search
            const results = await this.chroma.similaritySearchWithScore(query, topK);
            // Convert LangChain documents back to our Chunk interface
            const chunks = results.map(([doc, score]) => ({
                id: doc.metadata.source || 'unknown',
                content: doc.pageContent,
                metadata: {
                    documentId: doc.metadata.documentId,
                    chunkIndex: doc.metadata.chunkIndex,
                    startIndex: 0, // We don't track character positions yet
                    endIndex: doc.pageContent.length
                },
                embedding: undefined, // We don't return embeddings in search results
                score: 1 - score // Convert distance to similarity score (higher = more similar)
            }));
            console.log(`🔍 Found ${chunks.length} similar chunks for query: "${query}"`);
            return chunks;
        }
        catch (error) {
            console.error('Error searching vector store:', error);
            throw new Error(`Failed to search similar chunks: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteDocument(documentId) {
        try {
            // Note: Chroma doesn't have a direct way to delete by metadata filter
            // We would need to implement a more sophisticated approach for production
            console.log(`🗑️ Document deletion requested for ${documentId}`);
            // For now, we'll log this - in production you'd want to:
            // 1. Query for all chunks with this documentId
            // 2. Delete them by their IDs
        }
        catch (error) {
            console.error('Error deleting document from vector store:', error);
            throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getCollectionInfo() {
        try {
            // This is a placeholder - Chroma client doesn't expose collection info directly through LangChain
            return {
                count: 0,
                collectionName: 'rag-documents'
            };
        }
        catch (error) {
            console.error('Error getting collection info:', error);
            return { count: 0, collectionName: 'rag-documents' };
        }
    }
}
exports.VectorStoreService = VectorStoreService;
//# sourceMappingURL=vectorStore.js.map