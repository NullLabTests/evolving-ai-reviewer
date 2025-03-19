
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, ThumbsUp, MessageSquare, Share2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Initial empty state for when no research has been generated yet
const emptyResearchState = {
  id: "",
  title: "",
  abstract: "",
  author: "",
  date: "",
  field: "",
  citations: 0,
  reviewScore: 0,
  content: "",
  reviews: []
};

const Research = () => {
  const navigate = useNavigate();
  const [selectedResearch, setSelectedResearch] = useState(emptyResearchState);
  const [activeTab, setActiveTab] = useState("overview");
  const [generatedResearch, setGeneratedResearch] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");

  const handleDownload = () => {
    toast({
      title: "Research Downloaded",
      description: `${selectedResearch.title} has been downloaded as PDF`,
    });
  };

  const generateResearch = async () => {
    setIsGenerating(true);
    
    try {
      // Here we would ideally connect to the Python-based AI Scientist backend
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newResearch = {
        id: `research-${Date.now()}`,
        title: `AI-Generated Research on ${researchTopic || "Quantum Computing"}`,
        abstract: "This research explores recent advancements in quantum computing algorithms and their applications in solving complex computational problems.",
        author: "AI Scientist v1.0",
        date: new Date().toISOString().split('T')[0],
        field: "Computer Science",
        citations: 0,
        reviewScore: 4.2,
        content: `Recent advancements in quantum computing have shown promising results in solving complex computational problems that are intractable for classical computers. This paper presents a comprehensive review of quantum algorithms and their applications in various domains, including cryptography, optimization, and machine learning.

We explore the fundamental principles of quantum mechanics that enable quantum computers to perform computations exponentially faster than classical computers for certain problems. We also discuss the challenges in building practical quantum computers and the current state of quantum hardware.

Our analysis shows that quantum computing has the potential to revolutionize various fields, including drug discovery, materials science, and artificial intelligence. However, significant technical challenges must be overcome before quantum computers can be widely deployed for practical applications.`,
        reviews: [
          { reviewer: "AI Reviewer Alpha", score: 4.3, comment: "A comprehensive review of quantum computing advancements. The methodology section could be more detailed." },
          { reviewer: "AI Reviewer Beta", score: 4.1, comment: "The paper provides valuable insights into quantum algorithms. Consider expanding on quantum error correction techniques." }
        ]
      };
      
      setGeneratedResearch(prev => [...prev, newResearch]);
      setSelectedResearch(newResearch);
      
      toast({
        title: "Research Generated",
        description: "New research has been successfully generated",
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
        {/* Research List Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">AI-Generated Research</h2>
            <Button onClick={generateResearch} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Research"
              )}
            </Button>
          </div>
          
          {generatedResearch.length === 0 ? (
            <Card className="p-6 text-center bg-muted/30">
              <p className="text-muted-foreground">
                No research has been generated yet. Click the "Generate Research" button to create your first research paper.
              </p>
            </Card>
          ) : (
            generatedResearch.map((research) => (
              <Card 
                key={research.id} 
                className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedResearch.id === research.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedResearch(research)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{research.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {research.field} • {research.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{research.abstract}</p>
                </CardContent>
                <CardFooter className="pt-0 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {research.reviewScore}/5
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
        
        {/* Research Details */}
        <div className="w-full lg:w-2/3">
          {selectedResearch.id ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{selectedResearch.title}</CardTitle>
                <CardDescription>
                  By {selectedResearch.author} • Published {selectedResearch.date} • {selectedResearch.field}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 p-4 rounded-md mb-6">
                  <h4 className="font-medium mb-2">Abstract</h4>
                  <p className="text-muted-foreground">{selectedResearch.abstract}</p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Peer Reviews</TabsTrigger>
                    <TabsTrigger value="evolution">Research Evolution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p>{selectedResearch.content}</p>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                        <Download className="w-4 h-4" /> Download PDF
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share Research
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    {selectedResearch.reviews.map((review, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md">{review.reviewer}</CardTitle>
                            <span className="text-primary font-medium">{review.score}/5</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="evolution">
                    <div className="p-6 text-center bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">
                        This feature will show how the research evolved through multiple iterations
                        as the AI Scientist refined its approach and methodology.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-secondary/50 p-6">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">No Research Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Generate a new research paper or select an existing one from the sidebar to view its details.
                </p>
                <Button onClick={generateResearch} disabled={isGenerating} className="mt-4">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Research"
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
