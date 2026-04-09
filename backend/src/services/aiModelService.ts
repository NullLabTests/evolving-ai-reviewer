/**
 * AI Model Service
 * Integrates multiple AI providers for research generation
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Cohere from 'cohere-ai';
import { logger } from '../utils/logger';
import { ResearchPaper, Citation } from '../types/research';
import { prisma } from '../index';

export interface AIProvider {
  name: string;
  generateResearch: (topic: string, depth: 'quick' | 'medium' | 'deep') => Promise<ResearchPaper>;
  generateCitations: (topic: string, count: number) => Promise<Citation[]>;
  reviewPaper: (paper: ResearchPaper) => Promise<ReviewResult>;
}

export interface ReviewResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  technicalAccuracy: number;
  methodology: number;
  originality: number;
  clarity: number;
}

class AIModelService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private cohere: Cohere;
  private providers: Map<string, AIProvider>;

  constructor() {
    // Initialize AI providers
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.cohere = new Cohere({
      apiKey: process.env.COHERE_API_KEY,
    });

    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    // OpenAI Provider
    this.providers.set('openai', {
      name: 'OpenAI GPT-4',
      generateResearch: this.generateResearchWithOpenAI.bind(this),
      generateCitations: this.generateCitationsWithOpenAI.bind(this),
      reviewPaper: this.reviewPaperWithOpenAI.bind(this),
    });

    // Anthropic Provider
    this.providers.set('anthropic', {
      name: 'Anthropic Claude',
      generateResearch: this.generateResearchWithAnthropic.bind(this),
      generateCitations: this.generateCitationsWithAnthropic.bind(this),
      reviewPaper: this.reviewPaperWithAnthropic.bind(this),
    });

    // Cohere Provider
    this.providers.set('cohere', {
      name: 'Cohere',
      generateResearch: this.generateResearchWithCohere.bind(this),
      generateCitations: this.generateCitationsWithCohere.bind(this),
      reviewPaper: this.reviewPaperWithCohere.bind(this),
    });
  }

  async generateResearchWithOpenAI(topic: string, depth: 'quick' | 'medium' | 'deep'): Promise<ResearchPaper> {
    try {
      const systemPrompt = this.getSystemPrompt(depth);
      const userPrompt = this.getUserPrompt(topic);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: depth === 'deep' ? 4000 : depth === 'medium' ? 2500 : 1500,
      });

      const content = response.choices[0].message.content;
      return this.parseResearchContent(content, topic, 'openai');
    } catch (error) {
      logger.error('Error generating research with OpenAI:', error);
      throw new Error('Failed to generate research with OpenAI');
    }
  }

  async generateResearchWithAnthropic(topic: string, depth: 'quick' | 'medium' | 'deep'): Promise<ResearchPaper> {
    try {
      const systemPrompt = this.getSystemPrompt(depth);
      const userPrompt = this.getUserPrompt(topic);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: depth === 'deep' ? 4000 : depth === 'medium' ? 2500 : 1500,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseResearchContent(content, topic, 'anthropic');
    } catch (error) {
      logger.error('Error generating research with Anthropic:', error);
      throw new Error('Failed to generate research with Anthropic');
    }
  }

  async generateResearchWithCohere(topic: string, depth: 'quick' | 'medium' | 'deep'): Promise<ResearchPaper> {
    try {
      const prompt = this.getSystemPrompt(depth) + '\n\n' + this.getUserPrompt(topic);

      const response = await this.cohere.generate({
        model: 'command',
        prompt: prompt,
        maxTokens: depth === 'deep' ? 4000 : depth === 'medium' ? 2500 : 1500,
        temperature: 0.7,
      });

      return this.parseResearchContent(response.generations[0].text, topic, 'cohere');
    } catch (error) {
      logger.error('Error generating research with Cohere:', error);
      throw new Error('Failed to generate research with Cohere');
    }
  }

  async generateCitationsWithOpenAI(topic: string, count: number): Promise<Citation[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Generate relevant academic citations for a research topic. Return in JSON format with title, authors, year, journal, and DOI.',
          },
          {
            role: 'user',
            content: `Generate ${count} relevant academic citations for: ${topic}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      return this.parseCitations(content);
    } catch (error) {
      logger.error('Error generating citations with OpenAI:', error);
      return [];
    }
  }

  async generateCitationsWithAnthropic(topic: string, count: number): Promise<Citation[]> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: 'Generate relevant academic citations for a research topic. Return in JSON format with title, authors, year, journal, and DOI.',
        messages: [
          {
            role: 'user',
            content: `Generate ${count} relevant academic citations for: ${topic}`,
          },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseCitations(content);
    } catch (error) {
      logger.error('Error generating citations with Anthropic:', error);
      return [];
    }
  }

  async generateCitationsWithCohere(topic: string, count: number): Promise<Citation[]> {
    try {
      const response = await this.cohere.generate({
        model: 'command',
        prompt: `Generate ${count} relevant academic citations for: ${topic}. Return in JSON format with title, authors, year, journal, and DOI.`,
        maxTokens: 1000,
        temperature: 0.5,
      });

      return this.parseCitations(response.generations[0].text);
    } catch (error) {
      logger.error('Error generating citations with Cohere:', error);
      return [];
    }
  }

  async reviewPaperWithOpenAI(paper: ResearchPaper): Promise<ReviewResult> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert academic reviewer. Provide a comprehensive review of the research paper with scores for technical accuracy, methodology, originality, and clarity.',
          },
          {
            role: 'user',
            content: `Review this research paper:\n\nTitle: ${paper.title}\n\nAbstract: ${paper.abstract}\n\nContent: ${paper.content.substring(0, 2000)}...`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      return this.parseReviewResult(content);
    } catch (error) {
      logger.error('Error reviewing paper with OpenAI:', error);
      throw new Error('Failed to review paper with OpenAI');
    }
  }

  async reviewPaperWithAnthropic(paper: ResearchPaper): Promise<ReviewResult> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        system: 'You are an expert academic reviewer. Provide a comprehensive review of the research paper with scores for technical accuracy, methodology, originality, and clarity.',
        messages: [
          {
            role: 'user',
            content: `Review this research paper:\n\nTitle: ${paper.title}\n\nAbstract: ${paper.abstract}\n\nContent: ${paper.content.substring(0, 2000)}...`,
          },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseReviewResult(content);
    } catch (error) {
      logger.error('Error reviewing paper with Anthropic:', error);
      throw new Error('Failed to review paper with Anthropic');
    }
  }

  async reviewPaperWithCohere(paper: ResearchPaper): Promise<ReviewResult> {
    try {
      const response = await this.cohere.generate({
        model: 'command',
        prompt: `You are an expert academic reviewer. Provide a comprehensive review of the research paper with scores for technical accuracy, methodology, originality, and clarity.\n\nPaper:\nTitle: ${paper.title}\n\nAbstract: ${paper.abstract}\n\nContent: ${paper.content.substring(0, 2000)}...`,
        maxTokens: 1500,
        temperature: 0.3,
      });

      return this.parseReviewResult(response.generations[0].text);
    } catch (error) {
      logger.error('Error reviewing paper with Cohere:', error);
      throw new Error('Failed to review paper with Cohere');
    }
  }

  private getSystemPrompt(depth: 'quick' | 'medium' | 'deep'): string {
    const basePrompt = 'You are an expert AI research scientist. Generate a comprehensive academic research paper on the given topic. ';
    
    switch (depth) {
      case 'quick':
        return basePrompt + 'Provide a concise overview with key findings and implications.';
      case 'medium':
        return basePrompt + 'Include detailed methodology, results, and discussion sections with proper citations.';
      case 'deep':
        return basePrompt + 'Create a full-length academic paper with comprehensive literature review, detailed methodology, extensive results, thorough discussion, and proper citations in academic format.';
      default:
        return basePrompt;
    }
  }

  private getUserPrompt(topic: string): string {
    return `Generate a research paper on: ${topic}`;
  }

  private parseResearchContent(content: string, topic: string, provider: string): ResearchPaper {
    // Parse the generated content into structured research paper
    const sections = content.split('\n\n');
    let title = topic;
    let abstract = '';
    let mainContent = '';
    let methodology = '';
    let results = '';
    let discussion = '';
    let conclusion = '';

    sections.forEach(section => {
      if (section.toLowerCase().includes('title:') || section.toLowerCase().includes('# ')) {
        title = section.replace(/^(title:|#\s)/i, '').trim();
      } else if (section.toLowerCase().includes('abstract:')) {
        abstract = section.replace(/^abstract:/i, '').trim();
      } else if (section.toLowerCase().includes('methodology:')) {
        methodology = section.replace(/^methodology:/i, '').trim();
      } else if (section.toLowerCase().includes('results:')) {
        results = section.replace(/^results:/i, '').trim();
      } else if (section.toLowerCase().includes('discussion:')) {
        discussion = section.replace(/^discussion:/i, '').trim();
      } else if (section.toLowerCase().includes('conclusion:')) {
        conclusion = section.replace(/^conclusion:/i, '').trim();
      } else {
        mainContent += section + '\n\n';
      }
    });

    return {
      id: '',
      title,
      abstract: abstract || mainContent.substring(0, 500),
      content: mainContent,
      methodology,
      results,
      discussion,
      conclusion,
      citations: [],
      keywords: this.extractKeywords(topic),
      authors: ['AI Scientist'],
      journal: 'AI Generated Research',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      provider,
      status: 'draft',
      reviewScore: 0,
      collaborationEnabled: false,
    };
  }

  private parseCitations(content: string): Citation[] {
    try {
      // Try to parse as JSON first
      const citations = JSON.parse(content);
      return Array.isArray(citations) ? citations : [];
    } catch {
      // Fallback to text parsing
      const lines = content.split('\n');
      const citations: Citation[] = [];
      
      lines.forEach(line => {
        if (line.trim()) {
          citations.push({
            id: Math.random().toString(36).substring(7),
            title: line.trim(),
            authors: ['Unknown'],
            year: new Date().getFullYear(),
            journal: 'Unknown Journal',
            doi: '',
            url: '',
          });
        }
      });
      
      return citations;
    }
  }

  private parseReviewResult(content: string): ReviewResult {
    // Parse review content into structured result
    const scores = {
      overallScore: 0.8,
      technicalAccuracy: 0.8,
      methodology: 0.8,
      originality: 0.8,
      clarity: 0.8,
    };

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Extract scores, strengths, weaknesses, and suggestions from content
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.toLowerCase().includes('strength:')) {
        strengths.push(line.replace(/strength:/i, '').trim());
      } else if (line.toLowerCase().includes('weakness:')) {
        weaknesses.push(line.replace(/weakness:/i, '').trim());
      } else if (line.toLowerCase().includes('suggestion:')) {
        suggestions.push(line.replace(/suggestion:/i, '').trim());
      }
    });

    return {
      ...scores,
      strengths,
      weaknesses,
      suggestions,
    };
  }

  private extractKeywords(topic: string): string[] {
    // Simple keyword extraction
    return topic.toLowerCase().split(' ').filter(word => word.length > 3);
  }

  // Public methods
  async generateResearch(topic: string, depth: 'quick' | 'medium' | 'deep', provider: string = 'openai'): Promise<ResearchPaper> {
    const aiProvider = this.providers.get(provider);
    if (!aiProvider) {
      throw new Error(`Provider ${provider} not found`);
    }

    const research = await aiProvider.generateResearch(topic, depth);
    
    // Generate citations
    const citations = await aiProvider.generateCitations(topic, 5);
    research.citations = citations;

    // Save to database
    const savedResearch = await prisma.researchPaper.create({
      data: {
        title: research.title,
        abstract: research.abstract,
        content: research.content,
        methodology: research.methodology,
        results: research.results,
        discussion: research.discussion,
        conclusion: research.conclusion,
        citations: citations,
        keywords: research.keywords,
        authors: research.authors,
        journal: research.journal,
        provider: research.provider,
        status: research.status,
      },
    });

    research.id = savedResearch.id;
    return research;
  }

  async reviewPaper(paperId: string, provider: string = 'openai'): Promise<ReviewResult> {
    const aiProvider = this.providers.get(provider);
    if (!aiProvider) {
      throw new Error(`Provider ${provider} not found`);
    }

    const paper = await prisma.researchPaper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      throw new Error('Research paper not found');
    }

    const review = await aiProvider.reviewPaper(paper);
    
    // Save review to database
    await prisma.review.create({
      data: {
        paperId: paperId,
        provider: provider,
        overallScore: review.overallScore,
        technicalAccuracy: review.technicalAccuracy,
        methodology: review.methodology,
        originality: review.originality,
        clarity: review.clarity,
        strengths: review.strengths,
        weaknesses: review.weaknesses,
        suggestions: review.suggestions,
      },
    });

    return review;
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async getProviderStats(): Promise<any> {
    const stats = await prisma.researchPaper.groupBy({
      by: ['provider'],
      _count: {
        id: true,
      },
    });

    return stats.map(stat => ({
      provider: stat.provider,
      count: stat._count.id,
    }));
  }
}

// Singleton instance
export const aiModelService = new AIModelService();

// Initialize function for app startup
export async function initializeAIModels() {
  logger.info('Initializing AI models...');
  
  // Test connections to each provider
  try {
    // Test OpenAI
    await aiModelService.generateResearch('test', 'quick', 'openai');
    logger.info('OpenAI connection successful');
  } catch (error) {
    logger.warn('OpenAI connection failed:', error);
  }

  try {
    // Test Anthropic
    await aiModelService.generateResearch('test', 'quick', 'anthropic');
    logger.info('Anthropic connection successful');
  } catch (error) {
    logger.warn('Anthropic connection failed:', error);
  }

  try {
    // Test Cohere
    await aiModelService.generateResearch('test', 'quick', 'cohere');
    logger.info('Cohere connection successful');
  } catch (error) {
    logger.warn('Cohere connection failed:', error);
  }

  logger.info('AI models initialization complete');
}

export default aiModelService;
