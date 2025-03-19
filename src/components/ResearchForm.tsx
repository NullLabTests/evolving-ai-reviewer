
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ResearchFormProps {
  onSubmit: (topic: string, useArxiv: boolean, depth: string) => Promise<void>;
  isGenerating: boolean;
}

export const ResearchForm = ({ onSubmit, isGenerating }: ResearchFormProps) => {
  const [topic, setTopic] = useState("");
  const [useArxiv, setUseArxiv] = useState(true);
  const [depth, setDepth] = useState<string>("quick");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic, useArxiv, depth);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Research Topic</Label>
        <Input
          id="topic"
          placeholder="e.g., Quantum Computing, Climate Change"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="depth">Research Depth</Label>
        <Select
          value={depth}
          onValueChange={(value) => setDepth(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select depth" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">Quick Analysis</SelectItem>
            <SelectItem value="deep">Deep Research</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Deep research takes longer but produces more detailed content
        </p>
      </div>
      
      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="use-arxiv"
          checked={useArxiv}
          onCheckedChange={setUseArxiv}
        />
        <Label htmlFor="use-arxiv">Use ArXiv data</Label>
      </div>
      
      <Button 
        type="submit" 
        disabled={isGenerating || !topic.trim()} 
        className="w-full mt-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Research
          </>
        )}
      </Button>
    </form>
  );
};
