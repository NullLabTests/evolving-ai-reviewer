
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Loader2, Share2, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResearchForm } from "@/components/ResearchForm";
import { ResearchPaper } from "@/types/research";
import { ResearchViewer } from "@/components/ResearchViewer";

const Research = () => {
  const navigate = useNavigate();
  const [selectedResearch, setSelectedResearch] = useState<ResearchPaper | null>(null);
  const [generatedResearch, setGeneratedResearch] = useState<ResearchPaper[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateResearch = async (topic: string, useArxiv: boolean, depth: string) => {
    setIsGenerating(true);
    
    try {
      // Here we would connect to the AI Scientist backend
      const newResearch = await generateResearchPaper(topic, useArxiv, depth);
      
      setGeneratedResearch(prev => [newResearch, ...prev]);
      setSelectedResearch(newResearch);
      
      toast({
        title: "Research Generated",
        description: "New research paper has been successfully generated",
      });
    } catch (error) {
      console.error("Error generating research:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate research. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!selectedResearch) return;
    
    const blob = new Blob([`# ${selectedResearch.title}\n\n${selectedResearch.abstract}\n\n${selectedResearch.content}`], 
      { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedResearch.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Research Downloaded",
      description: `${selectedResearch.title} has been downloaded as Markdown`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Research Controls & List Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          <Card className="p-4">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xl">Generate Research</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ResearchForm 
                onSubmit={handleGenerateResearch}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>

          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-bold">Generated Papers</h2>
            
            {generatedResearch.length === 0 ? (
              <Card className="p-6 text-center bg-muted/30">
                <p className="text-muted-foreground">
                  No research has been generated yet. Use the form above to create your first research paper.
                </p>
              </Card>
            ) : (
              generatedResearch.map((research) => (
                <Card 
                  key={research.id} 
                  className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedResearch?.id === research.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedResearch(research)}
                >
                  <CardHeader className="pb-2 p-4">
                    <CardTitle className="text-lg">{research.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{research.date} • {research.field}</p>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{research.abstract}</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {research.wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {research.reviews.length} reviews
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {/* Research Viewer */}
        <div className="w-full lg:w-2/3">
          {selectedResearch ? (
            <ResearchViewer 
              research={selectedResearch}
              onDownload={handleDownload}
            />
          ) : (
            <Card className="mb-6 p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-secondary/50 p-6">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">No Research Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Generate a new research paper using the form on the left, or select an existing one to view its details.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock function to simulate research generation
// In production, this would connect to the Python backend
async function generateResearchPaper(topic: string, useArxiv: boolean, depth: string): Promise<ResearchPaper> {
  // Simulate a delay to mimic processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate a research paper with a unique ID
  const id = `research-${Date.now()}`;
  const date = new Date().toISOString().split('T')[0];
  
  // Choose a field based on the topic
  const fields = ["Computer Science", "Physics", "Biology", "Chemistry", "Mathematics"];
  const field = fields[Math.floor(Math.random() * fields.length)];
  
  // Generate word count
  const wordCount = 800 + Math.floor(Math.random() * 1200);
  
  // Generate citations
  const citations = Math.floor(Math.random() * 25) + 5;
  
  // Generate a review score
  const reviewScore = (3.5 + Math.random() * 1.5).toFixed(1);
  
  // Create the research paper
  const paper: ResearchPaper = {
    id,
    title: `Advanced Research on ${topic}`,
    abstract: `This research explores the latest developments in ${topic}, analyzing current trends and future directions. We present a comprehensive review of the literature and propose new methodologies for advancing the field.`,
    author: "AI Scientist v1.0",
    date,
    field,
    wordCount,
    citations,
    reviewScore: parseFloat(reviewScore),
    content: generateContent(topic, depth),
    reviews: generateReviews()
  };
  
  return paper;
}

function generateContent(topic: string, depth: string): string {
  const lengthFactor = depth === "deep" ? 2 : 1;
  
  return `
## Introduction

The field of ${topic} has seen significant advancements in recent years, driven by technological innovation and increasing interest from both academic and industrial sectors. This research paper aims to provide a comprehensive overview of the current state of the field, identify key challenges, and propose new directions for future research.

## Literature Review

Previous work in ${topic} has focused on various aspects, including theoretical frameworks, experimental methodologies, and practical applications. Smith et al. (2022) proposed a novel approach to modeling complex systems within the domain, while Johnson and Wang (2023) explored the implications of these models for real-world applications.

## Methodology

Our research employs a mixed-methods approach, combining qualitative analysis with quantitative measurements to provide a holistic understanding of the subject matter. We collected data from multiple sources, including peer-reviewed publications, conference proceedings, and expert interviews.

## Results and Analysis

${lengthFactor > 1 ? `
Our analysis reveals several key patterns in the development of ${topic}:

1. Increasing integration with adjacent fields of study
2. Growing emphasis on practical applications over theoretical work
3. Shift toward collaborative, international research initiatives
4. Emergence of new sub-specialties within the broader domain

These patterns suggest a field in transition, moving from foundational theoretical work toward more applied and interdisciplinary approaches.

We observed a statistically significant correlation (p < 0.01) between research funding and publication output across the examined period (2018-2023), with particularly strong growth in areas related to sustainability and ethical considerations.
` : `
Our findings indicate a robust growth in ${topic} research, with particular emphasis on interdisciplinary applications and practical implementations. Statistical analysis shows significant trends in publication patterns and citation networks.
`}

## Discussion

${lengthFactor > 1 ? `
The observed trends in ${topic} research have several important implications for both academic and practical domains:

### Theoretical Implications

The integration of ${topic} with adjacent fields creates opportunities for novel theoretical frameworks that can address previously intractable problems. However, this integration also introduces challenges related to terminology, methodology, and epistemological foundations that must be carefully navigated.

### Practical Applications

The shift toward applied research in ${topic} has accelerated the development of practical solutions to real-world problems. This trend is particularly evident in domains such as healthcare, environmental management, and information technology, where ${topic}-based approaches have demonstrated significant advantages over traditional methods.

### Future Directions

Based on our analysis, we identify several promising directions for future research:

1. Development of standardized evaluation metrics for ${topic} implementations
2. Integration of ethical considerations into research design and application
3. Exploration of cross-cultural variations in ${topic} approaches
4. Investigation of long-term impacts and sustainability
` : `
The implications of our findings suggest that ${topic} is evolving rapidly, with increasing real-world applications and interdisciplinary connections. Future research should focus on standardization, ethical considerations, and long-term impacts.
`}

## Conclusion

This paper has presented a comprehensive analysis of current trends and future directions in ${topic} research. Our findings highlight the dynamic nature of the field and its growing importance across multiple domains. As the field continues to evolve, researchers and practitioners will need to address challenges related to integration, standardization, and ethical implementation.

## References

1. Smith, J., Johnson, A., & Williams, B. (2022). Novel approaches to ${topic}: A comprehensive review. Journal of Advanced Research, 45(3), 234-251.
2. Johnson, L., & Wang, Y. (2023). Practical applications of ${topic} in modern contexts. International Conference on Applied Sciences, 112-128.
${lengthFactor > 1 ? `
3. Garcia, R., & Thompson, S. (2021). Ethical considerations in ${topic} implementation. Ethics in Science and Technology, 18(2), 75-93.
4. Anderson, P., Martin, Q., & Lewis, E. (2023). Cross-cultural perspectives on ${topic}. Comparative Studies Journal, 29(4), 302-319.
5. Zhang, H., & Brown, T. (2022). Long-term impacts of ${topic} on societal structures. Future Studies Review, 12(1), 45-62.
` : ''}
`;
}

function generateReviews(): { reviewer: string; score: number; comment: string }[] {
  const reviewers = [
    "AI Reviewer Alpha",
    "AI Reviewer Beta",
    "AI Reviewer Gamma",
    "AI Reviewer Delta"
  ];
  
  const comments = [
    "A comprehensive analysis with robust methodology. Consider expanding the discussion of limitations.",
    "Strong theoretical framework and insightful analysis. The literature review could be more exhaustive.",
    "Novel approach with significant implications. Some conclusions may be overstated given the evidence presented.",
    "Well-structured research with clear contributions. Methodology section requires more detail on data processing techniques."
  ];
  
  // Generate 2-3 reviews
  const numReviews = Math.floor(Math.random() * 2) + 2;
  const reviews = [];
  
  for (let i = 0; i < numReviews; i++) {
    reviews.push({
      reviewer: reviewers[i],
      score: 3.5 + Math.random() * 1.5,
      comment: comments[i]
    });
  }
  
  return reviews;
}

export default Research;
