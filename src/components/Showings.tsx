import { useState, useEffect } from "react";
import { Home, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { 
  calendarEvents, 
  CalendarEvent
} from "../data/calendarMock";
import { mockListings } from "../data/mockData";

// Helper function to format time from ISO string
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to format date from ISO string
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Check if it's today or tomorrow
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

// Helper function to get status badge variant and styling
const getStatusBadgeProps = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return {
        variant: 'outline' as const,
        className: 'text-xs shrink-0 capitalize self-start bg-gray-800 text-white border-gray-800'
      };
    case 'upcoming':
      return {
        variant: 'secondary' as const,
        className: 'text-xs shrink-0 capitalize self-start bg-gray-200 text-gray-700 border-gray-200'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'text-xs shrink-0 capitalize self-start'
      };
  }
};

interface ShowingsProps {
  filterListingId?: string | null;
}

export function Showings({ filterListingId }: ShowingsProps) {
  const [showings, setShowings] = useState<CalendarEvent[]>([]);
  const [filteredShowings, setFilteredShowings] = useState<CalendarEvent[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>(filterListingId || 'all');
  
  // Initialize showings when component mounts (filter to only showing events)
  useEffect(() => {
    if (calendarEvents && Array.isArray(calendarEvents)) {
      const showingEvents = calendarEvents.filter(event => event.type === 'showing');
      setShowings(showingEvents);
      setFilteredShowings(showingEvents);
    } else {
      setShowings([]);
      setFilteredShowings([]);
    }
  }, []);
  
  // Apply property filter when it changes
  useEffect(() => {
    let filtered = Array.isArray(showings) ? showings : [];
    
    if (selectedProperty !== 'all') {
      filtered = filtered.filter(event => event.propertyId === selectedProperty);
    }
    
    setFilteredShowings(filtered);
  }, [showings, selectedProperty]);
  
  const formatShowingTime = (event: CalendarEvent) => {
    if (event.allDay) {
      return "All Day";
    }
    
    const startTime = formatTime(event.start);
    if (event.end) {
      const endTime = formatTime(event.end);
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  // Sort showings by date (newest to oldest)
  const sortedShowings = Array.isArray(filteredShowings) 
    ? [...filteredShowings].sort((a, b) => {
        return new Date(b.start).getTime() - new Date(a.start).getTime();
      })
    : [];
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <Select 
          value={selectedProperty} 
          onValueChange={setSelectedProperty}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {mockListings.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.address.split(',')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        {sortedShowings.length > 0 ? (
          sortedShowings.map((showing) => (
            <Card key={showing.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0">
                    <Home className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <h3 className="font-medium text-sm line-clamp-2 sm:truncate">{showing.title}</h3>
                      <Badge 
                        variant={getStatusBadgeProps(showing.status || 'upcoming').variant}
                        className={getStatusBadgeProps(showing.status || 'upcoming').className}
                      >
                        {showing.status || 'upcoming'}
                      </Badge>
                    </div>
                      
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{formatDate(showing.start)}, {formatShowingTime(showing)}</span>
                        </div>
                      </div>
                      
                    {showing.feedback ? (
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Feedback</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{showing.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ) : showing.status === 'completed' && (
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">No feedback provided</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Home className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-medium mb-1">No Showings Scheduled</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedProperty !== 'all' 
                    ? 'No showings found for the selected property.' 
                    : 'You don\'t have any showings scheduled yet.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}