/**
 * Research Types
 * TypeScript definitions for research papers and related entities
 */

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  methodology?: string;
  results?: string;
  discussion?: string;
  conclusion?: string;
  citations: Citation[];
  keywords: string[];
  authors: string[];
  journal: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  reviewScore?: number;
  collaborationEnabled?: boolean;
}

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi?: string;
  url?: string;
  abstract?: string;
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

export interface Review {
  id: string;
  paperId: string;
  provider: string;
  reviewerId?: string;
  overallScore: number;
  technicalAccuracy: number;
  methodology: number;
  originality: number;
  clarity: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationSession {
  id: string;
  paperId: string;
  participants: string[];
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'researcher' | 'reviewer';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  aiProvider: string;
  defaultDepth: 'quick' | 'medium' | 'deep';
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface AnalyticsData {
  totalPapers: number;
  totalReviews: number;
  averageReviewScore: number;
  providerStats: ProviderStats[];
  topicTrends: TopicTrend[];
  userActivity: UserActivity[];
}

export interface ProviderStats {
  provider: string;
  count: number;
  averageScore: number;
  averageTime: number;
}

export interface TopicTrend {
  topic: string;
  count: number;
  growth: number;
  lastUpdated: Date;
}

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface GenerationRequest {
  id: string;
  topic: string;
  depth: 'quick' | 'medium' | 'deep';
  provider: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  userId?: string;
  createdAt: Date;
  completedAt?: Date;
  result?: ResearchPaper;
  error?: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: Date;
  updated: Date;
  categories: string[];
  doi?: string;
  arxivUrl: string;
  pdfUrl?: string;
}

export interface ResearchMetrics {
  papersGenerated: number;
  papersReviewed: number;
  averageGenerationTime: number;
  averageReviewTime: number;
  topTopics: Array<{ topic: string; count: number }>;
  providerUsage: Record<string, number>;
  userEngagement: {
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  topic?: string;
  provider?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  keywords?: string[];
  authors?: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'latex' | 'docx';
  includeCitations: boolean;
  includeReviews: boolean;
  template?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    paperGenerated: boolean;
    reviewCompleted: boolean;
    collaborationInvited: boolean;
    systemUpdates: boolean;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  metrics: SystemMetrics;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

export interface SystemMetrics {
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}
