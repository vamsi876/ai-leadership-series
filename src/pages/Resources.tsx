
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText } from 'lucide-react';

const resourcesData = [
  {
    id: '1',
    title: 'The Future of Leadership in AI-First Organizations',
    description: 'Explore how leadership roles are evolving in organizations that prioritize artificial intelligence.',
    type: 'Article',
    category: 'Strategy',
    date: 'May 10, 2025',
  },
  {
    id: '2',
    title: '10 Essential AI Leadership Skills for 2025',
    description: 'A comprehensive guide to the most important skills for leaders in AI-driven organizations.',
    type: 'Guide',
    category: 'Skills',
    date: 'May 8, 2025',
  },
  {
    id: '3',
    title: 'Ethical AI Implementation Framework',
    description: 'A structured approach to implementing AI solutions with ethical considerations at the forefront.',
    type: 'Template',
    category: 'Ethics',
    date: 'May 5, 2025',
  },
  {
    id: '4',
    title: 'AI Strategy Planning Worksheet',
    description: 'Interactive worksheet to help leaders develop comprehensive AI strategies for their organizations.',
    type: 'Worksheet',
    category: 'Strategy',
    date: 'May 2, 2025',
  },
  {
    id: '5',
    title: 'AI Governance Best Practices',
    description: 'Learn how to establish effective governance structures for AI implementation and usage.',
    type: 'Whitepaper',
    category: 'Governance',
    date: 'April 28, 2025',
  },
  {
    id: '6',
    title: 'Change Management for AI Transformation',
    description: 'Strategies and tactics for managing organizational change during AI adoption.',
    type: 'Guide',
    category: 'Change',
    date: 'April 25, 2025',
  },
];

const ResourceCard = ({ resource }: { resource: typeof resourcesData[0] }) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription className="mt-2">{resource.description}</CardDescription>
          </div>
          <div className="p-3 rounded-full bg-ai-lightGray">
            <FileText className="h-5 w-5 text-ai-blue" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {resource.type}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            {resource.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">{resource.date}</span>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const Resources = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
          <p className="text-muted-foreground">Access leadership resources, articles, and tools</p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData
                .filter(resource => resource.type === "Article")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData
                .filter(resource => resource.type === "Guide")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData
                .filter(resource => resource.type === "Template")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="whitepapers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData
                .filter(resource => resource.type === "Whitepaper")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Resources;
