
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, FileText, GitMerge, RotateCw } from "lucide-react";
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
            Self-Evolving AI Scientist
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            An autonomous AI system that generates research, evolves its capabilities, and leverages 
            peer review to validate its findings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/research")}
              className="gap-2"
            >
              Explore Research <ArrowRight className="w-4 h-4" />
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
        <h2 className="text-3xl font-bold text-center mb-12">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Research Generation</CardTitle>
              <CardDescription>
                Autonomously generates research across multiple scientific domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The AI system formulates hypotheses, designs experiments, collects data,
                and draws conclusions from its findings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RotateCw className="w-8 h-8 text-primary mb-4" />
              <CardTitle>Self-Evolution</CardTitle>
              <CardDescription>
                Continuously improves its own capabilities and methodologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Through feedback loops and reinforcement learning, the system evolves to produce
                increasingly sophisticated and accurate research.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GitMerge className="w-8 h-8 text-primary mb-4" />
              <CardTitle>AI Peer Review</CardTitle>
              <CardDescription>
                Validates findings through rigorous AI-powered peer review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Multiple AI reviewers assess each piece of research, identifying strengths,
                weaknesses, and suggesting improvements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">Ready to explore the future of AI-driven science?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Discover how our self-evolving AI system is transforming scientific research through autonomous learning and peer validation.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
