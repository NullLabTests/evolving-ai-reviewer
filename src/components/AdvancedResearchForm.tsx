/**
 * Advanced Research Form Component
 * Enhanced form with AI provider selection, real-time collaboration, and advanced options
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  Brain, 
  Zap, 
  Users, 
  Settings, 
  FileText, 
  Clock, 
  TrendingUp,
  Globe,
  Database,
  Shield,
  Sparkles
} from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

// Form validation schema
const researchSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters').max(200, 'Topic must be less than 200 characters'),
  depth: z.enum(['quick', 'medium', 'deep'], {
    required_error: 'Please select a research depth',
  }),
  provider: z.enum(['openai', 'anthropic', 'cohere'], {
    required_error: 'Please select an AI provider',
  }),
  useArxiv: z.boolean().default(false),
  collaborationEnabled: z.boolean().default(false),
  maxCitations: z.number().min(1).max(20).default(5),
  creativity: z.number().min(0).max(1).default(0.7),
  technicalDepth: z.number().min(0).max(1).default(0.8),
  audience: z.enum(['general', 'academic', 'technical'], {
    required_error: 'Please select target audience',
  }),
  language: z.string().default('english'),
  includeMethodology: z.boolean().default(true),
  includeResults: z.boolean().default(true),
  includeDiscussion: z.boolean().default(true),
  customInstructions: z.string().optional(),
});

type ResearchFormValues = z.infer<typeof researchSchema>;

interface AdvancedResearchFormProps {
  onSubmit: (data: ResearchFormValues) => void;
  isLoading?: boolean;
  initialData?: Partial<ResearchFormValues>;
}

export function AdvancedResearchForm({ onSubmit, isLoading = false, initialData }: AdvancedResearchFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [providerStats, setProviderStats] = useState<any[]>([]);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();

  const form = useForm<ResearchFormValues>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      depth: 'medium',
      provider: 'openai',
      useArxiv: false,
      collaborationEnabled: false,
      maxCitations: 5,
      creativity: 0.7,
      technicalDepth: 0.8,
      audience: 'academic',
      language: 'english',
      includeMethodology: true,
      includeResults: true,
      includeDiscussion: true,
      ...initialData,
    },
  });

  const watchedValues = form.watch();

  // Calculate estimated generation time
  useEffect(() => {
    const depthMultipliers = { quick: 1, medium: 2, deep: 4 };
    const providerMultipliers = { openai: 1, anthropic: 1.2, cohere: 0.8 };
    const baseTime = 30; // seconds
    
    const time = baseTime * 
      depthMultipliers[watchedValues.depth] * 
      providerMultipliers[watchedValues.provider] *
      (watchedValues.useArxiv ? 1.5 : 1) *
      (watchedValues.collaborationEnabled ? 1.3 : 1);
    
    setEstimatedTime(Math.round(time));
  }, [watchedValues.depth, watchedValues.provider, watchedValues.useArxiv, watchedValues.collaborationEnabled]);

  // Fetch provider stats
  useEffect(() => {
    const fetchProviderStats = async () => {
      try {
        const response = await fetch('/api/ai/providers');
        const data = await response.json();
        if (data.success) {
          setProviderStats(data.data.stats || []);
        }
      } catch (error) {
        console.error('Failed to fetch provider stats:', error);
      }
    };

    fetchProviderStats();
  }, []);

  const handleSubmit = (data: ResearchFormValues) => {
    onSubmit(data);
  };

  const addCollaborator = (email: string) => {
    if (email && !collaborators.includes(email)) {
      setCollaborators([...collaborators, email]);
    }
  };

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  const providerConfig = {
    openai: {
      name: 'OpenAI GPT-4',
      icon: Brain,
      color: 'bg-green-500',
      description: 'Most versatile and capable model',
      strengths: ['Reasoning', 'Analysis', 'Writing'],
    },
    anthropic: {
      name: 'Anthropic Claude',
      icon: Sparkles,
      color: 'bg-purple-500',
      description: 'Strong on safety and accuracy',
      strengths: ['Safety', 'Accuracy', 'Analysis'],
    },
    cohere: {
      name: 'Cohere Command',
      icon: Zap,
      color: 'bg-blue-500',
      description: 'Fast and efficient',
      strengths: ['Speed', 'Efficiency', 'Cost'],
    },
  };

  const selectedProvider = providerConfig[watchedValues.provider];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Advanced Research Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Research Topic</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your research topic..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select AI provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(providerConfig).map(([key, config]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <config.icon className="h-4 w-4" />
                                      {config.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedProvider && (
                        <Card className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${selectedProvider.color}`}>
                              <selectedProvider.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{selectedProvider.name}</h4>
                              <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {selectedProvider.strengths.map((strength) => (
                                  <Badge key={strength} variant="secondary" className="text-xs">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}

                      <FormField
                        control={form.control}
                        name="depth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Research Depth</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select research depth" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="quick">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Quick (5-10 min)
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Medium (15-25 min)
                                  </div>
                                </SelectItem>
                                <SelectItem value="deep">
                                  <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4" />
                                    Deep (30-45 min)
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select target audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Public</SelectItem>
                                <SelectItem value="academic">Academic/Research</SelectItem>
                                <SelectItem value="technical">Technical Experts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="useArxiv"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include ArXiv Research</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Fetch and analyze related papers from ArXiv
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Estimated time: {estimatedTime}s
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="creativity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Creativity Level: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="technicalDepth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technical Depth: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxCitations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Citations: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={1}
                                max={20}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="german">German</SelectItem>
                                <SelectItem value="chinese">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Include Sections</FormLabel>
                        <FormField
                          control={form.control}
                          name="includeMethodology"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium">
                                Methodology
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeResults"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium">
                                Results
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeDiscussion"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium">
                                Discussion
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="customInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific requirements or constraints for the research..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="collaboration" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="collaborationEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Real-time Collaboration</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Allow others to join and contribute to this research
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchedValues.collaborationEnabled && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <h4 className="font-semibold">Collaborators</h4>
                        <Badge variant="outline" className="ml-auto">
                          {collaborators.length} invited
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter email address..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addCollaborator(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Enter email address..."]') as HTMLInputElement;
                            if (input) {
                              addCollaborator(input.value);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {collaborators.map((collaborator) => (
                          <div key={collaborator} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{collaborator}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCollaborator(collaborator)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>

                      {isConnected && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                          Connected to collaboration server
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Generation Summary</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Topic</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {watchedValues.topic || 'Not specified'}
                        </p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <selectedProvider.icon className="h-4 w-4" />
                          <span className="font-medium">Provider</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedProvider.name}
                        </p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Depth</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">
                          {watchedValues.depth}
                        </p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">Audience</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">
                          {watchedValues.audience}
                        </p>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Features</h5>
                      <div className="flex flex-wrap gap-2">
                        {watchedValues.useArxiv && (
                          <Badge variant="secondary">
                            <Database className="h-3 w-3 mr-1" />
                            ArXiv Integration
                          </Badge>
                        )}
                        {watchedValues.collaborationEnabled && (
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            Collaboration
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          <FileText className="h-3 w-3 mr-1" />
                          {watchedValues.maxCitations} Citations
                        </Badge>
                        <Badge variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Creativity: {watchedValues.creativity}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Estimated Generation Time</h5>
                      <div className="flex items-center gap-2">
                        <Progress value={(estimatedTime / 180) * 100} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                          {estimatedTime}s
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Research
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
