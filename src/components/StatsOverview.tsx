import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { propertyStats } from "../data/mockData";

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Total Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{propertyStats.totalListings}</div>
          <p className="text-xs text-muted-foreground">Properties in your account</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Active Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{propertyStats.activeListings}</div>
          <p className="text-xs text-muted-foreground">Properties on the market</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{propertyStats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all listings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Avg. Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${propertyStats.averagePrice.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all listings</p>
        </CardContent>
      </Card>
    </div>
  );
}