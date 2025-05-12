
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface RecentResourcesProps {
  resources: Resource[];
}

export const RecentResources = ({ resources }: RecentResourcesProps) => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Resources</CardTitle>
        <CardDescription>Recently added leadership materials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors cursor-pointer">
            <div className="p-2 rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{resource.title}</p>
              <p className="text-xs text-muted-foreground">{resource.type} • {resource.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
