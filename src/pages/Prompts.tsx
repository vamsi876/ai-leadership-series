import React, { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Mail, Calendar, BarChart2, Smile, Edit3, List, MailOpen, MessageSquare, FileText, Users, Check, Copy, Search } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'calendar': <Calendar className="h-8 w-8 text-green-900" />,
  'mail': <Mail className="h-8 w-8 text-green-900" />,
  'bar-chart-2': <BarChart2 className="h-8 w-8 text-green-900" />,
  'smile': <Smile className="h-8 w-8 text-green-900" />,
  'edit-3': <Edit3 className="h-8 w-8 text-green-900" />,
  'list': <List className="h-8 w-8 text-green-900" />,
  'mail-open': <MailOpen className="h-8 w-8 text-green-900" />,
  'message-square': <MessageSquare className="h-8 w-8 text-green-900" />,
  'file-text': <FileText className="h-8 w-8 text-green-900" />,
  'users': <Users className="h-8 w-8 text-green-900" />,
};

interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  category?: string;
  icon?: string;
}

const Prompts: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const INITIAL_DISPLAY_COUNT = 9;

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('prompts').select('*').order('title');
      if (!error && data) setPrompts(data);
      setLoading(false);
    };
    fetchPrompts();
  }, []);

  const handleCopy = async (text: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(promptId);
      // Upsert prompt usage in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('prompt_progress').upsert({
          user_id: user.id,
          prompt_id: promptId,
          used: true,
          used_at: new Date().toISOString(),
        }, { onConflict: ['user_id', 'prompt_id'] });
      }
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSeeMore = () => {
    setDisplayCount(prev => prev + 9); // Load 3 more rows
  };

  const handleSeeLess = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT); // Reset to initial 3 rows
  };

  // Filter prompts based on search query
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    
    const query = searchQuery.toLowerCase().trim();
    return prompts.filter(prompt => 
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query) ||
      prompt.prompt_text.toLowerCase().includes(query)
    );
  }, [prompts, searchQuery]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [searchQuery]);

  const displayedPrompts = filteredPrompts.slice(0, displayCount);
  const hasMore = displayCount < filteredPrompts.length;
  const isExpanded = displayCount > INITIAL_DISPLAY_COUNT;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col gap-6 mb-6">
          <h1 className="text-3xl font-bold">Prompt Library</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              type="text"
              placeholder="Search prompts by title, description, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-green-900 focus:ring-green-900"
            />
          </div>
        </div>
        
        {loading ? (
          <div>Loading prompts...</div>
        ) : (
          <>
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No prompts found matching "{searchQuery}"
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {displayedPrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 cursor-pointer border hover:border-green-900 transition"
                      onClick={() => setSelected(prompt)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {prompt.icon && iconMap[prompt.icon]}
                        <div className="font-semibold text-lg">{prompt.title}</div>
          </div>
                      <div className="text-gray-700 text-sm line-clamp-3">{prompt.description}</div>
        </div>
            ))}
          </div>
                <div className="mt-8 flex justify-center gap-4">
                  {hasMore && (
                    <Button 
                      onClick={handleSeeMore}
                      variant="outline"
                      className="border-green-900 text-green-900 hover:bg-green-50"
                    >
                      See More Prompts
                    </Button>
                  )}
                  {isExpanded && (
                    <Button 
                      onClick={handleSeeLess}
                      variant="outline"
                      className="border-green-900 text-green-900 hover:bg-green-50"
                    >
                      See Less Prompts
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
        <Dialog open={!!selected} onOpenChange={() => {
          setSelected(null);
          setCopiedPromptId(null); // Reset copied state when dialog closes
        }}>
          <DialogContent className="max-w-2xl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {selected.icon && iconMap[selected.icon]}
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription>{selected.description}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="font-semibold mb-2">PROMPT</div>
                  <div className="whitespace-pre-line text-gray-900 mb-4">{selected.prompt_text}</div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCopy(selected.prompt_text, selected.id)}
                    className={`flex items-center gap-2 ${
                      copiedPromptId === selected.id 
                        ? 'border-green-600 text-green-600' 
                        : 'border-green-900 text-green-900'
                    } hover:bg-green-50`}
                  >
                    {copiedPromptId === selected.id ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
        </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Prompts;
