import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronRight, Home, MapPin, Building, LogIn } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AddressInput } from "./AddressInput";
import { TrustpilotReviews } from "./TrustpilotReviews";


interface LandingPageProps {
  onStartFlow: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onStartFlow, onSignIn }: LandingPageProps) {
  // Handle when an address is selected from the input
  const handleAddressSelected = (address: string, placeDetails?: any) => {
    // Create a simplified address object
    const addressData = {
      street: address,
      formatted_address: address,
      placeDetails: placeDetails
    };
    
    // Store the address in localStorage
    localStorage.setItem('verifiedAddress', JSON.stringify(addressData));
    
    // Start the listing flow with the address
    onStartFlow();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Sign In button */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Access Realty</span>
          </div>
          <Button 
            onClick={onSignIn}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Access Realty
                <span className="block mt-2 text-primary">The BEST Way to Sell Your Home</span>
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Enjoy access to the MLS, with the largest marketplace for buyers, while only paying for the services you value.
              </p>
              
              <div className="space-y-3 pt-4">
                <AddressInput
                  onAddressSelected={handleAddressSelected}
                  placeholder="Enter Your Address"
                  className="w-full"
                />
              </div>

              <div className="flex items-center pt-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.75v10.5M12 6.75l-4.5 4.5M12 6.75l4.5 4.5"
                      />
                    </svg>
                  ))}
                </div>
                <div className="ml-2">
                  <span className="text-sm font-medium">5.0</span>{" "}
                  <span className="text-sm text-muted-foreground">
                    (2,500+ reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Modern house with sold sign"
                width={550}
                height={550}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/80 p-4 backdrop-blur-sm">
                <p className="text-xs">Get started with your home sale today!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Everything you need to sell your home without the traditional costs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="p-2 rounded-full bg-primary w-fit">
                  <Home className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Self-Service Listings</h3>
                <p className="text-muted-foreground">
                  List your property on the MLS and top real estate sites with professional photos and a virtual tour.
                </p>
                <div className="text-sm text-muted-foreground">
                  Starting at $399 upfront
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="p-2 rounded-full bg-primary w-fit">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Full-Service Selling</h3>
                <p className="text-muted-foreground">
                  Get the expertise of a professional agent with a simple transparent commission structure.
                </p>
                <div className="text-sm text-muted-foreground">
                  2.5% commission, no upfront fees
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Trustpilot Reviews */}
        <TrustpilotReviews />

        {/* How It Works */}
        <section className="py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              We've simplified the process of selling your home
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <span className="text-2xl font-semibold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-bold">Enter Your Address</h3>
              <p className="text-muted-foreground">
                Start by telling us about your property and get an instant valuation.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <span className="text-2xl font-semibold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-bold">Choose Your Plan</h3>
              <p className="text-muted-foreground">
                Select either our Self-Service or Full-Service option based on how much assistance you need.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <span className="text-2xl font-semibold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-bold">List & Sell</h3>
              <p className="text-muted-foreground">
                Complete your listing details and get your property in front of thousands of buyers.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Access Realty</span>
            </div>
            
            {/* Landing Page Navigation Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Explore Different Ways to Start</h4>
              <p className="text-sm text-gray-600">Each landing page is designed for different seller needs</p>

            </div>

            <p className="text-sm text-muted-foreground">
              © 2024 Access Realty. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <button className="text-muted-foreground hover:text-foreground">Privacy Policy</button>
              <button className="text-muted-foreground hover:text-foreground">Terms of Service</button>
              <button className="text-muted-foreground hover:text-foreground">Contact Us</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}