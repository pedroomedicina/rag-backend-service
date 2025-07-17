"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const text_splitter_1 = require("langchain/text_splitter");
class DocumentProcessor {
    constructor() {
        this.textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });
    }
    async processDocument(filePath, filename) {
        const fileExtension = path_1.default.extname(filename).toLowerCase();
        let content;
        if (fileExtension === '.pdf') {
            content = await this.extractTextFromPDF(filePath);
        }
        else if (fileExtension === '.txt') {
            content = await this.extractTextFromTXT(filePath);
        }
        else {
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }
        const chunks = await this.textSplitter.splitText(content);
        return { content, chunks };
    }
    async extractTextFromPDF(filePath) {
        const dataBuffer = fs_1.default.readFileSync(filePath);
        const data = await (0, pdf_parse_1.default)(dataBuffer);
        return data.text;
    }
    async extractTextFromTXT(filePath) {
        return fs_1.default.readFileSync(filePath, 'utf-8');
    }
}
exports.DocumentProcessor = DocumentProcessor;
//# sourceMappingURL=documentProcessor.js.map