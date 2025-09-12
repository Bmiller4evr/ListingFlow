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
  placeholder = "Enter Your Address",
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
      // For demo purposes, skip Google Maps API loading and use fallback behavior
      setHasError(true);
      setIsLoading(false);
      // Google Maps API is intentionally disabled in demo environment
      return;

      // The original code below would be used in production with a valid API key
      /*
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

      // Load Google Maps script
      const script = document.createElement('script');
      // In production, replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&loading=async`;
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
      */
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
      try {
        // Use the new PlaceAutocompleteElement API
        if (window.google?.maps?.places?.PlaceAutocompleteElement) {
          // Create the new PlaceAutocompleteElement
          autocompleteRef.current = new window.google.maps.places.PlaceAutocompleteElement({
            types: ['address'],
            componentRestrictions: { country: 'us' },
            fields: ['formattedAddress', 'geometry', 'addressComponents', 'id']
          });

          // Connect to the input element
          autocompleteRef.current.connectTo(inputRef.current);

          // Listen for place selection
          autocompleteRef.current.addEventListener('gmp-placeselect', (event: any) => {
            const place = event.place;
            if (place && place.formattedAddress) {
              setAddress(place.formattedAddress);
              setSelectedPlace({
                formatted_address: place.formattedAddress,
                geometry: place.geometry,
                address_components: place.addressComponents,
                place_id: place.id
              });
            }
          });
        } else {
          // Fallback to legacy Autocomplete if PlaceAutocompleteElement is not available
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['address'],
              componentRestrictions: { country: 'us' },
              fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
            }
          ) as any;

          (autocompleteRef.current as any).addListener('place_changed', () => {
            const place = (autocompleteRef.current as any)?.getPlace();
            if (place && place.formatted_address) {
              setAddress(place.formatted_address);
              setSelectedPlace(place);
            }
          });
        }
      } catch (error) {
        console.warn('Failed to initialize Google Places autocomplete:', error);
        setHasError(true);
      }
    }

    return () => {
      if (autocompleteRef.current) {
        // Clean up listeners
        if (typeof (autocompleteRef.current as any).removeEventListener === 'function') {
          // New API cleanup
          (autocompleteRef.current as any).removeEventListener('gmp-placeselect');
        } else {
          // Legacy API cleanup
          window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current as any);
        }
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
    if (address.trim()) {
      onAddressSelected(address, selectedPlace);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && address.trim()) {
      handleGetStarted();
    }
  };

  const isValidAddress = address.trim().length > 5; // Basic validation

  return (
    <div className={cn("relative max-w-2xl", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={hasError ? "Enter your full address (e.g., 123 Main St, City, State)" : (isLoading ? "Loading address suggestions..." : placeholder)}
          value={address}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-32 py-4 text-lg border-2 focus:border-primary transition-colors h-14"
          disabled={isLoading}
        />
        <Button
          onClick={handleGetStarted}
          disabled={!isValidAddress || isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-lg bg-blue hover:bg-blue/90 text-blue-foreground border-blue"
        >
          {isLoading ? "Loading..." : "Get Started"}
        </Button>
      </div>
      {hasError && (
        <p className="text-xs text-muted-foreground mt-2">
          <span className="text-amber-600 dark:text-amber-400">
            Address autocomplete temporarily unavailable. You can still enter your address manually.
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