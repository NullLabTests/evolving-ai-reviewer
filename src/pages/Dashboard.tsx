
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Clock, FileSpreadsheet, Loader2, MessageSquare, Play, Plus, RefreshCw, Sigma } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock active projects
const activeProjects = [
  {
    id: "proj1",
    title: "Neural Quantum Interfaces",
    stage: "Data Analysis",
    progress: 67,
    startDate: "2023-11-15",
    estimatedCompletion: "2024-01-20",
    domain: "Quantum Computing"
  },
  {
    id: "proj2",
    title: "Biomimetic Material Synthesis",
    stage: "Experiment Design",
    progress: 32,
    startDate: "2023-12-05",
    estimatedCompletion: "2024-02-28",
    domain: "Materials Science"
  },
  {
    id: "proj3",
    title: "Climate Pattern Prediction Models",
    stage: "Literature Review",
    progress: 18,
    startDate: "2023-12-10",
    estimatedCompletion: "2024-03-15",
    domain: "Environmental Science"
  }
];

// Mock recent activities
const recentActivities = [
  {
    id: "act1",
    action: "Completed peer review",
    target: "Quantum Neural Networks paper",
    timestamp: "2 hours ago"
  },
  {
    id: "act2",
    action: "Generated new hypothesis",
    target: "Biomimetic Material Synthesis project",
    timestamp: "5 hours ago"
  },
  {
    id: "act3",
    action: "Updated methodology",
    target: "Climate Pattern Prediction project",
    timestamp: "yesterday"
  },
  {
    id: "act4",
    action: "Analyzed experimental results",
    target: "Neural Quantum Interfaces project",
    timestamp: "yesterday"
  },
  {
    id: "act5",
    action: "Published research paper",
    target: "Advanced Photovoltaic Efficiency",
    timestamp: "3 days ago"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isInitiatingResearch, setIsInitiatingResearch] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");

  const handleInitiateResearch = () => {
    if (!researchTopic.trim()) {
      toast({
        title: "Empty Research Topic",
        description: "Please enter a research topic to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsInitiatingResearch(true);
    
    // Simulate research initiation
    setTimeout(() => {
      setIsInitiatingResearch(false);
      setResearchTopic("");
      toast({
        title: "Research Initiated",
        description: `New research on "${researchTopic}" has been initiated successfully.`,
      });
    }, 2000);
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Scientist Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control the AI research system</p>
        </div>
        <Button className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Projects</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500">+1</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Research</CardDescription>
            <CardTitle className="text-2xl">28</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500">+6</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peer Reviews</CardDescription>
            <CardTitle className="text-2xl">42</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500">+8</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current AI Version</CardDescription>
            <CardTitle className="text-2xl">v3.0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              Updated 2 weeks ago
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Initiate Research */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Initiate New Research</CardTitle>
          <CardDescription>
            Provide a research topic or question for the AI Scientist to explore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter research topic or question..."
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleInitiateResearch} 
              disabled={isInitiatingResearch}
              className="gap-2"
            >
              {isInitiatingResearch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Initiate Research
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Suggested topics: Quantum computing applications, sustainable materials, neural network architectures</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Active Research Projects</CardTitle>
                <CardDescription>
                  Currently ongoing AI research initiatives
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.domain}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                        <Sigma className="w-3.5 h-3.5" />
                        {project.stage}
                      </div>
                    </div>
                    
                    <div className="w-full bg-secondary/50 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Started: {project.startDate}
                      </div>
                      <div>Est. completion: {project.estimatedCompletion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                View All Projects <ArrowRight className="w-3 h-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Activity and Tools */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed by the AI Scientist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{activity.action}</span> on {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                View All Activity <ArrowRight className="w-3 h-3" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Researcher Tools</CardTitle>
              <CardDescription>Tools for interacting with the AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" /> Chat with AI Scientist
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Research Template Builder
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <RefreshCw className="w-4 h-4" /> Force Evolution Cycle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
