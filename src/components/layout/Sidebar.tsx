
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Calendar, FileText, Home, List, Lock, Search, User, Video } from 'lucide-react';
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
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen fixed lg:relative transition-all duration-300 z-20",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {isOpen ? (
            <h1 className="text-sidebar-foreground font-bold text-xl">AI Leadership</h1>
          ) : (
            <span className="lg:block hidden text-center w-full text-2xl font-bold">AI</span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-sidebar-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
        
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {isOpen ? (
              <>
                <NavItem to="/" icon={Home} label="Dashboard" />
                <NavItem to="/courses" icon={Book} label="Leadership Series" />
                <NavItem to="/resources" icon={FileText} label="Resource Library" />
                <NavItem to="/videos" icon={Video} label="Training Videos" />
                <NavItem to="/prompts" icon={List} label="Prompt Library" />
                <NavItem to="/progress" icon={Calendar} label="My Progress" />
                <NavItem to="/profile" icon={User} label="Profile" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 pt-4 lg:block hidden">
                <NavLink to="/" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <Home size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/courses" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <Book size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/resources" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <FileText size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/videos" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <Video size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/prompts" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <List size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/progress" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <Calendar size={20} className="text-sidebar-foreground" />
                </NavLink>
                <NavLink to="/profile" className="p-2 rounded-md hover:bg-sidebar-accent">
                  <User size={20} className="text-sidebar-foreground" />
                </NavLink>
              </div>
            )}
          </nav>
        </div>
        
        <div className="p-4">
          {isOpen && (
            <div className="bg-sidebar-accent rounded-lg p-4 text-sidebar-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} />
                <h3 className="font-semibold">Pro Access</h3>
              </div>
              <p className="text-sm mb-3">Unlock all leadership resources</p>
              <Button size="sm" className="w-full bg-sidebar-primary hover:bg-opacity-90 text-white">
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
