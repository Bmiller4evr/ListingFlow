import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";

interface AddressInputProps {
  onAddressSelected: (address: string, placeDetails?: any) => void;
  placeholder?: string;
  className?: string;
}

interface AutocompleteSuggestion {
  placePrediction: {
    text: { text: string };
    placeId: string;
    types: string[];
  };
}

interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

export function AddressInput({ 
  onAddressSelected, 
  placeholder = "Enter your address",
  className 
}: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [hasError, setHasError] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced autocomplete function
  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    setHasError(false);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      throw new Error('API key missing');
    }

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          input: input,
          // Temporarily remove type restrictions to get more results
          // includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
          locationBias: {
            circle: {
              center: { latitude: 32.8968, longitude: -97.0380 }, // DFW Airport
              radius: 50000 // 50km radius (max allowed by Google Places API)
            }
          },
          languageCode: 'en',
          regionCode: 'US'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Places API error:', response.status, errorText);
        throw new Error(`Failed to fetch suggestions: ${response.status}`);
      }

      const data: AutocompleteResponse = await response.json();
      console.log('Google Places API response:', data);
      
      // Show all suggestions (Google API will already filter based on input)
      const allSuggestions = data.suggestions || [];

      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setHasError(true);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounce the API calls
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(address);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [address, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddress(newValue);
  };

  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    const selectedAddress = suggestion.placePrediction.text.text;
    setAddress(selectedAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressSelected(selectedAddress, { placeId: suggestion.placePrediction.placeId });
  };

  const handleGetStarted = () => {
    if (address.trim().length > 5) {
      onAddressSelected(address, null);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && address.trim()) {
        e.preventDefault();
        handleGetStarted();
      }
      return;
    }

    // Handle keyboard navigation in suggestions
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleGetStarted();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Address is valid if it has reasonable length
  const isValidAddress = address.trim().length > 5;

  return (
    <div className={cn("relative max-w-2xl", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-32 py-4 text-lg border-2 focus:border-primary transition-colors h-14"
          autoComplete="off"
        />
        <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
          {isLoadingSuggestions && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          onClick={handleGetStarted}
          disabled={!isValidAddress}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Get Started
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placePrediction.placeId}
              className={cn(
                "w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex items-center gap-3",
                index === selectedSuggestionIndex && "bg-muted"
              )}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{suggestion.placePrediction.text.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-destructive">
            Unable to load address suggestions. Please type your full address.
          </p>
        </div>
      )}
    </div>
  );
}

