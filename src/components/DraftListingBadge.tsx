import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface DraftListingBadgeProps {
  onClick: () => void;
  lastUpdated?: string;
  lastStep?: string;
  className?: string;
}

export function DraftListingBadge({ 
  onClick, 
  lastUpdated, 
  lastStep, 
  className 
}: DraftListingBadgeProps) {
  // Format the last step label for display
  const formatStepLabel = (step?: string) => {
    if (!step) return "";
    return step.charAt(0).toUpperCase() + step.slice(1);
  };
  
  // Format the date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge 
              className={`bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 ${className}`}
            >
              Draft
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 py-1 text-xs text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Edit className="h-3 w-3 mr-1" />
              Resume
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-xs">
            <p className="font-medium">Last saved: {formatDate(lastUpdated)}</p>
            {lastStep && <p>Last step: {formatStepLabel(lastStep)}</p>}
            <p className="mt-1">Click to resume editing</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}