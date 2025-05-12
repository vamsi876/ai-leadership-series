
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { List, Search } from 'lucide-react';
import { mockPrompts } from '@/data/mockData';

const PromptCategoryCard = ({ title, description, count }: { title: string, description: string, count: number }) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="p-3 rounded-full bg-ai-lightGray">
            <List className="h-5 w-5 text-ai-blue" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Contains {count} leadership prompts</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Prompts</Button>
      </CardFooter>
    </Card>
  );
};

const popularPrompts = [
  "Create a comprehensive AI adoption strategy for my team",
  "Generate talking points for communicating AI changes to stakeholders",
  "Develop a framework for ethical AI decision making",
  "Create a checklist for evaluating AI vendors and solutions",
  "Draft a communication plan for AI implementation",
];

const Prompts = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prompt Library</h1>
          <p className="text-muted-foreground">Practical AI prompts for leadership applications</p>
        </div>
        
        <div className="mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for prompts..." 
              className="pl-9 py-6"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Popular Prompts</h2>
          <div className="space-y-3">
            {popularPrompts.map((prompt, index) => (
              <div 
                key={index} 
                className="p-4 bg-card border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <p>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Prompt Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPrompts.map(prompt => (
              <PromptCategoryCard 
                key={prompt.id} 
                title={prompt.title} 
                description={prompt.description} 
                count={prompt.count} 
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Prompts;
