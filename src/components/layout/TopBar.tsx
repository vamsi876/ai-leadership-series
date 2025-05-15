import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopBarProps {
  toggleSidebar: () => void;
}

export const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>('');

  useEffect(() => {
    const fetchProfilePic = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) return;
      const { data, error } = await supabase
        .from('users_personal_information')
        .select('profile_picture_url, full_name')
        .eq('email', user.email)
        .single();
      if (data) {
        setProfilePic(data.profile_picture_url || null);
        if (data.full_name) {
          setInitials(data.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase());
        }
      }
    };
    fetchProfilePic();
  }, []);

  return (
    <header className="bg-gradient-to-r from-green-50 via-white to-green-50 z-10 shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between backdrop-blur-sm bg-white/30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden hover:bg-green-100/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu text-green-900"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-0 hover:bg-green-100/50 transition-colors" 
            onClick={() => navigate('/profile')}
          >
            <Avatar className="h-9 w-9 ring-2 ring-green-100">
              {profilePic ? (
                <AvatarImage src={profilePic} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-green-900 text-white">{initials}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};
