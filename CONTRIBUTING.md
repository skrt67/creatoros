# Contributing to Vidova

Thank you for your interest in contributing to Vidova! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python/Node versions)
   - Screenshots or logs if applicable

### Suggesting Features

1. **Check the roadmap** to see if it's already planned
2. **Open a feature request** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant mockups or examples

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test thoroughly**
5. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (recommended)

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Vidova.git
   cd Vidova
   ```

2. **Set up backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   ```

4. **Start services**
   ```bash
   # Use Docker (recommended)
   cd backend
   docker-compose up -d
   
   # Or start manually
   temporal server start-dev  # Terminal 1
   python main.py            # Terminal 2
   python worker.py          # Terminal 3
   cd ../frontend && npm run dev  # Terminal 4
   ```

## 📝 Coding Standards

### Python (Backend)

- **Follow PEP 8** style guidelines
- **Use type hints** for all function parameters and return values
- **Write docstrings** for all public functions and classes
- **Use async/await** for I/O operations
- **Handle errors gracefully** with proper exception handling

Example:
```python
async def process_video(video_url: str) -> ProcessingResult:
    """
    Process a video URL and return the result.
    
    Args:
        video_url: The YouTube URL to process
        
    Returns:
        ProcessingResult containing the processed data
        
    Raises:
        ValidationError: If the URL is invalid
        ProcessingError: If processing fails
    """
    try:
        # Implementation here
        pass
    except Exception as e:
        logger.error(f"Failed to process video {video_url}: {e}")
        raise ProcessingError(f"Processing failed: {e}")
```

### TypeScript/React (Frontend)

- **Use TypeScript** for all new code
- **Follow React best practices** (hooks, functional components)
- **Use proper prop types** and interfaces
- **Implement error boundaries** for error handling
- **Use semantic HTML** and accessibility best practices

Example:
```typescript
interface VideoCardProps {
  video: VideoSource;
  onDelete?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onDelete 
}) => {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      onDelete?.(video.id);
    }
  }, [video.id, onDelete]);

  return (
    <Card>
      {/* Component implementation */}
    </Card>
  );
};
```

### Database

- **Use Prisma migrations** for schema changes
- **Write descriptive migration names**
- **Test migrations** on sample data
- **Consider backward compatibility**

### API Design

- **Follow RESTful conventions**
- **Use consistent naming** (snake_case for JSON, camelCase for TypeScript)
- **Include proper HTTP status codes**
- **Validate all inputs** with Pydantic models
- **Document endpoints** with OpenAPI/Swagger

## 🧪 Testing

### Backend Testing

```bash
cd backend
pytest tests/ -v
```

- **Write unit tests** for business logic
- **Write integration tests** for API endpoints
- **Mock external services** (AssemblyAI, etc.)
- **Test error conditions** and edge cases

### Frontend Testing

```bash
cd frontend
npm test
```

- **Write component tests** with React Testing Library
- **Test user interactions** and state changes
- **Mock API calls** in tests
- **Test accessibility** with axe-core

### End-to-End Testing

- **Test critical user flows**
- **Use realistic test data**
- **Test across different browsers**
- **Include mobile testing**

## 📋 Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run the full test suite**
4. **Check code formatting**
5. **Update CHANGELOG.md** if applicable

### PR Guidelines

1. **Use descriptive titles** and descriptions
2. **Reference related issues** with "Fixes #123"
3. **Keep PRs focused** - one feature/fix per PR
4. **Include screenshots** for UI changes
5. **Update documentation** as needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🏗️ Architecture Guidelines

### Backend Architecture

- **Use dependency injection** for services
- **Separate concerns** (routes, business logic, data access)
- **Use Temporal workflows** for long-running processes
- **Implement proper logging** and monitoring
- **Handle rate limiting** for external APIs

### Frontend Architecture

- **Use component composition** over inheritance
- **Implement proper state management** with Zustand
- **Use React Query** for server state
- **Implement proper error boundaries**
- **Follow accessibility guidelines**

### Database Design

- **Normalize data** appropriately
- **Use proper indexes** for performance
- **Consider data privacy** and GDPR compliance
- **Plan for scalability**

## 🔒 Security Guidelines

- **Never commit secrets** or API keys
- **Validate all inputs** on both client and server
- **Use parameterized queries** to prevent SQL injection
- **Implement proper authentication** and authorization
- **Follow OWASP security guidelines**

## 📚 Documentation

### Code Documentation

- **Write clear docstrings** for Python functions
- **Use JSDoc comments** for TypeScript functions
- **Document complex algorithms** and business logic
- **Keep README files updated**

### API Documentation

- **Use OpenAPI/Swagger** for API documentation
- **Include request/response examples**
- **Document error responses**
- **Keep documentation in sync** with code

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update version numbers**
2. **Update CHANGELOG.md**
3. **Run full test suite**
4. **Create release branch**
5. **Deploy to staging**
6. **Test staging deployment**
7. **Create GitHub release**
8. **Deploy to production**

## 🎯 Areas for Contribution

### High Priority

- **Performance optimizations**
- **Additional content formats**
- **Mobile responsiveness**
- **Accessibility improvements**
- **Test coverage**

### Medium Priority

- **Internationalization (i18n)**
- **Advanced video editing features**
- **Team collaboration tools**
- **Analytics dashboard**

### Low Priority

- **Theme customization**
- **Plugin system**
- **Advanced integrations**

## 💬 Communication

### Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat (link in app)

### Guidelines

- **Be respectful** and inclusive
- **Stay on topic**
- **Search before asking** questions
- **Provide context** when asking for help

## 🏆 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **GitHub contributors** section
- **Release notes** for significant contributions
- **Discord contributor role**

## 📄 License

By contributing to Vidova, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Vidova! 🚀
