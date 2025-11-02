# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including Node.js for Prisma
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    ffmpeg \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies including PyJWT
RUN pip install --no-cache-dir PyJWT && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Install Prisma CLI and generate client
RUN npm install prisma@5.4.2 @prisma/client@5.4.2 && \
    npx prisma@5.4.2 generate

# Expose port 8003
EXPOSE 8003

# Health check on correct port
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8003/health || exit 1

# Run the FastAPI application
CMD ["python", "main.py"]
