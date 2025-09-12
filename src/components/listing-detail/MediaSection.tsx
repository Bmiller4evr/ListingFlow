import { ImageWithFallback } from "../figma/ImageWithFallback";
import { DetailedPropertyListing } from "../../data/listingDetailMock";

interface MediaSectionProps {
  listing: DetailedPropertyListing;
}

export function MediaSection({ listing }: MediaSectionProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listing.images.map((image) => (
          <div 
            key={image.id}
            className="relative rounded-lg overflow-hidden bg-muted/20 border border-border/50"
          >
            {image.isPrimary && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                  Primary
                </span>
              </div>
            )}
            <ImageWithFallback
              src={image.url}
              alt={image.caption || "Property image"}
              width={400}
              height={300}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}