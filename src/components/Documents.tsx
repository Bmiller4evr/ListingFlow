import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  FileText, FileImage, Download, Eye, Search, Filter, 
  Building, PlusCircle, Share2, FilePlus, 
  CalendarDays, Loader2, FileIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { mockDocuments, documentStats, uniqueProperties, DocumentItem } from "../data/documentsMock";
import { useIsMobile } from "./ui/use-mobile";

export function Documents() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter documents based on search and property
    let filtered = mockDocuments.filter((doc) => {
      const matchesSearch = searchTerm === "" || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesProperty = selectedProperty === "all" || doc.propertyId === selectedProperty;
      
      return matchesSearch && matchesProperty;
    });
    
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedProperty]);




  
  const getDocumentTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF': return <FileText className="h-6 w-6 text-red-500" />;
      case 'DOCX': return <FileIcon className="h-6 w-6 text-blue-500" />;
      case 'JPG':
      case 'PNG': return <FileImage className="h-6 w-6 text-green-500" />;
      default: return <FileText className="h-6 w-6 text-muted-foreground" />;
    }
  };
  


  return (
    <div>




      <div>
          <Card>
            <CardHeader className="pb-3">
              <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
                <CardTitle className={isMobile ? 'text-center' : ''}>
                  {selectedProperty === "all" 
                    ? "All Documents" 
                    : `Documents for ${uniqueProperties.find(p => p.id === selectedProperty)?.address.split(',')[0]}`}
                </CardTitle>
                
                {/* Mobile Layout: Stack vertically */}
                {isMobile ? (
                  <div className="space-y-3">
                    {/* Search bar - full width on mobile */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search documents..." 
                        className="pl-9 w-full h-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Buttons row */}
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-1 flex-1 h-12">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedProperty("all")}>All Listings</DropdownMenuItem>
                          {uniqueProperties.map((property) => (
                            <DropdownMenuItem 
                              key={property.id} 
                              onClick={() => setSelectedProperty(property.id)}
                            >
                              {property.address.split(',')[0]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      

                    </div>
                  </div>
                ) : (
                  /* Desktop Layout: Horizontal */
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search documents..." 
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Filter className="h-4 w-4" />
                          <span>Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedProperty("all")}>All Listings</DropdownMenuItem>
                        {uniqueProperties.map((property) => (
                          <DropdownMenuItem 
                            key={property.id} 
                            onClick={() => setSelectedProperty(property.id)}
                          >
                            {property.address.split(',')[0]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    

                  </div>
                )}
              </div>
              <CardDescription className="pt-1">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading documents...</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No documents found</p>
                  {(searchTerm || selectedProperty !== "all") && (
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className={`${isMobile ? 'p-3' : 'p-4'} border rounded-lg`}>
                      <div className={`${isMobile ? 'space-y-3' : 'grid gap-4 md:grid-cols-[auto_1fr_auto]'}`}>
                        {/* Document icon and title */}
                        <div className={`flex ${isMobile ? 'gap-3' : 'items-center justify-center h-12 w-12 bg-muted rounded-lg'}`}>
                          <div className={`flex items-center justify-center ${isMobile ? 'h-10 w-10' : 'h-12 w-12'} bg-muted rounded-lg`}>
                            {getDocumentTypeIcon(doc.fileType)}
                          </div>
                          
                          {isMobile && (
                            <div className="flex-1">
                              <h4 className="font-medium">{doc.name}</h4>
                              {doc.description && (
                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Desktop content */}
                        {!isMobile && (
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium">{doc.name}</h4>
                            </div>
                            
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5" />
                                <span>{doc.propertyAddress.split(",")[0]}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>{new Date(doc.dateModified).toLocaleDateString()}</span>
                              </div>
                              <div>{doc.fileSize}</div>
                              <div className="uppercase">{doc.fileType}</div>
                              
                              {doc.sharedWith && doc.sharedWith.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Share2 className="h-3.5 w-3.5" />
                                  <span>
                                    Shared with {doc.sharedWith.length > 1 
                                      ? `${doc.sharedWith[0]} +${doc.sharedWith.length - 1}` 
                                      : doc.sharedWith[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Mobile metadata */}
                        {isMobile && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-3.5 w-3.5" />
                              <span>{doc.propertyAddress.split(",")[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>{new Date(doc.dateModified).toLocaleDateString()}</span>
                            </div>
                            <div>{doc.fileSize}</div>
                            <div className="uppercase">{doc.fileType}</div>
                            
                            {doc.sharedWith && doc.sharedWith.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Share2 className="h-3.5 w-3.5" />
                                <span>
                                  Shared with {doc.sharedWith.length > 1 
                                    ? `${doc.sharedWith[0]} +${doc.sharedWith.length - 1}` 
                                    : doc.sharedWith[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className={`flex ${isMobile ? 'gap-2' : 'items-center gap-2 md:justify-end'}`}>
                          <Button size="sm" variant="outline" className={`gap-1 ${isMobile ? 'flex-1 h-10' : ''}`}>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button size="sm" variant="outline" className={`gap-1 ${isMobile ? 'flex-1 h-10' : ''}`}>
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}