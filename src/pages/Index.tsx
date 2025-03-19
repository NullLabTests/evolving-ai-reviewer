
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, FileText, GitMerge, RotateCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            AI-Powered Research Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Generate comprehensive, novel research papers on any topic using advanced AI techniques and 
            ArXiv integration. Perfect for researchers, students, and knowledge enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/research")}
              className="gap-2"
            >
              Generate Research <Sparkles className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/evolution")}
              className="gap-2"
            >
              View Evolution <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-4" />
              <CardTitle>ArXiv Integration</CardTitle>
              <CardDescription>
                Leverages the ArXiv database for up-to-date academic research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our system connects directly to ArXiv's API to access the latest scientific papers across 
                multiple disciplines, ensuring your generated research is grounded in current knowledge.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="w-8 h-8 text-primary mb-4" />
              <CardTitle>AI Scientist Engine</CardTitle>
              <CardDescription>
                Powered by advanced AI research generation algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The AI Scientist core processes information, identifies patterns, and generates novel research 
                including hypotheses, methodologies, results, and conclusions tailored to your chosen topic.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GitMerge className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Peer Review System</CardTitle>
              <CardDescription>
                Validates research through AI-powered critical analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Each generated paper undergoes automated peer review by specialized AI models, evaluating 
                methodology, conclusions, and overall quality to ensure research validity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">Ready to generate groundbreaking research?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Enter any research topic and let our AI-powered system create a comprehensive, 
              peer-reviewed paper in minutes.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/research")}
              className="gap-2"
            >
              Start Generating <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
