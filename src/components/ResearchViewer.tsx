
import { useState } from "react";
import { ResearchPaper } from "@/types/research";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, MessageSquare, Book, ChevronUp, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResearchViewerProps {
  research: ResearchPaper;
  onDownload: () => void;
}

export const ResearchViewer = ({ research, onDownload }: ResearchViewerProps) => {
  const [activeTab, setActiveTab] = useState("content");
  const [expanded, setExpanded] = useState(false);

  const formatContent = (content: string) => {
    // Convert markdown to HTML (simple version)
    return content
      .replace(/## (.*)\n/g, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/### (.*)\n/g, '<h3 class="text-lg font-bold mt-3 mb-2">$1</h3>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{research.title}</CardTitle>
            <CardDescription>
              By {research.author} • Published {research.date} • {research.field}
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">{research.reviewScore.toFixed(1)}</span>
            <p className="text-xs text-muted-foreground">Peer Review Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary/30 p-4 rounded-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Abstract</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="h-7 w-7 p-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <p className={`text-muted-foreground ${expanded ? '' : 'line-clamp-3'}`}>
            {research.abstract}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content" className="flex gap-2 items-center">
              <Book className="h-4 w-4" /> Content
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" /> Metrics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: formatContent(research.content) }}
            />
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            {research.reviews.map((review, index) => (
              <Card key={index} className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md">{review.reviewer}</CardTitle>
                    <span className="text-primary font-medium">{review.score.toFixed(1)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Word Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{research.wordCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total words in document</p>
                </CardContent>
              </Card>

              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Citations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{research.citations}</p>
                  <p className="text-sm text-muted-foreground">References cited</p>
                </CardContent>
              </Card>
              
              <Card className="border border-muted md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Integration Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      This research was generated using AI Scientist and ArXiv integration. 
                      In production, this would connect to the Python backend for real-time 
                      research generation and analysis.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" size="sm" className="gap-2" onClick={onDownload}>
          <Download className="w-4 h-4" /> Download
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};
