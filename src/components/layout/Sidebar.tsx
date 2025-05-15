import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Calendar, FileText, Home, List, Video, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
      isActive ? "bg-sidebar-accent font-medium" : ""
    )}
  >
    <Icon size={18} />
    <span className="sidebar-label">{label}</span>
  </NavLink>
);

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "bg-green-900 h-screen fixed lg:relative transition-all duration-300 z-20",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {isOpen ? (
            <h1 className="text-sidebar-foreground font-bold text-xl">AI Leadership</h1>
          ) : (
            <span />
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            className="text-sidebar-foreground"
          >
            {isOpen ? (
              <ChevronLeft />
            ) : (
              <Menu />
            )}
          </Button>
        </div>
        <div className="flex-1 px-1 py-4 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {[
              { to: '/', icon: Home, label: 'Dashboard' },
              { to: '/courses', icon: Book, label: 'Leadership Series' },
              { to: '/resources', icon: FileText, label: 'Resource Library' },
              { to: '/videos', icon: Video, label: 'Training Videos' },
              { to: '/prompts', icon: List, label: 'Prompt Library' },
            ].map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                    isActive ? 'bg-sidebar-accent font-medium' : '',
                    !isOpen && 'justify-center px-2'
                  )
                }
              >
                {React.createElement(icon, { size: 20 })}
                {isOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 mt-auto flex justify-center">
          {/* Show only expand button when collapsed */}
          {!isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="text-sidebar-foreground"
            >
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
