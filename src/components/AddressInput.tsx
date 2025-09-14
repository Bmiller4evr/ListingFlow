import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin } from "lucide-react";
import { cn } from "./ui/utils";

interface AddressInputProps {
  onAddressSelected: (address: string, placeDetails?: any) => void;
  placeholder?: string;
  className?: string;
}

export function AddressInput({ 
  onAddressSelected, 
  placeholder = "Enter your address",
  className 
}: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Google Maps API if not already loaded
  useEffect(() => {
    const initializeGoogleMaps = () => {
      // Check if we have an API key
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY not found. Using fallback behavior.');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setIsLoading(true);
        const checkGoogleMaps = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsLoaded(true);
            setIsLoading(false);
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
          } else {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
        
        // Set timeout for loading
        loadTimeoutRef.current = setTimeout(() => {
          setHasError(true);
          setIsLoading(false);
          console.warn('Google Maps API loading timed out. Using fallback behavior.');
        }, 10000); // 10 second timeout
        
        return;
      }

      setIsLoading(true);

      // Load Google Maps script - only for Places API, no map rendering
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Check if API key is valid by testing a simple API call
        if (window.google && window.google.maps) {
          try {
            setIsLoaded(true);
            setIsLoading(false);
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
          } catch (error) {
            console.warn('Google Maps API key may be invalid. Using fallback behavior.');
            setHasError(true);
            setIsLoaded(false);
            setIsLoading(false);
          }
        }
      };
      script.onerror = () => {
        console.warn('Google Maps API failed to load. Using fallback behavior.');
        setHasError(true);
        setIsLoaded(false);
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
      
      // Handle API key errors
      window.gm_authFailure = () => {
        console.warn('Google Maps API authentication failed. Using fallback behavior.');
        setHasError(true);
        setIsLoaded(false);
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
      
      // Set timeout for loading
      loadTimeoutRef.current = setTimeout(() => {
        setHasError(true);
        setIsLoading(false);
        console.warn('Google Maps API loading timed out. Using fallback behavior.');
      }, 10000); // 10 second timeout
      
      document.head.appendChild(script);
    };

    initializeGoogleMaps();
    
    // Cleanup timeout on unmount
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current && !hasError) {
      // Wait a bit for Places library to fully load
      setTimeout(() => {
        try {
          if (!window.google?.maps?.places) {
            setHasError(true);
            return;
          }

          const initAutocomplete = () => {
            try {
              // Use legacy Autocomplete API which is more reliable
              const autocompleteOptions: google.maps.places.AutocompleteOptions = {
                types: ['address'],
                componentRestrictions: { country: 'us' },
                fields: ['formatted_address', 'geometry', 'address_components', 'place_id'],
                bounds: new window.google.maps.LatLngBounds(
                  new window.google.maps.LatLng(32.5, -97.5),
                  new window.google.maps.LatLng(33.1, -96.5)
                ),
                strictBounds: false
              };

              const autocomplete = new window.google.maps.places.Autocomplete(
                inputRef.current!,
                autocompleteOptions
              );

              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.formatted_address) {
                  setAddress(place.formatted_address);
                  setSelectedPlace(place);
                }
              });

              autocompleteRef.current = autocomplete as any;
              
              // Add CSS to improve dropdown positioning
              const style = document.createElement('style');
              style.textContent = `
                .pac-container {
                  z-index: 9999 !important;
                }
              `;
              if (!document.head.querySelector('style[data-pac-style]')) {
                style.setAttribute('data-pac-style', 'true');
                document.head.appendChild(style);
              }
            } catch (error) {
              console.error('Failed to initialize autocomplete:', error);
              setHasError(true);
            }
          };

          // Initialize autocomplete with DFW bias
          initAutocomplete();
        } catch (error) {
          console.warn('Failed to initialize Google Places autocomplete:', error);
          setHasError(true);
        }
      }, 500);
    }

    return () => {
      if (autocompleteRef.current) {
        // Clean up listeners for legacy API
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current as any);
      }
    };
  }, [isLoaded, hasError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    // Clear selected place if user is typing manually
    if (selectedPlace) {
      setSelectedPlace(null);
    }
  };

  const handleGetStarted = () => {
    // Only proceed if we have a valid address from autocomplete or a reasonably complete address
    if (selectedPlace && selectedPlace.formatted_address) {
      // User selected from autocomplete - this is valid
      onAddressSelected(address, selectedPlace);
    } else if (address.trim().length > 10 && address.includes(' ')) {
      // Manual entry - check it looks like a real address (has space and reasonable length)
      onAddressSelected(address, null);
    }
    // Otherwise, don't submit - the address is too short/invalid
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && address.trim()) {
      handleGetStarted();
    }
  };

  // Address is valid if selected from autocomplete OR looks like a real address
  const isValidAddress = !!(
    (selectedPlace && selectedPlace.formatted_address) || 
    (address.trim().length > 10 && address.includes(' '))
  );

  return (
    <div className={cn("relative max-w-2xl", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={hasError ? "Enter your address" : (isLoading ? "Loading address suggestions..." : placeholder)}
          value={address}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-32 py-4 text-lg border-2 focus:border-primary transition-colors h-14"
          disabled={isLoading}
        />
        <Button
          onClick={handleGetStarted}
          disabled={!isValidAddress || isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? "Loading..." : "Get Started"}
        </Button>
      </div>
      {hasError && (
        <p className="text-xs text-muted-foreground mt-2">
          <span className="text-amber-600 dark:text-amber-400">
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
              ? "Google Maps API key not configured. You can still enter your address manually."
              : "Address autocomplete temporarily unavailable. You can still enter your address manually."
            }
          </span>
        </p>
      )}
    </div>
  );
}

// Extend the Window interface to include Google Maps types
declare global {
  interface Window {
    google: typeof google;
    gm_authFailure: () => void;
  }
}