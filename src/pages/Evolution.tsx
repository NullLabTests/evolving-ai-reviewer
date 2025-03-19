
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, TrendingUp, Layers, BarChart, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock evolution data
const evolutionData = [
  { version: "v1.0", accuracy: 76, complexity: 40, papers: 5, date: "2023-06" },
  { version: "v1.5", accuracy: 79, complexity: 45, papers: 8, date: "2023-07" },
  { version: "v2.0", accuracy: 84, complexity: 60, papers: 12, date: "2023-08" },
  { version: "v2.3", accuracy: 88, complexity: 70, papers: 15, date: "2023-09" },
  { version: "v2.4", accuracy: 90, complexity: 75, papers: 18, date: "2023-10" },
  { version: "v2.5", accuracy: 92, complexity: 82, papers: 22, date: "2023-11" },
  { version: "v3.0", accuracy: 94, complexity: 88, papers: 28, date: "2023-12" },
];

const capabilities = [
  {
    version: "v1.0",
    name: "Initial Research Framework",
    description: "Basic research capabilities in limited domains with supervised assistance.",
    features: [
      "Single domain research generation",
      "Template-based methodology",
      "Basic statistical analysis",
      "Human-guided peer review"
    ]
  },
  {
    version: "v2.0",
    name: "Multi-Domain Researcher",
    description: "Expanded capabilities across multiple scientific domains with improved methodology.",
    features: [
      "Cross-domain research integration",
      "Dynamic hypothesis formulation",
      "Advanced statistical modeling",
      "Semi-autonomous peer review"
    ]
  },
  {
    version: "v3.0",
    name: "Autonomous Scientific Engine",
    description: "Fully autonomous research system with sophisticated reasoning and self-improvement.",
    features: [
      "Novel domain exploration",
      "Original methodology creation",
      "Complex systems modeling",
      "Fully autonomous peer review"
    ]
  }
];

const Evolution = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("performance");

  const chartConfig = {
    accuracy: {
      label: "Accuracy",
      theme: { light: "#3b82f6", dark: "#60a5fa" },
    },
    complexity: {
      label: "Complexity",
      theme: { light: "#8b5cf6", dark: "#a78bfa" },
    },
    papers: {
      label: "Papers Published",
      theme: { light: "#10b981", dark: "#34d399" },
    },
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
      
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Scientist Evolution</h1>
          <p className="text-muted-foreground">Tracking the development and improvement of the AI system over time</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 md:w-auto">
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="w-4 h-4" /> Performance
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-2">
            <Layers className="w-4 h-4" /> Capabilities
          </TabsTrigger>
          <TabsTrigger value="milestones" className="gap-2">
            <GitBranch className="w-4 h-4" /> Milestones
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart className="w-4 h-4" /> Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Visualizing key metrics showing how the AI Scientist has improved over versions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="version" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="complexity" stroke="var(--color-complexity)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="papers" stroke="var(--color-papers)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" /> Research Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-blue-500">94%</div>
                <p className="text-muted-foreground text-sm">
                  Increased from 76% in v1.0
                </p>
                <p className="mt-4 text-sm">
                  Accuracy of conclusions relative to established scientific consensus where available.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" /> Methodology Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-purple-500">88/100</div>
                <p className="text-muted-foreground text-sm">
                  Increased from 40/100 in v1.0
                </p>
                <p className="mt-4 text-sm">
                  Measures sophistication of research methodologies and analytical approaches.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-green-500" /> Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-green-500">28</div>
                <p className="text-muted-foreground text-sm">
                  Increased from 5 in v1.0
                </p>
                <p className="mt-4 text-sm">
                  Total number of research papers generated and validated through peer review.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map((capability) => (
              <Card key={capability.version} className="flex flex-col">
                <CardHeader>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {capability.version}
                  </div>
                  <CardTitle>{capability.name}</CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {capability.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full w-1.5 h-1.5 bg-primary mt-2"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Milestones</CardTitle>
              <CardDescription>
                Key achievements and breakthroughs in the AI Scientist's evolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted pl-6 ml-6 space-y-10">
                <div className="relative">
                  <div className="absolute -left-[30px] bg-background border-2 border-primary text-primary rounded-full w-10 h-10 flex items-center justify-center">
                    v1.0
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Initial Research Capability</h3>
                    <p className="text-muted-foreground mb-2">June 2023</p>
                    <p>First successful generation of baseline research in computational biology, establishing fundamental methodology patterns.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[30px] bg-background border-2 border-primary text-primary rounded-full w-10 h-10 flex items-center justify-center">
                    v2.0
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Cross-Domain Integration</h3>
                    <p className="text-muted-foreground mb-2">August 2023</p>
                    <p>Successfully combined knowledge from multiple scientific domains to produce interdisciplinary research, particularly at the intersection of AI and materials science.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[30px] bg-background border-2 border-primary text-primary rounded-full w-10 h-10 flex items-center justify-center">
                    v2.5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Autonomous Peer Review</h3>
                    <p className="text-muted-foreground mb-2">November 2023</p>
                    <p>Developed internal peer review system capable of critically evaluating research output, significantly improving quality and reliability of conclusions.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[30px] bg-background border-2 border-primary text-primary rounded-full w-10 h-10 flex items-center justify-center">
                    v3.0
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Novel Methodology Creation</h3>
                    <p className="text-muted-foreground mb-2">December 2023</p>
                    <p>First instance of the AI developing a novel research methodology not previously documented in scientific literature, applied to quantum computing algorithms.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Domain Distribution</CardTitle>
                <CardDescription>
                  Fields of study covered by the AI Scientist's research
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Domain distribution visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Efficiency</CardTitle>
                <CardDescription>
                  Time required to master new scientific domains
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Learning efficiency visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Evolution;
