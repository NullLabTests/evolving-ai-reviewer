
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock research data - in a real app, this would come from an API
const mockResearch = [
  {
    id: "1",
    title: "Quantum Neural Networks for Enhanced Machine Learning",
    abstract: "This research explores the integration of quantum computing principles with neural network architectures to overcome limitations in traditional machine learning approaches.",
    author: "AI Scientist v2.3",
    date: "2023-10-15",
    field: "Computer Science",
    citations: 14,
    reviewScore: 4.7,
    content: "The intersection of quantum computing and neural networks presents a promising frontier for advancing machine learning capabilities. This paper introduces a novel quantum neural network architecture that leverages quantum superposition and entanglement to process complex data patterns beyond the reach of classical systems. Our experiments demonstrate a 37% improvement in processing efficiency for high-dimensional datasets compared to state-of-the-art classical approaches. Furthermore, the proposed architecture exhibits enhanced capabilities in recognizing non-linear patterns in chaotic systems, suggesting applications in weather prediction, financial modeling, and protein folding simulations.",
    reviews: [
      { reviewer: "AI Reviewer Alpha", score: 4.8, comment: "Innovative approach with sound methodology. Consider expanding on the limitations section." },
      { reviewer: "AI Reviewer Beta", score: 4.5, comment: "The quantum architecture is well-designed, though hardware constraints could be addressed more thoroughly." }
    ]
  },
  {
    id: "2",
    title: "Biomimetic Approaches to Sustainable Energy Storage",
    abstract: "Inspired by biological energy storage mechanisms, this research proposes novel materials for next-generation batteries with improved capacity and reduced environmental impact.",
    author: "AI Scientist v2.4",
    date: "2023-11-22",
    field: "Materials Science",
    citations: 8,
    reviewScore: 4.5,
    content: "Biological systems have evolved sophisticated mechanisms for energy storage and conversion, offering inspiration for artificial systems. This research examines cellular energy storage processes, particularly focusing on ATP synthesis and photosynthesis, to develop bio-inspired materials for energy applications. We synthesized a novel polymer-based electrode material with a hierarchical structure mimicking chloroplast thylakoid membranes. Testing reveals 42% higher energy density than conventional lithium-ion batteries and a 30% reduction in charge degradation over 500 cycles. Additionally, the materials utilize abundant elements and biodegradable components, significantly reducing environmental impact compared to conventional battery technologies.",
    reviews: [
      { reviewer: "AI Reviewer Gamma", score: 4.6, comment: "Excellent interdisciplinary approach. The scalability analysis is particularly valuable." },
      { reviewer: "AI Reviewer Delta", score: 4.3, comment: "Strong methodology, though cost analysis could be more detailed for commercial applications." }
    ]
  },
  {
    id: "3",
    title: "Neuroplasticity Mechanisms in Artificial Neural Networks",
    abstract: "This research applies principles of biological neuroplasticity to artificial neural networks, creating systems with enhanced adaptability and resilience.",
    author: "AI Scientist v2.5",
    date: "2023-12-07",
    field: "Neuroscience/AI",
    citations: 6,
    reviewScore: 4.9,
    content: "Biological neuroplasticity—the brain's ability to reorganize itself by forming new neural connections—provides a compelling model for improving artificial neural networks. This paper presents a novel architecture incorporating three key neuroplasticity mechanisms: synaptic scaling, structural plasticity, and neuromodulation. We implemented these mechanisms in a deep learning framework, creating networks that dynamically adjust their topology based on input patterns and learning requirements. Extensive testing across multiple domains demonstrates that these neuroplastic networks outperform conventional fixed-architecture networks in rapidly changing environments, showing 29% faster adaptation to novel data distributions and 18% improved robustness against adversarial attacks.",
    reviews: [
      { reviewer: "AI Reviewer Alpha", score: 4.9, comment: "Groundbreaking integration of neuroscience principles. Methodology is rigorous and results compelling." },
      { reviewer: "AI Reviewer Epsilon", score: 4.8, comment: "The comparative analysis against traditional architectures is particularly insightful." }
    ]
  }
];

const Research = () => {
  const navigate = useNavigate();
  const [selectedResearch, setSelectedResearch] = useState(mockResearch[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleDownload = () => {
    toast({
      title: "Research Downloaded",
      description: `${selectedResearch.title} has been downloaded as PDF`,
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
        {/* Research List Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold mb-4">AI-Generated Research</h2>
          
          {mockResearch.map((research) => (
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
          ))}
        </div>
        
        {/* Research Details */}
        <div className="w-full lg:w-2/3">
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
        </div>
      </div>
    </div>
  );
};

export default Research;
