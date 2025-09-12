import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PropertySurveillanceFormProps {
  onNext: () => void;
  onBack: () => void;
  data?: any;
  onDataChange?: (data: any) => void;
}

export function PropertySurveillanceForm({ 
  onNext, 
  onBack, 
  data, 
  onDataChange 
}: PropertySurveillanceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Surveillance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Security & Monitoring</h3>
          <p className="text-muted-foreground mb-6">
            Information about property security systems and monitoring setup.
          </p>
          <p className="text-sm text-muted-foreground">
            This form will be implemented with security system details.
          </p>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}