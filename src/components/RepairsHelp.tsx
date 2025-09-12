import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { 
  Droplet, Zap, Thermometer, Home, PaintBucket, 
  Grid3X3, Trees, Star, Phone, Mail, Globe, Check, 
  Search, MapPin, Clock, Award, Building, Shield
} from "lucide-react";
import { tradeCategories, Contractor, TradeCategory } from "../data/repairsMock";
import { toast } from "sonner@2.0.3";

export function RepairsHelp() {
  const [selectedCategory, setSelectedCategory] = useState<string>(tradeCategories[0].name);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get the selected category data
  const categoryData = tradeCategories.find(cat => cat.name === selectedCategory) || tradeCategories[0];
  
  // Filter contractors based on search query
  const filteredContractors = searchQuery ? 
    categoryData.contractors.filter(contractor => 
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.areasServed.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : 
    categoryData.contractors;
  
  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "droplet": return <Droplet className="h-5 w-5" />;
      case "zap": return <Zap className="h-5 w-5" />;
      case "thermometer": return <Thermometer className="h-5 w-5" />;
      case "home": return <Home className="h-5 w-5" />;
      case "paintbrush": return <PaintBucket className="h-5 w-5" />;
      case "grid-3x3": return <Grid3X3 className="h-5 w-5" />;
      case "trees": return <Trees className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };
  
  const handleContactClick = (contractor: Contractor, method: 'phone' | 'email') => {
    if (method === 'phone') {
      toast.success(`Calling ${contractor.name}...`, {
        description: `Connecting to ${contractor.phone}`
      });
    } else {
      toast.success(`Email draft created for ${contractor.name}`, {
        description: `Ready to send to ${contractor.email}`
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">

        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search contractors by name, service or area..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs 
          defaultValue={tradeCategories[0].name} 
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="mb-8 w-full overflow-x-auto">
            {tradeCategories.map((category) => (
              <TabsTrigger 
                key={category.name} 
                value={category.name}
                className="flex items-center gap-2"
              >
                {getIconComponent(category.icon)}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tradeCategories.map((category) => (
            <TabsContent key={category.name} value={category.name}>
              <div className="mb-6">
                <h2>{category.name} Contractors</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              {filteredContractors.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredContractors.map((contractor) => (
                    <Card key={contractor.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={contractor.imageUrl}
                          alt={contractor.name}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover"
                        />
                        {contractor.verified && (
                          <Badge className="absolute right-2 top-2 bg-primary/90 text-xs">
                            <Check className="mr-1 h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{contractor.name}</CardTitle>
                          <div className="flex items-center">
                            {renderStars(contractor.rating)}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({contractor.reviewCount})
                            </span>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {contractor.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 pb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2 items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{contractor.areasServed.join(", ")}</span>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{contractor.availability}</span>
                          </div>
                          
                          {contractor.pricing && (
                            <div className="flex gap-2 items-center">
                              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{contractor.pricing}</span>
                            </div>
                          )}
                          
                          {contractor.yearsInBusiness && (
                            <div className="flex gap-2 items-center">
                              <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{contractor.yearsInBusiness} years in business</span>
                            </div>
                          )}
                          
                          {contractor.insuranceCoverage && (
                            <div className="flex gap-2 items-center">
                              <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">{contractor.insuranceCoverage}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1" 
                            variant="default"
                            onClick={() => handleContactClick(contractor, 'phone')}
                          >
                            <Phone className="mr-1.5 h-4 w-4" /> Call
                          </Button>
                          <Button 
                            className="flex-1" 
                            variant="outline"
                            onClick={() => handleContactClick(contractor, 'email')}
                          >
                            <Mail className="mr-1.5 h-4 w-4" /> Email
                          </Button>
                          {contractor.website && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={() => window.open(contractor.website, '_blank')}
                            >
                              <Globe className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3>No contractors found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search terms or select a different category.
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}