import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  file_url?: string;
  article_url?: string;
  thumbnail_url?: string;
  author?: string;
  publish_date?: string;
  tags?: string[];
  metadata?: any;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const downloadUrl = resource.file_url || resource.article_url || '#';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found');
      return;
    }
    console.log('Download clicked:', {
      userId: user.id,
      userIdType: typeof user.id,
      resourceId: resource.id,
      resourceIdType: typeof resource.id,
    });
    const { error } = await supabase.from('resource_progress').upsert({
      user_id: user.id,
      resource_id: resource.id,
      explored: true,
      explored_at: new Date().toISOString(),
    }, { onConflict: ['user_id', 'resource_id'] });
    if (error) {
      console.error('Upsert error:', error);
    }
    // Download will proceed via the <a> tag's href
  };

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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {resource.type}
          </span>
          {resource.category && (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            {resource.category}
          </span>
          )}
          {resource.author && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              {resource.author}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">{resource.publish_date}</span>
        {downloadUrl !== '#' ? (
          <Button asChild variant="outline" size="sm">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const TABS = [
  { value: 'all', label: 'All Resources' },
  { value: 'guide', label: 'Guides' },
  { value: 'template', label: 'Templates' },
  { value: 'whitepaper', label: 'Whitepapers' },
  { value: 'pdf', label: 'PDFs' },
  { value: 'worksheet', label: 'Worksheets' },
];

const ROWS_TO_SHOW = 3;
const COLS = 3;
const RESOURCES_PER_TAB = ROWS_TO_SHOW * COLS;

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('publish_date', { ascending: false });
      if (error) {
        setError('Failed to fetch resources.');
        setLoading(false);
        return;
      }
      setResources(data || []);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const filterByType = (type: string) => {
    let filtered =
      type === 'all'
        ? resources
        : resources.filter(resource => resource.type.toLowerCase() === type.toLowerCase());
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        r => r.title.toLowerCase().includes(s) || (r.description && r.description.toLowerCase().includes(s))
      );
    }
    return filtered;
  };

  const getVisibleResources = (type: string) => {
    const filtered = filterByType(type);
    return showAll[type] ? filtered : filtered.slice(0, RESOURCES_PER_TAB);
  };

  const handleCardClick = (resource: Resource) => setSelectedResource(resource);
  const handleCloseModal = () => setSelectedResource(null);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 md:mb-0">Resource Library</h1>
          <p className="text-muted-foreground">Access leadership resources, articles, and tools</p>
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          />
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg">Loading resources...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
              {TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
          </TabsList>
            {TABS.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getVisibleResources(tab.value).map((resource) => (
                    <div key={resource.id} onClick={() => handleCardClick(resource)} className="cursor-pointer">
                      <ResourceCard resource={resource} />
            </div>
                ))}
            </div>
                {filterByType(tab.value).length > RESOURCES_PER_TAB && (
                  <div className="flex justify-center mt-8">
                    {!showAll[tab.value] ? (
                      <Button
                        onClick={() => setShowAll(prev => ({ ...prev, [tab.value]: true }))}
                        className="px-6 py-2 bg-green-900 text-white rounded-lg shadow hover:bg-green-800 transition font-semibold"
                      >
                        See More Resources
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowAll(prev => ({ ...prev, [tab.value]: false }))}
                        className="px-6 py-2 bg-gray-200 text-green-900 rounded-lg shadow hover:bg-gray-300 transition font-semibold"
                      >
                        See Less Resources
                      </Button>
                    )}
                  </div>
                )}
          </TabsContent>
            ))}
          </Tabs>
        )}
        {/* Modal for resource details */}
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold z-10 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col md:flex-row gap-6">
                {selectedResource.thumbnail_url && selectedResource.type !== 'pdf' && (
                  <img
                    src={selectedResource.thumbnail_url}
                    alt={selectedResource.title}
                    className="w-full md:w-48 h-40 object-cover rounded-lg mb-4 md:mb-0"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedResource.title}</h2>
                  <div className="mb-2 text-muted-foreground">{selectedResource.description}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {selectedResource.type}
                    </span>
                    {selectedResource.category && (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
                        {selectedResource.category}
                      </span>
                    )}
                    {selectedResource.author && (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                        {selectedResource.author}
                      </span>
                    )}
                    {selectedResource.tags && selectedResource.tags.length > 0 && selectedResource.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
                        {tag}
                      </span>
                ))}
            </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {selectedResource.publish_date && (
                      <>Published: {selectedResource.publish_date}</>
                    )}
                  </div>
                  {selectedResource.metadata && (
                    <div className="text-xs text-gray-500 mb-2">
                      {Object.entries(selectedResource.metadata).map(([k, v]) => (
                        <span key={k} className="mr-4">{k}: {v}</span>
                ))}
            </div>
                  )}
                  {/* PDF Viewer */}
                  {selectedResource.type === 'pdf' && selectedResource.file_url && (
                    <div className="w-full my-4">
                      <iframe
                        src={selectedResource.file_url}
                        title="PDF Preview"
                        className="w-full h-96 rounded border"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    {selectedResource.file_url && (
                      <Button asChild variant="default">
                        <a href={selectedResource.file_url} target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      </Button>
                    )}
                    {selectedResource.article_url && (
                      <Button asChild variant="outline">
                        <a href={selectedResource.article_url} target="_blank" rel="noopener noreferrer">
                          View Article
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Resources;
