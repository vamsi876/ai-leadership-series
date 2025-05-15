import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';

const OWNER_EMAIL = 'owner@example.com'; // <-- Replace with your real owner email

interface Message {
  id: string;
  sender_id: string;
  sender_email: string;
  recipient_id: string;
  recipient_email: string;
  content: string;
  created_at: string;
}

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user and owner info
  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Fetch owner user by email
      const { data: ownerData } = await supabase
        .from('users_personal_information')
        .select('user_id, email')
        .eq('email', OWNER_EMAIL)
        .single();
      setOwner(ownerData);
    };
    fetchUsers();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!user || !owner) return;
    setLoading(true);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${owner.user_id}),and(sender_id.eq.${owner.user_id},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const msg: Message = payload.new;
        if (
          (msg.sender_id === user.id && msg.recipient_id === owner.user_id) ||
          (msg.sender_id === owner.user_id && msg.recipient_id === user.id)
        ) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, owner]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || !user || !owner) return;
    await supabase.from('messages').insert({
      sender_id: user.id,
      sender_email: user.email,
      recipient_id: owner.user_id,
      recipient_email: OWNER_EMAIL,
      content: input.trim(),
    });
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green-900 text-white rounded-full p-4 shadow-lg hover:bg-green-800 transition"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay for click-away close */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          {/* Chat panel */}
          <div
            className="fixed bottom-24 right-6 w-full max-w-md md:bottom-24 md:right-6 md:w-96 z-50 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] border animate-fade-in"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-bold text-lg">Chat with Owner</div>
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow
                      ${msg.sender_id === user.id ? 'ml-auto bg-green-100 text-green-900' : 'mr-auto bg-gray-200 text-gray-800'}`}
                  >
                    {msg.content}
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              className="flex items-center gap-2 p-4 border-t bg-white"
              onSubmit={e => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                autoFocus
              />
              <Button type="submit" className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}; 