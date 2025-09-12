import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye, Heart, Users, FileText, DollarSign, TrendingUp, Clock } from "lucide-react";
import { DetailedPropertyListing } from "../../data/listingDetailMock";

interface ListingMetricsHUDProps {
  listing: DetailedPropertyListing;
  isOwner?: boolean;
  onNavigateToShowings?: () => void;
  onNavigateToOffers?: () => void;
}

export function ListingMetricsHUD({ listing, isOwner = true, onNavigateToShowings, onNavigateToOffers }: ListingMetricsHUDProps) {
  // Don't show HUD for draft listings or if not owner
  if (listing.status === 'Draft' || !isOwner) {
    return null;
  }

  // Calculate metrics
  const zillowTraffic = listing.traffic.find(t => t.source === 'Zillow');
  const zillowViews = zillowTraffic?.views || 0;
  const zillowSaves = zillowTraffic?.saves || 0;

  const activeOffers = listing.offers?.filter(offer => offer.status === 'Pending').length || 0;
  const totalOffers = listing.offers?.length || 0;

  const scheduledShowings = listing.showings?.filter(showing => showing.status === 'Scheduled').length || 0;
  
  // Get next showing time
  const nextShowing = listing.showings
    ?.filter(showing => showing.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Zillow Views */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">ZILLOW VIEWS</span>
                </div>
                <div className="text-lg font-semibold">{zillowViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zillow Saves */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">ZILLOW SAVES</span>
                </div>
                <div className="text-lg font-semibold">{zillowSaves.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Saved by buyers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Showings */}
        <Card 
          className="cursor-pointer" 
          onClick={onNavigateToShowings}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">SHOWINGS</span>
                </div>
                <div className="text-lg font-semibold">{scheduledShowings} scheduled</div>
                <div className="text-sm text-muted-foreground">
                  {nextShowing ? `Next: ${nextShowing.time}` : 'None scheduled'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers */}
        <Card 
          className="cursor-pointer" 
          onClick={onNavigateToOffers}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">OFFERS</span>
                </div>
                <div className="text-lg font-semibold">{activeOffers} active</div>
                <div className="text-sm text-muted-foreground">
                  {totalOffers > activeOffers ? `${totalOffers - activeOffers} completed` : activeOffers > 0 ? 'Review needed' : 'No offers yet'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}