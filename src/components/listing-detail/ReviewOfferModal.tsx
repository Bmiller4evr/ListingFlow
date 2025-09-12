import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  Download
} from "lucide-react";

interface ReviewOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: any; // Accept any offer object to handle different interfaces
  propertyAddress: string;
}

export function ReviewOfferModal({ open, onClose, offer, propertyAddress }: ReviewOfferModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[99vw] max-w-none h-[90vh] max-h-[90vh] p-0 flex flex-col !max-w-[99vw]" style={{ width: '99vw', maxWidth: '99vw' }} aria-describedby="review-offer-description">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0 border-b">
          <DialogTitle className="text-xl flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Review Offer - {offer.buyerName}
          </DialogTitle>
          <DialogDescription id="review-offer-description">
            Purchase contract details for the offer from {offer.buyerName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 flex flex-col bg-gray-100 relative min-h-0">
            {/* PDF Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-white flex-shrink-0">
              <FileText className="h-6 w-6 text-red-600" />
              <div>
                <span className="font-medium text-lg">Purchase_Contract_{offer.buyerName.replace(' ', '_')}.pdf</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">12 pages</Badge>
                  <Badge variant="outline">2.4 MB</Badge>
                  <span className="text-sm text-muted-foreground">Received {new Date(offer.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* PDF Content */}
            <div 
              className="flex-1 overflow-auto p-4 md:p-6"
            >
              <div className="space-y-6 max-w-none pb-20">
                {/* Page 1 - Contract Cover */}
                <div className="bg-white shadow-lg mx-auto border w-full max-w-full md:max-w-2xl lg:max-w-4xl min-h-fit p-3 md:p-8 lg:p-12 overflow-hidden">
                  <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-sm md:text-xl mb-2 font-medium">TREC NO. 20-16</h2>
                    <h1 className="text-lg md:text-2xl mb-4 md:mb-6 font-medium leading-tight break-words">ONE TO FOUR FAMILY RESIDENTIAL CONTRACT (RESALE)</h1>
                    <div className="border border-dashed border-gray-300 p-2 md:p-4 bg-gray-50 mb-4 md:mb-6">
                      <p className="text-xs md:text-sm text-gray-600">NOTICE: Not For Use For Condominium Transactions</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6 text-xs md:text-sm leading-relaxed break-words overflow-wrap-anywhere">
                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>1. PARTIES:</strong> {offer.buyerName} (Buyer) agrees to buy from [SELLER NAME] (Seller) the Property described below.</p>
                    </div>
                    
                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>2. PROPERTY:</strong> {propertyAddress}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">
                        City of Austin, County of Travis, Texas, Zip 78745, together with:
                      </p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">(i) improvements, fixtures and all property described in the Contract;</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">(ii) any property described in any addenda;</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">(iii) accessories, if any, including but not limited to: blinds, curtains, draperies, valances, fireplace screens, fireplace grates, heating units that are permanently installed, air-conditioning and heating systems, and other apparatus permanently installed (collectively, the "Property").</p>
                    </div>
                    
                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>3. SALES PRICE:</strong></p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">A. Cash portion of Sales Price payable by Buyer at closing: ${(offer.amount - (offer.downPayment || offer.cashAmount || 0)).toLocaleString()}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">B. Sum of all financing described in the attached: ${(offer.downPayment || offer.financedAmount || 0).toLocaleString()}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">C. Sales Price (Sum of A and B): ${offer.amount?.toLocaleString() || '0'}</p>
                    </div>
                    
                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>4. FINANCING:</strong> The portion of Sales Price not payable in cash will be paid as follows:</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">Type: {offer.loanType || 'Conventional'}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">Down payment: ${(offer.downPayment || offer.cashAmount || 0).toLocaleString()}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">Financing Amount: ${(offer.financedAmount || (offer.amount - (offer.downPayment || offer.cashAmount || 0))).toLocaleString()}</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">In the event of financing, this contract is subject to Buyer being approved for the financing described in the attached Third Party Financing Addendum.</p>
                    </div>
                    
                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>5. EARNEST MONEY:</strong> Upon execution of this contract by all parties, Buyer shall deposit ${offer.earnestMoney?.toLocaleString() || '0'} as earnest money with {offer.titleCompany || 'Stewart Title'} (Title Company), as escrow agent.</p>
                    </div>

                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>6. TITLE POLICY AND SURVEY:</strong></p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">A. TITLE POLICY: Seller shall furnish to Buyer at Seller's expense an owner policy of title insurance (Title Policy) issued by {offer.titleCompany || 'Stewart Title'} (Title Company) in the amount of the Sales Price, dated at or after closing, insuring Buyer against loss under the provisions of the Title Policy.</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">B. SURVEY: The survey must be made by a registered professional land surveyor acceptable to the Title Company and Buyer's lender(s). Buyer shall pay for the survey.</p>
                    </div>

                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>7. PROPERTY CONDITION:</strong></p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">A. ACCESS, INSPECTIONS AND UTILITIES: Seller shall permit Buyer and Buyer's agents access to the Property at reasonable times. Buyer may have the Property inspected by inspectors selected by Buyer and licensed by TREC or otherwise permitted by law to make inspections.</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">B. BUYER'S ACCEPTANCE OF PROPERTY CONDITION: Buyer accepts the Property As Is at the time of the execution of this contract with the right to have the Property inspected within {offer.inspectionPeriod || 10} days after the Effective Date of this contract.</p>
                    </div>

                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>8. CLOSING:</strong></p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">A. The closing of the sale will be on or before {offer.closingDate ? new Date(offer.closingDate).toLocaleDateString() : 'TBD'}, or within 7 days after objections made under Paragraph 6D have been cured or waived, whichever date is later (Closing Date).</p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">B. At closing Seller shall execute and deliver a general warranty deed conveying title to the Property to Buyer and showing no additional exceptions to those permitted in Paragraph 6 and furnish tax statements or certificates showing no delinquent taxes on the Property.</p>
                    </div>

                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>9. POSSESSION:</strong></p>
                      <p className="ml-3 md:ml-6 mb-2 break-words">Seller shall deliver possession of the Property to Buyer upon closing and funding according to a temporary residential lease form promulgated by TREC or other written lease required by the parties. Any possession by Buyer prior to closing or by Seller after closing which is not authorized by a written lease or by Paragraph 16 establishes a landlord-tenant at sufferance relationship.</p>
                    </div>

                    <div>
                      <p className="mb-2 md:mb-3 break-words"><strong>10. SPECIAL PROVISIONS:</strong></p>
                      <div className="border border-gray-300 p-2 md:p-4 min-h-16 md:min-h-24 bg-gray-50 overflow-hidden">
                        {offer.additionalTerms?.map((term, index) => (
                          <p key={index} className="mb-2 break-words">{term}</p>
                        )) || (
                          <div className="space-y-2">
                            <p className="break-words">• Seller to provide $2,500 credit for buyer-selected repairs at closing</p>
                            <p className="break-words">• Home warranty to be provided by seller at closing ($600 estimated cost)</p>
                            <p className="break-words">• All appliances to remain with property including washer and dryer</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-12 text-center text-xs text-gray-500 border-t pt-3 md:pt-4">
                    Page 1 of 12 - Purchase Contract
                  </div>
                </div>

                {/* Additional Contract Pages */}
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pageNum) => (
                  <div key={pageNum} className="bg-white shadow-lg mx-auto border w-full max-w-full md:max-w-2xl lg:max-w-4xl min-h-fit overflow-hidden">
                    <div className="h-full min-h-[500px] md:min-h-[700px] flex items-center justify-center border-2 border-dashed border-gray-300 m-4">
                      <div className="text-center text-gray-400">
                        <FileText className="h-12 md:h-20 w-12 md:w-20 mx-auto mb-4 md:mb-6 text-gray-300" />
                        <p className="text-lg md:text-xl mb-2">Contract Page {pageNum}</p>
                        <p className="text-xs md:text-sm">Standard TREC contract content</p>
                        <div className="mt-4 md:mt-6 space-y-1 text-xs">
                          {pageNum === 2 && <p>Special Provisions and Financing Terms</p>}
                          {pageNum === 3 && <p>Property Conditions and Inspections</p>}
                          {pageNum === 4 && <p>Title and Survey Requirements</p>}
                          {pageNum === 5 && <p>Closing and Possession Terms</p>}
                          {pageNum === 6 && <p>Default and Remedies</p>}
                          {pageNum === 7 && <p>Mediation and Dispute Resolution</p>}
                          {pageNum === 8 && <p>Settlement and Other Expenses</p>}
                          {pageNum === 9 && <p>Prorations and Rollback Taxes</p>}
                          {pageNum === 10 && <p>Casualty Loss and Environmental Matters</p>}
                          {pageNum === 11 && <p>Notices and Consents</p>}
                          {pageNum === 12 && <p>Signatures and Final Execution</p>}
                        </div>
                        <p className="text-xs mt-4 md:mt-6 text-gray-400">Page {pageNum} of 12</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button size="sm" className="shadow-lg gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}