/**
 * AI Service Routes
 * Endpoints for AI model interactions and research generation
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { aiModelService } from '../services/aiModelService';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/asyncHandler';
import { rateLimitMiddleware } from '../middleware/rateLimit';

const router = Router();

// Apply rate limiting to AI endpoints
router.use(rateLimitMiddleware);

// Get available AI providers
router.get('/providers', asyncHandler(async (req: Request, res: Response) => {
  try {
    const providers = aiModelService.getProviders();
    const stats = await aiModelService.getProviderStats();
    
    res.json({
      success: true,
      data: {
        providers,
        stats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting AI providers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI providers',
      timestamp: new Date().toISOString(),
    });
  }
}));

// Generate research paper
router.post('/generate', [
  body('topic').notEmpty().withMessage('Topic is required'),
  body('depth').isIn(['quick', 'medium', 'deep']).withMessage('Depth must be quick, medium, or deep'),
  body('provider').optional().isIn(['openai', 'anthropic', 'cohere']).withMessage('Invalid provider'),
  body('useArxiv').optional().isBoolean(),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      timestamp: new Date().toISOString(),
    });
  }

  const { topic, depth, provider = 'openai', useArxiv = false } = req.body;

  try {
    logger.info(`Generating research paper: topic=${topic}, depth=${depth}, provider=${provider}`);
    
    const research = await aiModelService.generateResearch(topic, depth, provider);
    
    // If Arxiv integration is requested, fetch related papers
    if (useArxiv) {
      // TODO: Implement Arxiv integration
      logger.info('Arxiv integration requested (not yet implemented)');
    }

    res.json({
      success: true,
      data: research,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error generating research:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate research',
      timestamp: new Date().toISOString(),
    });
  }
}));

// Review research paper
router.post('/review', [
  body('paperId').notEmpty().withMessage('Paper ID is required'),
  body('provider').optional().isIn(['openai', 'anthropic', 'cohere']).withMessage('Invalid provider'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      timestamp: new Date().toISOString(),
    });
  }

  const { paperId, provider = 'openai' } = req.body;

  try {
    logger.info(`Reviewing paper: paperId=${paperId}, provider=${provider}`);
    
    const review = await aiModelService.reviewPaper(paperId, provider);
    
    res.json({
      success: true,
      data: review,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error reviewing paper:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review paper',
      timestamp: new Date().toISOString(),
    });
  }
}));

// Generate citations
router.post('/citations', [
  body('topic').notEmpty().withMessage('Topic is required'),
  body('count').isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20'),
  body('provider').optional().isIn(['openai', 'anthropic', 'cohere']).withMessage('Invalid provider'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      timestamp: new Date().toISOString(),
    });
  }

  const { topic, count, provider = 'openai' } = req.body;

  try {
    logger.info(`Generating citations: topic=${topic}, count=${count}, provider=${provider}`);
    
    const aiProvider = aiModelService.getProviders().find(p => p === provider);
    if (!aiProvider) {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider',
        timestamp: new Date().toISOString(),
      });
    }

    // Get the provider instance and generate citations
    const providerInstance = (aiModelService as any).providers.get(provider);
    const citations = await providerInstance.generateCitations(topic, count);
    
    res.json({
      success: true,
      data: citations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error generating citations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate citations',
      timestamp: new Date().toISOString(),
    });
  }
}));

// Get AI model health check
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    const providers = aiModelService.getProviders();
    const healthChecks = await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          await aiModelService.generateResearch('health-check', 'quick', provider);
          return { provider, status: 'healthy' };
        } catch (error) {
          return { provider, status: 'unhealthy', error: error.message };
        }
      })
    );

    const health = healthChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          provider: providers[index],
          status: 'unhealthy',
          error: result.reason?.message || 'Unknown error',
        };
      }
    });

    const overallStatus = health.every(h => h.status === 'healthy') ? 'healthy' : 'degraded';

    res.json({
      success: true,
      data: {
        status: overallStatus,
        providers: health,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error checking AI health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check AI health',
      timestamp: new Date().toISOString(),
    });
  }
}));

// Get AI usage statistics
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await aiModelService.getProviderStats();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting AI stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI stats',
      timestamp: new Date().toISOString(),
    });
  }
}));

export { router as aiServiceRoutes };
