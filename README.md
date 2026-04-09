
# AI Scientist - Advanced Self-Evolving Research System

https://evolving-ai-reviewer.lovable.app/

## Project Overview

AI Scientist is an enterprise-grade autonomous AI research system that generates comprehensive research papers, evolves its capabilities, and leverages peer review to validate findings. This advanced system integrates multiple AI providers, real-time collaboration, and production-ready infrastructure for cutting-edge research generation.

## Features

- **Multi-Provider AI Integration**: OpenAI GPT-4, Anthropic Claude, and Cohere models
- **Advanced Research Generation**: Generate comprehensive research papers on any topic
- **Real-time Collaboration**: Multi-user collaborative research editing and review
- **ArXiv Integration**: Leverage ArXiv data for in-depth analysis and citations
- **Intelligent Peer Review**: AI-powered paper review with multiple scoring metrics
- **Production Backend**: Node.js/Express API with PostgreSQL and Redis
- **Live Dashboard**: Real-time metrics, analytics, and system monitoring
- **Docker Deployment**: Multi-container deployment with monitoring stack
- **CI/CD Pipeline**: Automated testing, security scanning, and deployment
- **Advanced UI**: Modern React interface with real-time updates and collaboration

## Architecture

```
evolving-ai-reviewer/
frontend/                 # React/TypeScript frontend
backend/                  # Node.js/Express API
src/
  components/            # Advanced UI components
  pages/                 # React pages
  hooks/                 # Custom React hooks
  types/                 # TypeScript definitions
backend/
  src/
    models/              # AI model integrations
    routes/               # API endpoints
    services/             # Business logic
    middleware/           # Express middleware
    utils/                # Utility functions
  prisma/                # Database schema
docker-compose.yml       # Multi-service deployment
.github/workflows/        # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Node.js (v14+) & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/NullLabTests/evolving-ai-reviewer.git
cd evolving-ai-reviewer

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Database: localhost:5432
# Monitoring: http://localhost:3000 (Grafana)
```

### Development Setup

```bash
# Clone the repository
git clone https://github.com/NullLabTests/evolving-ai-reviewer.git
cd evolving-ai-reviewer

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Setup database
cd backend && npx prisma migrate dev && npx prisma generate && cd ..

# Start development servers
npm run dev:all
```

### Environment Variables

```bash
# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
COHERE_API_KEY=your_cohere_api_key

# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/evolving_ai_reviewer
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key

# Application
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

## Usage

1. **Generate Research**: Navigate to the Research page and enter a topic
2. **Configure Settings**: Choose research depth and whether to use ArXiv data
3. **View Results**: Review the generated research paper
4. **Track Progress**: Use the Dashboard to monitor system metrics

## Deployment Options

You can deploy this project using various free hosting options:

1. **GitHub Pages**: Free hosting for static sites directly from your GitHub repository
   - Instructions: https://pages.github.com/

2. **Netlify**: Free tier with generous limits
   - Instructions: https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/

3. **Vercel**: Free for personal projects
   - Instructions: https://vercel.com/docs/concepts/deployments/overview

4. **Cloudflare Pages**: Free hosting with generous build minutes
   - Instructions: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-application/

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form, Zod

## Project Structure

```
ai-scientist/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and services
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
└── ...                   # Configuration files
```

## Future Enhancements

- Integration with additional research databases
- Enhanced PDF export functionality
- Collaborative research features
- Mobile application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ArXiv](https://arxiv.org/) for providing access to research papers
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- All contributors and supporters of this project
