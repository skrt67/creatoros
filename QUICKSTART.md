# Vidova Quick Start Guide

Get Vidova running locally in under 10 minutes!

## 🚀 Prerequisites

- **Python 3.11+** - [Download here](https://python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 15+** - [Download here](https://postgresql.org/download/)
- **Docker** (optional but recommended) - [Download here](https://docker.com/get-started/)

## ⚡ Option 1: Docker Quick Start (Recommended)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Vidova
```

### 2. Configure Environment
```bash
# Backend environment
cp backend/.env.example backend/.env

# Edit backend/.env and add your AssemblyAI API key:
# ASSEMBLYAI_API_KEY="your-api-key-here"
```

### 3. Start with Docker
```bash
cd backend
docker-compose up -d
```

### 4. Setup Database
```bash
# Generate Prisma client
prisma generate

# Push schema to database
prisma db push

# Run setup script
python scripts/setup.py
```

### 5. Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Temporal UI**: http://localhost:8080

**Demo Login**: `demo@creatorOS.com` / `demo123456`

## 🛠️ Option 2: Manual Setup

### 1. Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd Vidova/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
createdb creatorOS
prisma generate
prisma db push
python scripts/setup.py
```

### 2. Start Temporal Server
```bash
# In a new terminal
temporal server start-dev
```

### 3. Start Backend Services
```bash
# Terminal 1: API Server
python main.py

# Terminal 2: Temporal Worker
python worker.py
```

### 4. Frontend Setup
```bash
# In a new terminal
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

## 🔑 Required API Keys

### AssemblyAI (Required)
1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key from the dashboard
3. Add to `backend/.env`: `ASSEMBLYAI_API_KEY="your-key-here"`

### Stripe (Optional - for billing)
1. Sign up at [Stripe](https://stripe.com/)
2. Get your test keys
3. Add to `backend/.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

## 🎯 First Steps

### 1. Create Account
- Go to http://localhost:3000
- Click "Sign Up"
- Create your account

### 2. Submit Your First Video
- Go to Dashboard
- Paste a YouTube URL
- Click "Submit Video"
- Watch the magic happen! ✨

### 3. View Results
- Click on your processed video
- Explore the transcript
- Check out generated content assets
- Copy content to your clipboard

## 🔧 Development Tools

### Backend Development Helper
```bash
cd backend

# Reset database and seed test data
python scripts/dev.py full-reset

# Start all services
python scripts/dev.py start

# Other commands
python scripts/dev.py --help
```

### Useful URLs
- **API Documentation**: http://localhost:8000/docs
- **Temporal UI**: http://localhost:8080
- **Database Admin**: Use your favorite PostgreSQL client

## 🐛 Troubleshooting

### Common Issues

**"Database connection failed"**
```bash
# Make sure PostgreSQL is running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Check if database exists
psql -l | grep creatorOS
```

**"Temporal connection failed"**
```bash
# Make sure Temporal server is running
temporal server start-dev

# Check if it's accessible
curl http://localhost:7233
```

**"AssemblyAI API error"**
- Verify your API key is correct
- Check your AssemblyAI account has credits
- Ensure the key is properly set in `.env`

**"Frontend can't connect to API"**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Look for CORS errors in browser console

### Getting Help

1. **Check the logs**: Look at terminal output for error messages
2. **Verify environment**: Ensure all `.env` files are configured
3. **Check services**: Make sure all required services are running
4. **Review documentation**: Check README.md for detailed information

## 📁 Project Structure

```
Vidova/
├── backend/                 # Python FastAPI backend
│   ├── app/                # API routes and models
│   ├── temporal_workflows/ # Temporal workflows and activities
│   ├── prisma/            # Database schema
│   └── scripts/           # Development utilities
├── frontend/              # Next.js React frontend
│   ├── app/              # Next.js 13+ app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities and API client
│   └── store/           # State management
└── docs/                # Documentation
```

## 🎉 What's Next?

Once you have Vidova running:

1. **Explore Features**: Try different types of YouTube videos
2. **Customize Content**: Edit generated content assets
3. **Check Workflows**: Monitor processing in Temporal UI
4. **Read Documentation**: Dive deeper into the architecture
5. **Contribute**: Help improve Vidova!

## 💡 Pro Tips

- **Use shorter videos** (5-15 minutes) for faster processing during development
- **Monitor the Temporal UI** to see workflow execution in real-time
- **Check browser dev tools** for any frontend errors
- **Use the demo account** to quickly test features
- **Keep an eye on API logs** for debugging backend issues

---

**Need help?** Check out the full [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md) for more detailed information.

Happy creating! 🚀
