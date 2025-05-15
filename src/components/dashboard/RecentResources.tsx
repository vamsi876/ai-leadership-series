import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  publish_date?: string;
  file_url?: string;
  article_url?: string;
  thumbnail_url?: string;
  author?: string;
  tags?: string[];
}

export const RecentResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('publish_date', { ascending: false })
          .limit(4);

        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleResourceClick = async (resource: Resource) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('resource_progress').upsert({
      user_id: user.id,
      resource_id: resource.id,
      explored: true,
      explored_at: new Date().toISOString(),
    }, { onConflict: ['user_id', 'resource_id'] });
    navigate(`/resources?resource=${resource.id}`);
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Resources</CardTitle>
        <CardDescription>Latest leadership materials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No resources available</div>
        ) : (
          resources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="block w-full text-left"
            >
              <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors">
                <div className="p-2 rounded-md bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{resource.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{resource.type}</span>
                    {resource.publish_date && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{resource.publish_date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
};
