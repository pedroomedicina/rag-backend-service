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

### ✅ **Fully Working Components**
- File upload system (PDF/TXT support)
- Text extraction from documents
- Intelligent text chunking with overlap
- **Vector database integration (Chroma)**
- **OpenAI embedding generation**
- **Vector similarity search**
- **AI answer generation with context**
- **Complete RAG pipeline**
- REST API endpoints
- TypeScript compilation and type safety
- Express server with middleware
- Error handling and validation
- Document metadata storage
- Vector store management

### 🚧 **Future Enhancements**
- Response streaming implementation
- Document deletion from vector store
- Multiple vector store support (Pinecone)
- Advanced filtering and search options
- User authentication and authorization
- Rate limiting and caching

## 📊 RAG Architecture Flow

```
1. Document Upload (PDF/TXT) ✅
   ↓
2. Text Extraction (pdf-parse/fs) ✅
   ↓  
3. Text Chunking (LangChain) ✅
   ↓
4. Generate Embeddings (OpenAI) ✅
   ↓
5. Store in Vector DB (Chroma) ✅
   ↓
6. User Query → Embedding → Similarity Search ✅
   ↓
7. Retrieve Relevant Chunks ✅
   ↓
8. Generate AI Answer (OpenAI + Context) ✅
   ↓
9. Return Response to Client ✅
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Docker Desktop (for Chroma database)
- OpenAI API key

### **Installation & Setup**

1. **Clone and install dependencies:**
   ```bash
   cd rag-backend-service
   npm install
   ```

2. **Start Chroma database:**
   ```bash
   docker run -d -p 8000:8000 chromadb/chroma:latest
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Build and start the server:**
   ```bash
   npm run build
   npm run dev
   ```

### **Testing the API**

1. **Upload a document:**
   ```bash
   curl -X POST http://localhost:3000/api/upload \
     -F "document=@your-file.pdf"
   ```

2. **Ask questions:**
   ```bash
   curl -X POST http://localhost:3000/api/qa \
     -H "Content-Type: application/json" \
     -d '{"query": "What is the main topic of the document?"}'
   ```

## 🧪 Testing Strategy

### **Manual Testing**
1. **Health Check**: `GET /health`
2. **Document Upload**: Test with PDF and TXT files
3. **Q&A Functionality**: Ask various questions about uploaded content
4. **Error Handling**: Test with invalid files, malformed requests

### **Automated Testing**
- Unit tests for document processing
- Integration tests for vector store operations
- API endpoint testing
- Error scenario validation

### **Performance Testing**
- Large document processing
- Concurrent upload handling
- Vector search performance
- Memory usage monitoring

## 📚 Business Use Cases

- **Document Q&A Systems**: Ask questions about uploaded documents
- **Knowledge Base Search**: Semantic search through document collections
- **Content Analysis**: Extract insights from large document sets
- **Research Assistance**: AI-powered document comprehension
- **Customer Support**: Automated responses based on documentation
- **Educational Tools**: Interactive learning from textbooks/papers

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Vector Store Configuration
VECTOR_STORE_TYPE=CHROMA
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads
``` 