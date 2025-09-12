import { useState } from "react";
import { Calendar, Home, Clock, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Mock data for all showings (upcoming and completed combined)
const allShowings = [
  // Upcoming showings
  {
    id: "upcoming-1",
    propertyAddress: "1234 Market Street, San Francisco, CA",
    showingDate: "2025-01-20",
    showingTime: "2:00 PM",
    realtorName: "Sarah Johnson",
    realtorCompany: "Bay Area Realty",
    status: "upcoming"
  },
  {
    id: "upcoming-2",
    propertyAddress: "5678 Oak Avenue, Berkeley, CA",
    showingDate: "2025-01-22",
    showingTime: "11:00 AM",
    realtorName: "Michael Chen",
    realtorCompany: "Premium Properties",
    status: "upcoming"
  },
  {
    id: "upcoming-3",
    propertyAddress: "1234 Market Street, San Francisco, CA",
    showingDate: "2025-01-23",
    showingTime: "4:30 PM",
    realtorName: "Lisa Rodriguez",
    realtorCompany: "Golden Gate Properties",
    status: "upcoming"
  },
  {
    id: "upcoming-4",
    propertyAddress: "91011 Sunset Blvd, Oakland, CA",
    showingDate: "2025-01-24",
    showingTime: "1:00 PM",
    realtorName: "David Kim",
    realtorCompany: "Coastal Realty",
    status: "upcoming"
  },
  // Completed showings
  {
    id: "completed-1",
    propertyAddress: "1234 Market Street, San Francisco, CA",
    showingDate: "2025-01-15",
    showingTime: "2:00 PM",
    realtorName: "Sarah Johnson",
    realtorCompany: "Bay Area Realty",
    status: "completed"
  },
  {
    id: "completed-2",
    propertyAddress: "1234 Market Street, San Francisco, CA",
    showingDate: "2025-01-14",
    showingTime: "10:30 AM",
    realtorName: "Michael Chen",
    realtorCompany: "Premium Properties",
    status: "completed"
  },
  {
    id: "completed-3",
    propertyAddress: "5678 Oak Avenue, Berkeley, CA",
    showingDate: "2025-01-13",
    showingTime: "1:00 PM",
    realtorName: "Lisa Rodriguez",
    realtorCompany: "Golden Gate Properties",
    status: "completed"
  },
  {
    id: "completed-4",
    propertyAddress: "1234 Market Street, San Francisco, CA",
    showingDate: "2025-01-12",
    showingTime: "3:15 PM",
    realtorName: "Mark Thompson",
    realtorCompany: "Elite Real Estate",
    status: "completed"
  },
  {
    id: "completed-5",
    propertyAddress: "5678 Oak Avenue, Berkeley, CA",
    showingDate: "2025-01-11",
    showingTime: "9:00 AM",
    realtorName: "Unrepresented Buyer",
    realtorCompany: "",
    status: "completed"
  },
  {
    id: "completed-6",
    propertyAddress: "91011 Sunset Blvd, Oakland, CA",
    showingDate: "2025-01-10",
    showingTime: "4:00 PM",
    realtorName: "Jennifer Davis",
    realtorCompany: "Prime Properties",
    status: "completed"
  }
];

// Extract unique properties for filter dropdown
const uniqueProperties = Array.from(new Set(allShowings.map(showing => showing.propertyAddress)));

const ShowingItem = ({ showing }: { showing: any }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">{showing.propertyAddress}</h4>
            <Badge 
              variant={showing.status === 'upcoming' ? 'default' : 'secondary'}
              className={showing.status === 'upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
            >
              {showing.status === 'upcoming' ? (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Upcoming
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </div>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(showing.showingDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {showing.showingTime}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {showing.realtorName}
            {showing.realtorCompany && ` • ${showing.realtorCompany}`}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ShowingFeedback() {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  
  // Filter showings based on selected property
  const filteredShowings = selectedProperty === "all" 
    ? allShowings 
    : allShowings.filter(showing => showing.propertyAddress === selectedProperty);
  
  // Sort showings: upcoming first (by date), then completed (most recent first)
  const sortedShowings = [...filteredShowings].sort((a, b) => {
    // If one is upcoming and one is completed, upcoming comes first
    if (a.status === 'upcoming' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'upcoming') return 1;
    
    // If both are the same status, sort by date
    const dateA = new Date(`${a.showingDate} ${a.showingTime}`);
    const dateB = new Date(`${b.showingDate} ${b.showingTime}`);
    
    if (a.status === 'upcoming') {
      // For upcoming, earliest date first
      return dateA.getTime() - dateB.getTime();
    } else {
      // For completed, most recent first
      return dateB.getTime() - dateA.getTime();
    }
  });
  
  const upcomingCount = filteredShowings.filter(showing => showing.status === 'upcoming').length;
  const completedCount = filteredShowings.filter(showing => showing.status === 'completed').length;

  return (
    <div>
      {/* Property Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">Filter by property:</label>
        </div>
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties ({allShowings.length} showings)</SelectItem>
            {uniqueProperties.map((property) => {
              const showingCount = allShowings.filter(showing => showing.propertyAddress === property).length;
              return (
                <SelectItem key={property} value={property}>
                  {property} ({showingCount} showings)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-xl font-semibold">{upcomingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-semibold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Showings List */}
      <div className="space-y-4">
        {sortedShowings.length > 0 ? (
          sortedShowings.map(showing => (
            <ShowingItem key={showing.id} showing={showing} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3>No showings found</h3>
              <p className="text-muted-foreground mt-1">
                {selectedProperty === "all" 
                  ? "You don't have any showings scheduled yet" 
                  : "No showings found for the selected property"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}