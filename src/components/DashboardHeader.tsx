

interface DashboardHeaderProps {
  currentView?: string;
}

export function DashboardHeader({ currentView = 'listings' }: DashboardHeaderProps) {
  const userName = "John Smith";
  
  const getHeaderContent = () => {
    switch (currentView) {
      case 'listings':
        return {
          title: 'My Listings',
          subtitle: `Welcome back, ${userName}`
        };
      case 'showings':
        return {
          title: 'Showings',
          subtitle: 'Manage and track your property showings'
        };
      case 'documents':
        return {
          title: 'Documents',
          subtitle: 'Manage your listing documents and contracts'
        };
      case 'todo':
        return {
          title: 'To Do List',
          subtitle: 'Track your listing tasks and milestones'
        };
      case 'offers':
        return {
          title: 'Offers',
          subtitle: 'Review and manage offers on your properties'
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Communicate with agents and potential buyers'
        };
      case 'repairs':
        return {
          title: 'Repairs Help',
          subtitle: 'Get assistance with property repairs and improvements'
        };
      case 'account':
        return {
          title: 'My Account',
          subtitle: 'Manage your profile and account settings'
        };
      case 'find-home':
        return {
          title: 'Find My Next Home',
          subtitle: 'Search for your next property'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: `Welcome back, ${userName}`
        };
    }
  };
  
  const { title, subtitle } = getHeaderContent();
  
  return (
    <header className="pb-6">
      <div className="space-y-1">
        <h1 className="text-text-primary">{title}</h1>
        <p className="text-text-muted">{subtitle}</p>
      </div>
    </header>
  );
}

// Extend Window interface to include our custom navigation function
declare global {
  interface Window {
    navigateToView?: (view: string) => void;
  }
}