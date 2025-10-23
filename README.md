# CreatorOS - AI-Powered Content Creation Platform

CreatorOS is a comprehensive SaaS platform that transforms YouTube videos into a diverse portfolio of high-quality marketing assets using advanced AI automation. Built with a modern, scalable architecture designed for production deployment.

## 🚀 Features

- **Smart Video Processing**: Advanced AI transcription with speaker detection, sentiment analysis, and automatic chapter generation
- **Multi-Format Content Generation**: Automatically creates blog posts, Twitter threads, LinkedIn posts, newsletters, and video highlights
- **Interactive Transcript Viewer**: Word-level timestamps with clickable navigation and search functionality
- **Real-time Processing Status**: Live updates on video processing with automatic polling
- **Scalable Architecture**: Built with Temporal.io for durable, fault-tolerant workflows
- **Modern UI/UX**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Enterprise Security**: JWT authentication, input validation, and secure API design

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, Prisma ORM
- **Database**: PostgreSQL
- **Workflow Engine**: Temporal.io
- **AI Services**: AssemblyAI (transcription & analysis)
- **Authentication**: JWT with secure token management
- **Deployment**: Vercel (frontend), AWS ECS/Fargate (backend)

### System Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   FastAPI       │────│   Temporal      │
│   (Frontend)    │    │   (API Layer)   │    │   (Workflows)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │   AssemblyAI    │
                       │   (Database)    │    │   (AI Services) │
                       └─────────────────┘    └─────────────────┘
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (recommended)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CreatorOS
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start services with Docker Compose**
   ```bash
   cd backend
   docker-compose up -d
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   cd backend
   prisma generate
   
   # Run migrations
   prisma db push
   ```

5. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Manual Setup

#### Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL database**
   ```bash
   createdb creatorOS
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma client and run migrations**
   ```bash
   prisma generate
   prisma db push
   ```

5. **Start Temporal server** (separate terminal)
   ```bash
   temporal server start-dev
   ```

6. **Start the API server**
   ```bash
   python main.py
   ```

7. **Start the Temporal worker** (separate terminal)
   ```bash
   python worker.py
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Required API Keys

1. **AssemblyAI**: Get your API key from [AssemblyAI](https://www.assemblyai.com/)
2. **Stripe** (optional): For billing functionality
3. **Discord Bot** (optional): For community integration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/creatorOS"
JWT_SECRET_KEY="your-super-secret-jwt-key"
TEMPORAL_SERVER_URL="localhost:7233"
ASSEMBLYAI_API_KEY="your-assemblyai-api-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_GUILD_ID="your-discord-server-id"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /workspaces/{workspace_id}/videos` - Submit video for processing
- `GET /jobs/{job_id}` - Get processing status and results
- `GET /jobs/{job_id}/assets` - Get generated content assets

## 🔄 Workflow Architecture

The application uses Temporal.io for reliable, long-running video processing workflows:

1. **Video Ingestion**: Download audio from YouTube
2. **AI Transcription**: Process with AssemblyAI's Audio Intelligence
3. **Content Analysis**: Extract key themes and moments
4. **Asset Generation**: Create multiple content formats in parallel
5. **Status Updates**: Real-time progress tracking

### Workflow Benefits

- **Durability**: Workflows survive system failures
- **Scalability**: Horizontal scaling of workers
- **Observability**: Complete execution history
- **Reliability**: Automatic retries with exponential backoff

## 🎨 Frontend Features

### Components

- **VideoPlayer**: Custom YouTube player with transcript sync
- **TranscriptViewer**: Interactive transcript with word-level timing
- **ContentAssetViewer**: Tabbed interface for generated content
- **DashboardVideoList**: Real-time video status updates

### State Management

- **Zustand**: Lightweight state management
- **React Query**: Server state caching and synchronization
- **Polling**: Automatic updates for processing videos

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect your repository to Vercel**
2. **Set environment variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. **Deploy**: Automatic deployment on git push

### Backend (AWS ECS/Fargate)

1. **Build and push Docker image**
   ```bash
   docker build -t creatorOS-api .
   docker tag creatorOS-api:latest your-registry/creatorOS-api:latest
   docker push your-registry/creatorOS-api:latest
   ```

2. **Set up ECS cluster and service**
3. **Configure environment variables in ECS task definition**
4. **Set up load balancer and auto-scaling**

### Database

- **AWS RDS**: Managed PostgreSQL instance
- **Connection pooling**: Use PgBouncer for production
- **Backups**: Automated daily backups

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Pydantic models for API validation
- **CORS Configuration**: Restricted origins
- **Environment Variables**: Secure secret management
- **SQL Injection Prevention**: Prisma ORM protection

## 📊 Monitoring & Observability

- **Health Checks**: Built-in health endpoints
- **Temporal UI**: Workflow execution monitoring
- **Logging**: Structured logging with correlation IDs
- **Error Tracking**: Comprehensive error handling

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and API docs
- **Issues**: Create GitHub issues for bugs
- **Discord**: Join our community (link in app)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced video editing features
- [ ] Team collaboration tools
- [ ] API access for developers
- [ ] Mobile app
- [ ] Advanced analytics dashboard

---

Built with ❤️ by the CreatorOS team
