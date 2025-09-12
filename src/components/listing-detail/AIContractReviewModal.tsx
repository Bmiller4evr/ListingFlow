import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  CheckCircle,
  AlertTriangle,
  Info,
  LightbulbIcon,
  Search,
  MessageSquareQuote
} from "lucide-react";

interface AIContractReviewModalProps {
  open: boolean;
  onClose: () => void;
  offer: any; // Accept any offer object to handle different interfaces
  propertyAddress: string;
  listPrice?: number;
}

export function AIContractReviewModal({ open, onClose, offer, propertyAddress, listPrice }: AIContractReviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="ai-contract-review-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-primary" />
            AI Contract Analysis - {offer.buyerName}
          </DialogTitle>
          <DialogDescription id="ai-contract-review-description">
            Detailed AI assessment of the offer from {offer.buyerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-2 mb-4">
                <Search className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="w-full">
                  <h4 className="font-medium text-lg mb-2">Offer Summary</h4>
                  <p className="text-sm text-muted-foreground mb-4">Essential elements of the contract</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
                        <p className="font-medium text-lg">${offer.amount?.toLocaleString() || '0'}</p>
                        <p className="text-xs text-amber-600">
                          {listPrice && (offer.amount || 0) < listPrice ? `-${(listPrice - (offer.amount || 0)).toLocaleString()} below list price` : 
                           listPrice && (offer.amount || 0) > listPrice ? `+${((offer.amount || 0) - listPrice).toLocaleString()} above list price` : 
                           'At list price'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Down Payment</p>
                        <p className="font-medium">${(offer.cashAmount || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">({Math.round(((offer.cashAmount || 0) / (offer.amount || 1)) * 100)}% of purchase price)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Closing Date</p>
                        <p className="font-medium">{offer.closingDate ? new Date(offer.closingDate).toLocaleDateString() : 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Earnest Money</p>
                        <p className="font-medium">${(offer.earnestMoney || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">({Math.round(((offer.earnestMoney || 0) / (offer.amount || 1)) * 100)}% of purchase price)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Financing Type</p>
                        <p className="font-medium">{offer.lenderName ? 'Conventional' : 'Cash'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Title Company</p>
                        <p className="font-medium">{offer.titleCompany || 'TBD'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Inspection Period</p>
                        <p className="font-medium">{offer.inspectionPeriod || 10} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Contingencies</p>
                        <div className="flex flex-wrap gap-1">
                          {(offer.contingencies || []).slice(0, 2).map((contingency, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{contingency}</Badge>
                          ))}
                          {(offer.contingencies || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">+{(offer.contingencies || []).length - 2} more</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h5 className="font-medium text-lg mb-3">Strengths</h5>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Qualified buyer with {Math.round(((offer.cashAmount || 0) / (offer.amount || 1)) * 100)}% down payment</li>
                    <li>Pre-approved for {offer.lenderName ? 'conventional financing' : 'cash purchase'}</li>
                    <li>Solid earnest money deposit of ${(offer.earnestMoney || 0).toLocaleString()}</li>
                    <li>Reasonable closing timeline ({offer.closingDate ? Math.round((new Date(offer.closingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'TBD'} days)</li>
                    <li>Reputable {offer.lenderName ? 'lender and ' : ''}title company</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5" />
                <div>
                  <h5 className="font-medium text-lg mb-3">Considerations</h5>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {listPrice && (offer.amount || 0) < listPrice && (
                      <li>Offer ${(listPrice - (offer.amount || 0)).toLocaleString()} below asking price</li>
                    )}
                    {offer.contingencies && offer.contingencies.length > 1 && (
                      <li>Multiple contingencies may delay closing</li>
                    )}
                    <li>Inspection period allows for renegotiation</li>
                    {offer.paymentType === 'Financed' && (
                      <li>Financing contingency introduces some risk</li>
                    )}
                    <li>Standard contract terms and conditions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-blue-500 mt-0.5" />
                <div>
                  <h5 className="font-medium text-lg mb-3">Recommendations</h5>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {listPrice && (offer.amount || 0) < listPrice ? (
                      <li>Counter at ${Math.round(listPrice - ((listPrice - (offer.amount || 0)) * 0.5)).toLocaleString()}-${(listPrice - 5000).toLocaleString()}</li>
                    ) : (
                      <li>Strong offer at or above asking price</li>
                    )}
                    <li>Verify proof of funds and pre-approval</li>
                    <li>Review all contingency timelines carefully</li>
                    <li>Confirm title company reputation</li>
                    <li>Consider inspection period length</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-start gap-3">
              <MessageSquareQuote className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-lg mb-3">Final Assessment</h4>
                <div className="space-y-3 text-sm">
                  <p>
                    This {(offer.amount || 0) >= (listPrice || 0) ? 'is a strong offer' : 'offer comes in below your asking price but represents'} from a {offer.paymentType === 'Cash' ? 'cash' : 'qualified'} buyer. 
                    The buyer's financial qualifications appear {offer.paymentType === 'Cash' ? 'excellent with a cash purchase' : `strong with a ${Math.round(((offer.cashAmount || 0) / (offer.amount || 1)) * 100)}% down payment and pre-approval for financing`}.
                  </p>
                  <p>
                    The offer includes {offer.contingencies?.length || 0} standard contingencies which {offer.contingencies?.length > 2 ? 'introduce some uncertainty but are' : 'are'} typical for this market. 
                    The {offer.inspectionPeriod || 10}-day inspection period provides a reasonable timeline for due diligence.
                  </p>
                  <p>
                    {(offer.amount || 0) >= (listPrice || 0) 
                      ? 'I recommend accepting this offer as it meets or exceeds your asking price and comes from a qualified buyer.' 
                      : 'I recommend considering a counteroffer to address the price difference while recognizing this buyer appears motivated and financially capable.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}