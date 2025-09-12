import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Home, Calendar, Camera, FileText } from "lucide-react";

interface ListingCreationSuccessProps {
  onComplete: () => void;
  listingData: any;
  propertySpecs?: any;
  userAccount?: any;
  address?: any;
}

export function ListingCreationSuccess({ onComplete, listingData, address }: ListingCreationSuccessProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Your Listing is Being Prepared!</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Congratulations! We have all the information needed to create your professional listing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Photography Scheduled</p>
                <p className="text-sm text-muted-foreground">We'll contact you soon</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Paperwork Ready</p>
                <p className="text-sm text-muted-foreground">Documents being prepared</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Home className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">MLS Listing</p>
                <p className="text-sm text-muted-foreground">Will go live soon</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Camera className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Marketing Materials</p>
                <p className="text-sm text-muted-foreground">Being created</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Our team will contact you within 24 hours</li>
              <li>• Photography will be scheduled at your convenience</li>
              <li>• Listing paperwork will be sent for your signature</li>
              <li>• Your property will go live on the MLS and major websites</li>
            </ul>
          </div>

          <Button onClick={onComplete} className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}