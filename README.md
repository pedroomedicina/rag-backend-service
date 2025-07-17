# RAG Backend Service

A Node.js TypeScript backend service for Retrieval-Augmented Generation (RAG) that processes documents, creates embeddings, and provides AI-powered question answering.

## 🚀 Features

- **Document Processing**: Upload and process PDF and TXT files
- **Text Chunking**: Intelligent text splitting with overlap for better context
- **Vector Storage**: Integration with Chroma and Pinecone vector databases
- **AI Integration**: OpenAI embeddings and chat completions
- **Streaming Responses**: Real-time AI answer streaming
- **REST API**: Clean HTTP endpoints for document upload and Q&A

## 📁 Project Structure

```
rag-backend-service/
├── env.example          # 🔧 Configuration template
├── package.json         # 📦 Dependencies & scripts  
├── tsconfig.json        # ⚙️ TypeScript configuration
├── README.md            # 📖 Project documentation
├── uploads/             # 📂 File storage directory
├── dist/                # 🏗️ Compiled JavaScript (auto-generated)
└── src/
    ├── server.ts        # 🚀 Main Express server
    ├── types/index.ts   # 📝 TypeScript interfaces
    ├── routes/
    │   ├── upload.ts    # 📤 File upload endpoint
    │   └── qa.ts        # ❓ Question-answering endpoint
    └── services/
        └── documentProcessor.ts  # 📄 PDF/TXT processing service
```

## 🎯 File Descriptions

### **Core Server Files**

#### `src/server.ts` - Main Express Server
- **Purpose**: Central web server with middleware configuration
- **Features**: 
  - CORS enabled for cross-origin requests
  - File serving for uploaded documents
  - Global error handling
  - Health check endpoint
- **Endpoints**: 
  - `GET /health` - Server health check
  - `POST /api/upload` - Document upload
  - `POST /api/qa` - Question answering
- **Status**: ✅ Complete and working

#### `src/types/index.ts` - TypeScript Definitions
- **Purpose**: Type safety and interface definitions
- **Defines**:
  - `DocumentMetadata` - File information and metadata
  - `Chunk` - Text chunk with embeddings and metadata
  - `QAResponse` - Question-answer response format
  - `UploadResponse` - File upload response format
  - `VectorStoreType` - Enum for vector database types
- **Status**: ✅ Complete and working

### **API Routes**

#### `src/routes/upload.ts` - Document Upload Handler
- **Purpose**: Handle file uploads and document processing
- **Features**:
  - Multer configuration for file handling
  - File type validation (PDF, TXT only)
  - File size limits (configurable via env)
  - Unique document ID generation
  - Automatic text extraction and chunking
- **Process Flow**:
  1. Validate uploaded file
  2. Generate unique document ID
  3. Extract text content
  4. Split into manageable chunks
  5. Return processing results
- **Status**: ✅ Ready (TODO: Add vector storage)

#### `src/routes/qa.ts` - Question Answering Handler
- **Purpose**: Process user questions and return AI-generated answers
- **Features**:
  - Input validation
  - Error handling
  - Response formatting
- **Planned Flow**:
  1. Validate user query
  2. Convert query to embedding
  3. Search vector database for relevant chunks
  4. Generate AI response with context
  5. Stream response to client
- **Status**: 🚧 Placeholder (TODO: Add vector search + AI)

### **Services**

#### `src/services/documentProcessor.ts` - Document Processing Service
- **Purpose**: Extract and chunk text from uploaded documents
- **Features**:
  - PDF text extraction using `pdf-parse`
  - TXT file reading
  - LangChain text splitter with configurable chunk size/overlap
  - Support for multiple file formats
- **Configuration**:
  - Chunk size: 1000 characters
  - Chunk overlap: 200 characters
- **Status**: ✅ Complete and working

### **Configuration Files**

#### `env.example` - Environment Configuration Template
- **Purpose**: Template for required environment variables
- **Categories**:
  - **OpenAI**: API key for embeddings and completions
  - **Vector Store**: Chroma or Pinecone configuration
  - **Server**: Port and environment settings
  - **File Upload**: Size limits and upload directory
- **Status**: ✅ Complete

#### `tsconfig.json` - TypeScript Configuration
- **Purpose**: TypeScript compiler settings
- **Features**:
  - ES2020 target for modern JavaScript
  - CommonJS modules for Node.js compatibility
  - Strict type checking enabled
  - Source maps for debugging
  - Separate source (`src/`) and output (`dist/`) directories
- **Status**: ✅ Complete

#### `package.json` - Project Dependencies
- **Scripts**:
  - `npm run build` - Compile TypeScript to JavaScript
  - `npm run dev` - Run development server with ts-node
  - `npm start` - Run compiled production server
- **Key Dependencies**:
  - **Express**: Web framework
  - **LangChain**: AI/ML toolkit for text processing
  - **OpenAI**: AI model integration
  - **Multer**: File upload handling
  - **PDF-Parse**: PDF text extraction
  - **ChromaDB/Pinecone**: Vector databases

## 🚦 Current Implementation Status

### ✅ **Working Components**
- File upload system (PDF/TXT support)
- Text extraction from documents
- Intelligent text chunking with overlap
- Basic REST API endpoints
- TypeScript compilation and type safety
- Express server with middleware
- Error handling and validation

### 🚧 **In Progress/TODO**
- Vector database integration (Chroma/Pinecone)
- OpenAI embedding generation
- Vector similarity search
- AI answer generation with context
- Response streaming implementation
- Document metadata storage
- Vector store management

## 📊 RAG Architecture Flow

```
1. Document Upload (PDF/TXT)
   ↓
2. Text Extraction (pdf-parse/fs)
   ↓  
3. Text Chunking (LangChain)
   ↓
4. Generate Embeddings (OpenAI) [TODO]
   ↓
5. Store in Vector DB (Chroma/Pinecone) [TODO]
   ↓
6. User Query → Embedding → Similarity Search [TODO]
   ↓
7. Retrieve Relevant Chunks [TODO]
   ↓
8. Generate AI Answer (OpenAI + Context) [TODO]
   ↓
9. Stream Response to Client [TODO]
```

## 🛠️ Next Implementation Steps

1. **Vector Database Setup**: Configure Chroma or Pinecone integration
2. **Embedding Service**: Implement OpenAI embedding generation
3. **Vector Storage**: Store document chunks with embeddings
4. **Query Processing**: Convert user queries to embeddings
5. **Similarity Search**: Find relevant document chunks
6. **AI Integration**: Generate contextual answers using retrieved chunks
7. **Response Streaming**: Implement real-time response streaming

## 📚 Business Use Cases

- **Document Q&A Systems**: Ask questions about uploaded documents
- **Knowledge Base Search**: Semantic search through document collections
- **Content Analysis**: Extract insights from large document sets
- **Research Assistance**: AI-powered document comprehension
- **Customer Support**: Automated responses based on documentation
- **Educational Tools**: Interactive learning from textbooks/papers 