export interface DocumentMetadata {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    uploadDate: Date;
    chunks: number;
}
export interface Chunk {
    id: string;
    content: string;
    metadata: {
        documentId: string;
        chunkIndex: number;
        startIndex: number;
        endIndex: number;
    };
    embedding?: number[];
}
export interface QAResponse {
    answer: string;
    sources: Chunk[];
    query: string;
}
export interface UploadResponse {
    success: boolean;
    documentId: string;
    filename: string;
    chunks: number;
    message: string;
}
export type VectorStoreType = 'CHROMA' | 'PINECONE';
//# sourceMappingURL=index.d.ts.map