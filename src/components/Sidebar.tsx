import { UserCircle, LogOut, Building, MessageSquare, Eye, CheckSquare, FileText, Wrench, Home as HomeIcon, Menu, X, HandHeart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { View } from "../types/app";

interface SidebarProps {
  collapsed: boolean;
  onMenuClick: (view: View) => void;
  activeView: View;
  onToggleCollapse: () => void;
  userEmail?: string | null;
  onSignOut?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ collapsed, onMenuClick, activeView, onToggleCollapse, userEmail, onSignOut, isMobile = false }: SidebarProps) {
  const handleClick = (view: View) => {
    onMenuClick(view);
    // Auto-close sidebar on mobile when a menu item is clicked
    if (isMobile && !collapsed) {
      onToggleCollapse();
    }
  };

  const getButtonClass = (view: string) => {
    const isActive = activeView === view;
    const baseClass = `w-full justify-${(collapsed && !isMobile) ? 'center' : 'start'} mb-1 transition-all duration-200 relative ${
      isMobile ? 'h-12' : ''
    }`;
    
    if (isActive) {
      return `${baseClass} bg-brand-primary text-white hover:bg-brand-primary hover:text-white border-0`;
    }
    return `${baseClass} hover:bg-accent hover:text-accent-foreground text-text-secondary`;
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed top-4 left-4 z-50 bg-card-elevated/95 backdrop-blur-sm border-border shadow-lg hover:bg-brand-primary hover:text-white hover:border-brand-primary ${
          isMobile ? 'h-12 w-12' : ''
        }`}
        onClick={onToggleCollapse}
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div 
        className={`
          h-screen bg-card text-text-secondary flex flex-col transition-all duration-300 ease-in-out border-r border-border shadow-lg
          ${isMobile 
            ? collapsed 
              ? '-translate-x-full w-[280px] fixed left-0 top-0 z-50' 
              : 'translate-x-0 w-[280px] fixed left-0 top-0 z-50'
            : collapsed 
              ? 'w-16' 
              : 'w-[240px]'
          }
        `}
      >
        {/* Header */}
        <div className={`flex items-center gap-2 mb-6 p-4 ${isMobile ? 'pt-20' : 'pt-16'}`}>
          {(!collapsed || isMobile) ? (
            <h2 className="font-semibold">Access Realty</h2>
          ) : (
            <div className="flex justify-center w-full">
              <Building className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto">

          
          <Button 
            variant="ghost" 
            className={getButtonClass('listings')}
            onClick={() => handleClick('listings')}
            title={collapsed ? 'My Listings' : undefined}
          >
            <Building className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>My Listings</span>}
            {collapsed && !isMobile && activeView === 'listings' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('showings')}
            onClick={() => handleClick('showings')}
            title={collapsed ? 'Showings' : undefined}
          >
            <Eye className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Showings</span>}
            {collapsed && !isMobile && activeView === 'showings' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('offers')}
            onClick={() => handleClick('offers')}
            title={collapsed ? 'Offers' : undefined}
          >
            <HandHeart className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Offers</span>}
            {collapsed && !isMobile && activeView === 'offers' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('documents')}
            onClick={() => handleClick('documents')}
            title={collapsed ? 'Documents' : undefined}
          >
            <FileText className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Documents</span>}
            {collapsed && !isMobile && activeView === 'documents' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('todo')}
            onClick={() => handleClick('todo')}
            title={collapsed ? 'To Do List' : undefined}
          >
            <CheckSquare className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>To Do List</span>}
            {collapsed && !isMobile && activeView === 'todo' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('messages')}
            onClick={() => handleClick('messages')}
            title={collapsed ? 'Messages' : undefined}
          >
            <MessageSquare className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Messages</span>}
            {collapsed && !isMobile && activeView === 'messages' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={getButtonClass('repairs')}
            onClick={() => handleClick('repairs')}
            title={collapsed ? 'Repairs Help' : undefined}
          >
            <Wrench className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Repairs Help</span>}
            {collapsed && !isMobile && activeView === 'repairs' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>

          <Separator className="my-4" />
          

          
          <Button 
            variant="ghost" 
            className={getButtonClass('account')}
            onClick={() => handleClick('account')}
            title={collapsed ? 'My Account' : undefined}
          >
            <UserCircle className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>My Account</span>}
            {collapsed && !isMobile && activeView === 'account' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>

          {/* Tools Section */}
          <Separator className="my-4" />
          {(!collapsed || isMobile) && (
            <div className="mb-2 px-2 text-xs text-sidebar-foreground/60 font-medium uppercase">
              Tools
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className={getButtonClass('find-home')}
            onClick={() => handleClick('find-home')}
            title={collapsed ? 'Find My Next Home' : undefined}
          >
            <HomeIcon className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Find My Next Home</span>}
            {collapsed && !isMobile && activeView === 'find-home' && (
              <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 space-y-2">
          {/* User Profile */}
          {userEmail && (
            <div className={`flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50 ${(collapsed && !isMobile) ? 'justify-center' : ''}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userEmail} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {(!collapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">
                    {userEmail.split('@')[0]}
                  </div>
                  <div className="text-xs text-sidebar-foreground/60 truncate">
                    {userEmail}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Logout Button */}
          <Button 
            variant="ghost" 
            className={`flex items-center justify-${(collapsed && !isMobile) ? 'center' : 'start'} w-full text-destructive hover:bg-destructive/10 ${
              isMobile ? 'h-12' : ''
            }`}
            title={(collapsed && !isMobile) ? 'Log out' : undefined}
            onClick={onSignOut}
          >
            <LogOut className={`h-5 w-5 ${(!collapsed || isMobile) ? 'mr-2' : ''}`} />
            {(!collapsed || isMobile) && <span>Log out</span>}
          </Button>
        </div>
      </div>
    </>
  );
}