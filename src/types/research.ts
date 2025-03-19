
export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  author: string;
  date: string;
  field: string;
  wordCount: number;
  citations: number;
  reviewScore: number;
  content: string;
  reviews: ReviewComment[];
}

export interface ReviewComment {
  reviewer: string;
  score: number;
  comment: string;
}

export interface ResearchGeneration {
  topic: string;
  useArxiv: boolean;
  depth: "quick" | "deep";
}
