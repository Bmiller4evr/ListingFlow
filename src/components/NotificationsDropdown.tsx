import { useState, useEffect } from "react";
import {
  Bell,
  X,
  MessageSquare,
  Calendar,
  File,
  DollarSign,
  Wrench,
  AlertCircle,
  ChevronRight,
  Settings,
  Check,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import notificationService, {
  Notification,
  NotificationType,
  NotificationPreferences,
  defaultPreferences
} from "../services/notificationService";

// Format date relative to now
const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Get icon for notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "message":
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case "showing":
      return <Calendar className="w-4 h-4 text-green-500" />;
    case "document":
      return <File className="w-4 h-4 text-amber-500" />;
    case "offer":
      return <DollarSign className="w-4 h-4 text-purple-500" />;
    case "repair":
      return <Wrench className="w-4 h-4 text-orange-500" />;
    case "transaction":
      return <Check className="w-4 h-4 text-emerald-500" />;
    case "system":
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

// Individual notification item
const NotificationItem = ({ 
  notification,
  onMarkAsRead,
  onClearNotification
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClearNotification: (id: string) => void;
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // In a real app, this would navigate to the action URL
    if (notification.actionUrl) {
      console.log("Navigating to:", notification.actionUrl);
      
      // Handle navigation via window.navigateToView if possible
      if (notification.actionUrl.startsWith('/messages') && window.navigateToView) {
        window.navigateToView('messages');
      }
    }
  };
  
  return (
    <div className={`
      p-3 pl-10 relative border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors
      ${notification.read ? 'bg-transparent' : 'bg-blue-50 dark:bg-blue-900/10'}
    `}>
      <div className="absolute left-3 top-3.5">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div onClick={handleClick}>
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onClearNotification(notification.id);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {!notification.read && (
        <span className="absolute top-1/2 left-1 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
      )}
    </div>
  );
};

// Preferences submenu
const NotificationPreferencesMenu = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load preferences on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const prefs = notificationService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      // Fall back to defaults
      setPreferences(defaultPreferences);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update a specific preference
  const updatePreference = (
    type: NotificationType,
    channel: keyof typeof preferences.message,
    value: boolean
  ) => {
    try {
      const updatedPrefs = { ...preferences };
      updatedPrefs[type][channel] = value;
      
      setPreferences(updatedPrefs);
      notificationService.updatePreferences({ [type]: updatedPrefs[type] });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast.error("Failed to update notification preferences");
    }
  };
  
  if (isLoading) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Settings className="h-4 w-4 mr-2" />
          <span>Notification Preferences</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-72">
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }
  
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Settings className="h-4 w-4 mr-2" />
        <span>Notification Preferences</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-72">
          <div className="p-2 space-y-2">
            <h4 className="font-medium text-sm">Notification Channels</h4>
            <p className="text-xs text-muted-foreground">
              Choose how you'd like to be notified for different event types.
            </p>
          </div>
          
          <DropdownMenuSeparator />
          
          {(Object.keys(preferences) as Array<keyof NotificationPreferences>).map((type) => (
            <div key={type} className="p-2 border-b last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                {getNotificationIcon(type as NotificationType)}
                <span className="font-medium capitalize">{type} Notifications</span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${type}-inApp`} className="text-sm font-normal">
                    In-app
                  </Label>
                  <Switch
                    id={`${type}-inApp`}
                    checked={preferences[type].inApp}
                    onCheckedChange={(checked) => updatePreference(type as NotificationType, 'inApp', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${type}-sms`} className="text-sm font-normal">
                    SMS
                  </Label>
                  <Switch
                    id={`${type}-sms`}
                    checked={preferences[type].sms}
                    onCheckedChange={(checked) => updatePreference(type as NotificationType, 'sms', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${type}-email`} className="text-sm font-normal">
                    Email
                  </Label>
                  <Switch
                    id={`${type}-email`}
                    checked={preferences[type].email}
                    onCheckedChange={(checked) => updatePreference(type as NotificationType, 'email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${type}-push`} className="text-sm font-normal">
                    Push
                  </Label>
                  <Switch
                    id={`${type}-push`}
                    checked={preferences[type].push}
                    onCheckedChange={(checked) => updatePreference(type as NotificationType, 'push', checked)}
                  />
                </div>
              </div>
            </div>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

// Main notifications dropdown component
export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load notifications on mount and when dropdown opens
  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen]);
  
  // Initial load
  useEffect(() => {
    refreshNotifications();
  }, []);
  
  // Refresh notifications from service
  const refreshNotifications = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allNotifications = notificationService.getNotifications();
      setNotifications(allNotifications);
      setUnreadCount(notificationService.getUnreadCount());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError("Failed to load notifications");
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const handleMarkAsRead = (id: string) => {
    try {
      notificationService.markAsRead(id);
      refreshNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };
  
  // Mark all as read
  const handleMarkAllAsRead = () => {
    try {
      notificationService.markAllAsRead();
      refreshNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };
  
  // Clear a notification (in a real app, this would remove it from storage)
  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    // In a real app: notificationService.deleteNotification(id);
  };
  
  // Create a test notification (for demonstration purposes)
  const createTestNotification = async () => {
    try {
      await notificationService.createNotification(
        'message',
        'Test Notification',
        'This is a test notification from the notification service.',
        { importance: 'medium' }
      );
      refreshNotifications();
    } catch (error) {
      console.error("Error creating test notification:", error);
      toast.error("Failed to create test notification");
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <ScrollArea className="h-[320px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground text-sm">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="mt-2 text-muted-foreground text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={refreshNotifications}
              >
                Retry
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="py-1">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onClearNotification={handleClearNotification}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-muted rounded-full p-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-muted-foreground text-sm">No notifications</p>
            </div>
          )}
        </ScrollArea>
        
        <Separator />
        
        <div className="p-1">
          <DropdownMenuGroup>
            <NotificationPreferencesMenu />
            {/* Only for demo purposes */}
            <DropdownMenuItem onSelect={(e) => {e.preventDefault(); createTestNotification();}}>
              <Bell className="h-4 w-4 mr-2" />
              <span>Create Test Notification</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ChevronRight className="h-4 w-4 mr-2" />
              <span>View All</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Extend Window interface to include our custom navigation function
declare global {
  interface Window {
    navigateToView?: (view: string) => void;
  }
}