import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, FileSignature, Check, Clock, User, Calendar, FileText, Shield, Pen, X } from "lucide-react";

interface SignPaperworkData {
  documentsReviewed: boolean;
  documentsUploaded: string[];
  electronicSignature: boolean;
  notaryRequired: boolean;
  scheduledSigningDate?: string;
  allRequiredDocsSigned: boolean;
}

interface SignPaperworkFormProps {
  onNext: (data: SignPaperworkData) => void;
  onBack?: () => void;
  onExit?: () => void;
  initialData?: Partial<SignPaperworkData>;
}

export function SignPaperworkForm({ onNext, onBack, onExit, initialData }: SignPaperworkFormProps) {
  const [formData, setFormData] = useState<SignPaperworkData>({
    documentsReviewed: initialData?.documentsReviewed || false,
    documentsUploaded: initialData?.documentsUploaded || [],
    electronicSignature: initialData?.electronicSignature || true,
    notaryRequired: initialData?.notaryRequired || false,
    scheduledSigningDate: initialData?.scheduledSigningDate || '',
    allRequiredDocsSigned: initialData?.allRequiredDocsSigned || false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [signaturesComplete, setSignaturesComplete] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleSignDocument = () => {
    setSignaturesComplete(true);
    setFormData(prev => ({ ...prev, allRequiredDocsSigned: true }));
  };

  const handleSubmit = () => {
    onNext({
      ...formData,
      documentsReviewed: true,
      allRequiredDocsSigned: signaturesComplete
    });
  };

  const mockDocuments = [
    {
      title: "Listing Agreement",
      description: "Standard real estate listing agreement",
      pages: 6,
      signed: signaturesComplete
    },
    {
      title: "Property Disclosure Statement",
      description: "Required property condition disclosure",
      pages: 4,
      signed: signaturesComplete
    },
    {
      title: "MLS Authorization",
      description: "Authorization to list on Multiple Listing Service",
      pages: 2,
      signed: signaturesComplete
    }
  ];

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center">
          <FileSignature className="h-5 w-5 mr-2" />
          Review and Sign Paperwork
        </CardTitle>
        <CardDescription>
          Please review and electronically sign the required documents to complete your listing setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-6">
          {/* Document Summary */}
          <div className="grid gap-3">
            {mockDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-muted-foreground">{doc.description} • {doc.pages} pages</p>
                  </div>
                </div>
                <Badge variant={doc.signed ? "default" : "secondary"}>
                  {doc.signed ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Signed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            ))}
          </div>

          <Separator />

          {/* Mock DocuSign Interface */}
          <div className="border rounded-lg overflow-hidden">
            {/* DocuSign Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-blue-600 px-2 py-1 rounded text-sm font-medium">
                    DocuSign
                  </div>
                  <span className="text-blue-100">Listing Agreement - Access Realty</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Secure Session</span>
                </div>
              </div>
            </div>

            {/* DocuSign Navigation */}
            <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sarah Johnson</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of 6
              </div>
            </div>

            {/* Mock PDF Content */}
            <div className="bg-white p-6 min-h-[400px] relative">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">EXCLUSIVE RIGHT TO SELL LISTING AGREEMENT</h3>
                  <p className="text-sm text-muted-foreground mt-2">Access Realty</p>
                </div>

                <div className="space-y-3 text-sm">
                  <p><strong>Property Address:</strong> 123 Oak Street, Anytown, ST 12345</p>
                  <p><strong>Listing Price:</strong> $450,000</p>
                  <p><strong>Commission:</strong> 2.5% (Self-Service Plan)</p>
                  <p><strong>Listing Period:</strong> 6 months from date of agreement</p>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-sm">
                    The Seller hereby grants to Access Realty the exclusive right to sell the above-described property 
                    for the period specified herein, under the terms and conditions set forth in this agreement.
                  </p>
                  
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      <strong>Signature Required:</strong> Please sign below to authorize the listing of your property.
                    </p>
                  </div>
                </div>

                {/* Signature Field */}
                <div className="mt-8 border-2 border-dashed border-blue-300 p-4 rounded-lg bg-blue-50">
                  {!signaturesComplete ? (
                    <div className="text-center">
                      <Pen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 mb-3">Click to sign electronically</p>
                      <Button onClick={handleSignDocument} className="bg-blue-600 hover:bg-blue-700">
                        <Pen className="h-4 w-4 mr-2" />
                        Sign Here
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="italic text-blue-800 text-lg mb-2" style={{ fontFamily: 'cursive' }}>
                        Sarah Johnson
                      </div>
                      <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <Check className="h-3 w-3" />
                        Signed electronically on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DocuSign Footer */}
            <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 6}
                  onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
                >
                  Next
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Protected by DocuSign eSignature
              </div>
            </div>
          </div>

          {signaturesComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Check className="h-5 w-5" />
                <p className="font-medium">All documents have been successfully signed!</p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your listing paperwork is complete and will be processed within 24 hours.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Listing Price
                </Button>
              )}
              {onExit && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowExitDialog(true)}
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Exit Setup
                </Button>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!signaturesComplete}
              className="flex items-center"
            >
              Continue to Photos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Listing Setup?</AlertDialogTitle>
            <AlertDialogDescription>
              You're almost done! If you exit now, your progress will be saved but you'll need to complete the paperwork signing to activate your listing. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Setup</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>
              Exit Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}