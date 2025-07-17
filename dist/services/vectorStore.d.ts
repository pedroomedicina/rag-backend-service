import { Chunk } from '../types';
export declare class VectorStoreService {
    private chroma;
    private embeddings;
    constructor();
    addDocumentChunks(documentId: string, chunks: string[], metadata: {
        filename: string;
        originalName: string;
    }): Promise<void>;
    searchSimilarChunks(query: string, topK?: number): Promise<Chunk[]>;
    deleteDocument(documentId: string): Promise<void>;
    getCollectionInfo(): Promise<{
        count: number;
        collectionName: string;
    }>;
}
//# sourceMappingURL=vectorStore.d.ts.map