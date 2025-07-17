export declare class DocumentProcessor {
    private textSplitter;
    constructor();
    processDocument(filePath: string, filename: string): Promise<{
        content: string;
        chunks: string[];
    }>;
    private extractTextFromPDF;
    private extractTextFromTXT;
}
//# sourceMappingURL=documentProcessor.d.ts.map