/**
 * Evolving AI Reviewer Backend
 * Advanced AI Scientist Research System
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import config from 'config';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { aiServiceRoutes } from './routes/aiService';
import { researchRoutes } from './routes/research';
import { userRoutes } from './routes/user';
import { collaborationRoutes } from './routes/collaboration';
import { analyticsRoutes } from './routes/analytics';
import { setupSocketIO } from './services/socketService';
import { initializeAIModels } from './services/aiModelService';
import { startBackgroundJobs } from './services/backgroundJobs';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Create Express app
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.get('app.corsOrigin'),
    methods: ['GET', 'POST'],
  },
});

// Configuration
const PORT = config.get<number>('app.port') || 3001;
const NODE_ENV = config.get<string>('app.env') || 'development';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.get<number>('rateLimit.maxRequests') || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: config.get('app.corsOrigin'),
  credentials: true,
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Routes
app.use('/api/ai', aiServiceRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Protected routes
app.use('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected endpoint', user: req.user });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing services...');
    
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // Initialize AI models
    await initializeAIModels();
    logger.info('AI models initialized');
    
    // Setup Socket.IO
    setupSocketIO(io);
    logger.info('Socket.IO setup complete');
    
    // Start background jobs
    startBackgroundJobs();
    logger.info('Background jobs started');
    
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Starting graceful shutdown...');
  
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
    
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle SIGTERM
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  await initializeServices();
  
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
    logger.info(`API documentation at http://localhost:${PORT}/api/docs`);
  });
}

// Start the application
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { app, io, prisma };
