import { ToolsLayout } from "./ToolsLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Home, MapPin, Bed, Bath, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

// Mock data for home search results
const mockHomes = [
  {
    id: 1,
    address: "123 Maple Street, Austin, TX 78701",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=3270&auto=format&fit=crop"
  },
  {
    id: 2,
    address: "456 Oak Avenue, Austin, TX 78704",
    price: 575000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=3270&auto=format&fit=crop"
  },
  {
    id: 3,
    address: "789 Pine Boulevard, Austin, TX 78731",
    price: 350000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1450,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=3270&auto=format&fit=crop"
  },
  {
    id: 4,
    address: "101 Cedar Lane, Austin, TX 78745",
    price: 495000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2050,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=3270&auto=format&fit=crop"
  },
];

export function FindNextHome({ onBack }: { onBack: () => void }) {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([200000, 600000]);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockHomes | null>(null);
  
  const handleSearch = () => {
    // In a real app, this would call an API with the search criteria
    // For demo purposes, we'll just return our mock data
    setSearchResults(mockHomes);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <ToolsLayout
      title="Find My Next Home"
      description="Search for your perfect home with our powerful home search tool."
      onBackClick={onBack}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-primary" />
            Search Homes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="City, neighborhood, or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm">Price Range</label>
              <span className="text-sm">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </span>
            </div>
            <Slider
              value={priceRange}
              min={100000}
              max={1000000}
              step={10000}
              onValueChange={(values) => setPriceRange([values[0], values[1]])}
              className="mt-2"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm">Bedrooms</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm">Bathrooms</label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleSearch} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Homes
          </Button>
        </CardContent>
      </Card>
      
      {searchResults && searchResults.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Search Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((home) => (
              <Card key={home.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={home.image}
                    alt={home.address}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1">
                    <span className="font-bold">{formatCurrency(home.price)}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-base mb-2 line-clamp-1">{home.address}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {home.bedrooms} bd
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {home.bathrooms} ba
                    </div>
                    <div className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      {home.sqft.toLocaleString()} sqft
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </ToolsLayout>
  );
}