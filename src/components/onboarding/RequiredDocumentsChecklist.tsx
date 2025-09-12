import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { FileCheck, Upload, Check, X, AlertCircle, DollarSign, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner@2.0.3";

// Document validation status type
export type DocumentValidationStatus = 'pending' | 'valid' | 'invalid' | 'none';

// Document validation issue type
export type DocumentValidationIssue = {
  type: 'blur' | 'wrong_document' | 'incomplete' | 'other';
  message: string;
};

interface RequiredDocumentsChecklistProps {
  yearBuilt?: string;
  onSignDocument: (documentId: string) => void;
  onUploadFile: (documentId: string, file: File | null) => void;
  onRequestSurvey?: () => void;
  signedDocuments: string[];
  uploadedFiles: Record<string, File | null>;
  // New props for validation
  documentValidation?: Record<string, {
    status: DocumentValidationStatus;
    issues?: DocumentValidationIssue[];
  }>;
}

export function RequiredDocumentsChecklist({
  yearBuilt,
  onSignDocument,
  onUploadFile,
  onRequestSurvey,
  signedDocuments = [],
  uploadedFiles = {},
  documentValidation = {}
}: RequiredDocumentsChecklistProps) {
  const [localFiles, setLocalFiles] = useState<Record<string, File | null>>(uploadedFiles);
  const [surveyRequested, setSurveyRequested] = useState(false);
  
  // Check if the home was built before 1978 (lead paint disclosure required)
  const isPreLeadPaintEra = yearBuilt ? parseInt(yearBuilt) < 1978 : false;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      // Update local file state
      setLocalFiles(prev => ({ ...prev, [documentId]: file }));
      
      // Notify parent component
      onUploadFile(documentId, file);
      
      // Show toast notification
      toast.success("Document uploaded successfully", {
        description: "Your document is being processed and will be reviewed shortly.",
      });
    }
  };
  
  const isDocumentSigned = (documentId: string) => {
    return signedDocuments.includes(documentId);
  };
  
  const hasFileUploaded = (documentId: string) => {
    return !!localFiles[documentId] || !!uploadedFiles[documentId];
  };
  
  const getFileName = (documentId: string) => {
    return localFiles[documentId]?.name || uploadedFiles[documentId]?.name || "";
  };
  
  const getValidationStatus = (documentId: string) => {
    return documentValidation[documentId]?.status || 'none';
  };
  
  const getValidationIssues = (documentId: string) => {
    return documentValidation[documentId]?.issues || [];
  };
  
  const handleRequestSurvey = () => {
    if (onRequestSurvey) {
      onRequestSurvey();
    }
    setSurveyRequested(true);
    toast.success("Survey request submitted", {
      description: "Your $500 survey request has been added to your account. Our team will reach out to coordinate.",
    });
  };
  
  const renderValidationStatus = (documentId: string) => {
    const status = getValidationStatus(documentId);
    const issues = getValidationIssues(documentId);
    
    if (!hasFileUploaded(documentId) && !surveyRequested) return null;
    
    if (surveyRequested && documentId === "survey") {
      return (
        <div className="flex items-center gap-2 mt-2 text-sm text-amber-500">
          <Clock className="h-4 w-4" />
          <span>Survey request pending</span>
        </div>
      );
    }
    
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2 mt-2 text-sm text-amber-500">
          <Clock className="h-4 w-4" />
          <span>Validation in progress</span>
        </div>
      );
    } else if (status === 'valid') {
      return (
        <div className="flex items-center gap-2 mt-2 text-sm text-emerald-500">
          <Check className="h-4 w-4" />
          <span>Document validated</span>
        </div>
      );
    } else if (status === 'invalid' && issues.length > 0) {
      return (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Document has issues</span>
          </div>
          <ul className="mt-1 pl-6 text-xs text-destructive list-disc">
            {issues.map((issue, index) => (
              <li key={index}>{issue.message}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Required Digital Signatures</h3>
          <p className="text-muted-foreground text-sm">
            Please review and sign the following documents to continue with your listing.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* IABS Document */}
          <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Information About Brokerage Services</h4>
                <Badge variant={isDocumentSigned("iabs") ? "default" : "outline"} className="ml-2">
                  {isDocumentSigned("iabs") ? "Signed" : "Required"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Texas law requires all real estate license holders to provide this information to potential clients.
              </p>
              {renderValidationStatus("iabs")}
            </div>
            <div>
              <Button 
                variant={isDocumentSigned("iabs") ? "secondary" : "default"} 
                size="sm"
                onClick={() => onSignDocument("iabs")}
              >
                {isDocumentSigned("iabs") ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Signed
                  </>
                ) : (
                  "Review & Sign"
                )}
              </Button>
            </div>
          </div>
          
          {/* T-47 Document */}
          <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">T-47 Residential Real Property Affidavit</h4>
                <Badge variant={isDocumentSigned("t-47") ? "default" : "outline"} className="ml-2">
                  {isDocumentSigned("t-47") ? "Signed" : "Required"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Affidavit regarding the property boundaries and improvements.
              </p>
              {renderValidationStatus("t-47")}
            </div>
            <div>
              <Button 
                variant={isDocumentSigned("t-47") ? "secondary" : "default"} 
                size="sm"
                onClick={() => onSignDocument("t-47")}
              >
                {isDocumentSigned("t-47") ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Signed
                  </>
                ) : (
                  "Review & Sign"
                )}
              </Button>
            </div>
          </div>
          
          {/* Seller's Disclosure */}
          <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Seller's Disclosure Notice</h4>
                <Badge variant={isDocumentSigned("sellers-disclosure") ? "default" : "outline"} className="ml-2">
                  {isDocumentSigned("sellers-disclosure") ? "Signed" : "Required"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Information about the property's condition that buyers should know.
              </p>
              {renderValidationStatus("sellers-disclosure")}
            </div>
            <div>
              <Button 
                variant={isDocumentSigned("sellers-disclosure") ? "secondary" : "default"} 
                size="sm"
                onClick={() => onSignDocument("sellers-disclosure")}
              >
                {isDocumentSigned("sellers-disclosure") ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Signed
                  </>
                ) : (
                  "Review & Sign"
                )}
              </Button>
            </div>
          </div>

          {/* Lead Paint Disclosure - Conditional */}
          {isPreLeadPaintEra && (
            <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Lead-Based Paint Disclosure</h4>
                  <Badge variant={isDocumentSigned("lead-paint") ? "default" : "outline"} className="ml-2">
                    {isDocumentSigned("lead-paint") ? "Signed" : "Required"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Required for homes built before 1978 regarding potential lead-based paint hazards.
                </p>
                {renderValidationStatus("lead-paint")}
              </div>
              <div>
                <Button 
                  variant={isDocumentSigned("lead-paint") ? "secondary" : "default"} 
                  size="sm"
                  onClick={() => onSignDocument("lead-paint")}
                >
                  {isDocumentSigned("lead-paint") ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Signed
                    </>
                  ) : (
                    "Review & Sign"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        {/* Document Uploads */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Required Document Uploads</h3>
          <p className="text-muted-foreground text-sm">
            Please upload the following documents to continue with your listing.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Property Survey */}
          <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Property Survey</h4>
                <Badge 
                  variant={hasFileUploaded("survey") || surveyRequested ? "default" : "outline"} 
                  className="ml-2"
                >
                  {hasFileUploaded("survey") ? "Uploaded" : surveyRequested ? "Requested" : "Required"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A recent survey of your property showing boundaries and improvements.
              </p>
              
              {hasFileUploaded("survey") && (
                <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                  <FileCheck className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{getFileName("survey")}</span>
                </div>
              )}
              
              {renderValidationStatus("survey")}
              
              {!hasFileUploaded("survey") && !surveyRequested && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Don't have a survey? You can request one for $500 or upload an existing one.
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {!hasFileUploaded("survey") && !surveyRequested ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <label htmlFor="survey-upload" className="cursor-pointer">
                            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2">
                              <Upload className="mr-1 h-4 w-4" />
                              Upload
                            </div>
                            <input
                              id="survey-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "survey")}
                            />
                          </label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload your property survey (PDF, JPG, PNG)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestSurvey}
                    className="flex items-center"
                    disabled={surveyRequested}
                  >
                    <DollarSign className="mr-1 h-4 w-4" />
                    Request Survey ($500)
                  </Button>
                </>
              ) : surveyRequested ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSurveyRequested(false)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel Request
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onUploadFile("survey", null)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}