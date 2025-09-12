import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Star, Check } from "lucide-react";
import { cn } from "./ui/utils";

// Define review interface
interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  location?: string;
}

// Mock reviews data
const reviews: Review[] = [
  {
    id: "review-1",
    name: "Sarah Johnson",
    rating: 5,
    title: "Sold my home in record time!",
    comment: "Access Realty made selling my house incredibly easy. Their platform is intuitive and the support team was always available when I had questions. The flat fee model saved me over $15,000 in commissions!",
    date: "May 24, 2025",
    verified: true,
    location: "Austin, TX"
  },
  {
    id: "review-2",
    name: "Michael Rodriguez",
    rating: 5,
    title: "Professional service without the commission",
    comment: "I was skeptical about using a self-service platform at first, but Access Realty provided all the tools I needed. My home received multiple offers within the first week, and I saved thousands in commission fees.",
    date: "May 17, 2025",
    verified: true,
    location: "Dallas, TX"
  },
  {
    id: "review-3",
    name: "Jennifer Thompson",
    rating: 4,
    title: "Great experience overall",
    comment: "Their document verification system made the paperwork manageable, and the showing scheduling tool worked flawlessly. The only reason for 4 stars instead of 5 is I wish they had more photographer options in my area.",
    date: "May 12, 2025",
    verified: true,
  },
  {
    id: "review-4",
    name: "David Martinez",
    rating: 5,
    title: "Best decision I made when selling my home",
    comment: "The dashboard made it easy to track showings and offers. I was able to communicate directly with buyers' agents without any issues. Saved me over $20,000 compared to using a traditional realtor.",
    date: "May 5, 2025",
    verified: true,
    location: "Houston, TX"
  },
  {
    id: "review-5",
    name: "Elizabeth Chen",
    rating: 5,
    title: "Transparent and efficient",
    comment: "Everything was straightforward from listing to closing. The property verification was spot-on accurate and the professional photos made my listing stand out. I received three offers in the first weekend!",
    date: "April 30, 2025",
    verified: true,
    location: "San Antonio, TX"
  },
  {
    id: "review-6",
    name: "Robert Wilson",
    rating: 5,
    title: "Excellent support throughout the process",
    comment: "I opted for the full service package and it was worth every penny. My dedicated agent was responsive and knowledgeable. The technology behind the platform is impressive and made everything seamless.",
    date: "April 23, 2025",
    verified: true
  }
];

interface TrustpilotReviewsProps {
  className?: string;
}

export function TrustpilotReviews({ className }: TrustpilotReviewsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate maximum pages based on reviews count and reviews per page
  const maxPages = Math.ceil(reviews.length / reviewsPerPage);
  
  // Update reviews per page based on container width
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      if (width < 640) {
        setReviewsPerPage(1);
      } else if (width < 1024) {
        setReviewsPerPage(2);
      } else {
        setReviewsPerPage(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Move to the next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % maxPages);
  };
  
  // Move to the previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + maxPages) % maxPages);
  };
  
  // Get current reviews for this page
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const displayRating = averageRating.toFixed(1);
  
  // Render stars for a given rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4 mr-0.5",
              star <= rating ? "text-[#00b67a] fill-[#00b67a]" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };
  
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">What Our Customers Are Saying</h2>
          <div className="mt-6 flex flex-col items-center">
            <a 
              href="https://www.trustpilot.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center"
            >
              <div className="flex items-center bg-[#00b67a] text-white px-2 py-1 rounded">
                <svg 
                  viewBox="0 0 126 31" 
                  className="h-6 w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M33.5 9.3c-3.8 0-6.9 2.7-6.9 7.2 0 4.4 3.1 7.2 6.9 7.2 3.8 0 6.9-2.8 6.9-7.2 0-4.6-3.1-7.2-6.9-7.2zm0 11.5c-2.4 0-3.8-1.8-3.8-4.3s1.4-4.3 3.8-4.3c2.4 0 3.8 1.8 3.8 4.3s-1.4 4.3-3.8 4.3zM45.6 9.7h-3.3v13.8h3.1v-5c0-2.9 2-3.7 3.5-3.7.3 0 .6 0 .9.1V9.8c-.3-.1-.6-.1-.9-.1-1.7-.2-3 .7-3.3 2.9V9.7zM55.3 9.3c-1.4 0-2.9.6-3.9 2.1l-.2-1.7h-2.9v13.8h3.1v-8c0-2.3 1.2-3.5 2.9-3.5 1.5 0 2.5 1 2.5 3v8.5h3.1v-9.4c.1-3.1-2.1-4.8-4.6-4.8zM84.7 9.7h-3.3v13.8h3.1v-5c0-2.9 2-3.7 3.5-3.7.3 0 .6 0 .9.1V9.8c-.3-.1-.6-.1-.9-.1-1.7-.2-3 .7-3.3 2.9V9.7zM97.8 9.3c-4.1 0-7 2.7-7 7.2 0 4.4 2.9 7.2 7 7.2 3 0 4.8-1.3 5.9-3.3l-2.5-1.4c-.5 1.1-1.7 1.9-3.4 1.9-1.9 0-3.4-1.2-3.7-3.4h10c.1-.4.1-.8.1-1.2-.1-4.3-2.5-7-6.4-7zm-3.6 5.7c.4-1.9 1.7-3 3.6-3 1.8 0 3 1 3.5 3h-7.1zM126 9.7h-3.7l-3.6 9h-.1l-3.7-9h-3.7l5.7 13.8h3.4z"/>
                  <path d="M107.1 9.3c-1.4 0-2.9.6-4 2.1l-.2-1.7H100v13.8h3.1v-8c0-2.3 1.2-3.5 2.9-3.5 1.5 0 2.5 1 2.5 3v8.5h3.1v-9.4c.1-3.1-2.1-4.8-4.5-4.8zM75.5 9.7h-5V6.1h-3.1v3.6h-2.8v2.8h2.8v7.5c0 3.2 1.9 3.9 4.2 3.9 1 0 1.7-.1 1.7-.1v-2.7c-3.1.1-2.8-1-2.8-1.8v-6.8h5V9.7z"/>
                  <path d="M13.4 0L17 10.2H27.7L19 16.5l3.7 10.3-10-6.5-9.9 6.5 3.7-10.3-8.7-6.3H10z"/>
                </svg>
              </div>
              <div className="ml-2 flex flex-col items-start">
                <div className="flex items-center">
                  <span className="font-bold text-[#00b67a] text-xl">{displayRating}</span>
                  <div className="ml-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Based on {reviews.length} reviews</span>
              </div>
            </a>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-medium">
                        {review.name.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <p className="font-medium">{review.name}</p>
                        {review.location && (
                          <p className="text-xs text-muted-foreground">{review.location}</p>
                        )}
                      </div>
                    </div>
                    {review.verified && (
                      <div className="flex items-center text-[#00b67a] text-xs font-medium">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>
                  
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground flex-grow">{review.comment}</p>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Posted on {review.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {maxPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-sm">
                  Page {currentPage + 1} of {maxPages}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <a 
            href="https://www.trustpilot.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00b67a] hover:underline inline-flex items-center"
          >
            See all reviews on Trustpilot
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}