import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Search,
  Plus,
  Paperclip,
  Send,
  FileText,
  Image,
  MapPin,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Users,
  Calendar,
  Info,
  X,
  AlertCircle,
  Loader2,
  Filter,
  Mail,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  Home
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface MessageParticipant {
  id: string;
  name: string;
  email: string;
  type: 'seller' | 'listing-agent' | 'interested-buyer' | 'contracted-buyer' | 'buyers-agent' | 'title-company' | 'lender' | 'other';
  avatar?: string;
  isOnline?: boolean;
}

interface EmailMessage {
  id: string;
  subject: string;
  body: string;
  from: MessageParticipant;
  to: MessageParticipant[];
  cc?: MessageParticipant[];
  bcc?: MessageParticipant[];
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  listingId?: string;
  listingAddress?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
  }>;
  priority?: 'high' | 'normal' | 'low';
}

interface Listing {
  id: string;
  address: string;
  status: 'active' | 'pending' | 'sold' | 'draft';
}

// Mock data
const mockListings: Listing[] = [
  { id: '1', address: '123 Main Street, Austin, TX 78701', status: 'active' },
  { id: '2', address: '456 Oak Avenue, Dallas, TX 75201', status: 'pending' },
  { id: '3', address: '789 Pine Lane, Houston, TX 77001', status: 'sold' },
];

const mockMessages: EmailMessage[] = [
  {
    id: '1',
    subject: 'Showing Request - 123 Main Street',
    body: 'Hi there,\n\nI would like to schedule a showing for 123 Main Street this Saturday at 2 PM. Please let me know if this time works.\n\nBest regards,\nJohn Smith',
    from: {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@email.com',
      type: 'interested-buyer'
    },
    to: [{
      id: '1',
      name: 'You',
      email: 'seller@email.com',
      type: 'seller'
    }],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    listingId: '1',
    listingAddress: '123 Main Street, Austin, TX 78701',
    priority: 'high'
  },
  {
    id: '2',
    subject: 'Title Company Documents Required',
    body: 'Dear Seller,\n\nWe need the following documents to proceed with the closing:\n\n1. Property deed\n2. Survey documents\n3. HOA information\n\nPlease provide these at your earliest convenience.\n\nThank you,\nABC Title Company',
    from: {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@abctitle.com',
      type: 'title-company'
    },
    to: [{
      id: '1',
      name: 'You',
      email: 'seller@email.com',
      type: 'seller'
    }],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    listingId: '1',
    listingAddress: '123 Main Street, Austin, TX 78701',
    attachments: [
      { id: '1', name: 'document_checklist.pdf', size: '245 KB', type: 'pdf' }
    ]
  },
  {
    id: '3',
    subject: 'Listing Performance Update - Week 1',
    body: 'Hello,\n\nHere\'s your weekly listing performance update:\n\n- Total views: 127\n- Showings scheduled: 8\n- Interested parties: 3\n\nThe listing is performing well. Let me know if you have any questions.\n\nBest,\nMike Wilson, Realtor',
    from: {
      id: '4',
      name: 'Mike Wilson',
      email: 'mike@realtygroup.com',
      type: 'listing-agent'
    },
    to: [{
      id: '1',
      name: 'You',
      email: 'seller@email.com',
      type: 'seller'
    }],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    listingId: '1',
    listingAddress: '123 Main Street, Austin, TX 78701'
  },
  {
    id: '4',
    subject: 'Mortgage Pre-approval Update',
    body: 'Hi,\n\nI wanted to update you on the buyer\'s mortgage pre-approval status. Everything looks good and we\'re on track for the closing date.\n\nThe final underwriting should be complete by Friday.\n\nRegards,\nFirst National Bank',
    from: {
      id: '5',
      name: 'Lisa Chen',
      email: 'lisa@firstnational.com',
      type: 'lender'
    },
    to: [{
      id: '1',
      name: 'You',
      email: 'seller@email.com',
      type: 'seller'
    }],
    cc: [{
      id: '4',
      name: 'Mike Wilson',
      email: 'mike@realtygroup.com',
      type: 'listing-agent'
    }],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    listingId: '2',
    listingAddress: '456 Oak Avenue, Dallas, TX 75201'
  }
];

const partyTypeLabels = {
  'seller': 'Seller',
  'listing-agent': 'Listing Agent',
  'interested-buyer': 'Interested Buyer',
  'contracted-buyer': 'Contracted Buyer',
  'buyers-agent': 'Buyer\'s Agent',
  'title-company': 'Title Company',
  'lender': 'Lender',
  'other': 'Other'
};

const partyTypeColors = {
  'seller': 'bg-blue-100 text-blue-800',
  'listing-agent': 'bg-green-100 text-green-800',
  'interested-buyer': 'bg-yellow-100 text-yellow-800',
  'contracted-buyer': 'bg-orange-100 text-orange-800',
  'buyers-agent': 'bg-purple-100 text-purple-800',
  'title-company': 'bg-indigo-100 text-indigo-800',
  'lender': 'bg-pink-100 text-pink-800',
  'other': 'bg-gray-100 text-gray-800'
};

function ComposeEmailDialog({ open, onOpenChange, onSendEmail }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (email: Partial<EmailMessage>) => void;
}) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedListing, setSelectedListing] = useState('none');
  const [priority, setPriority] = useState<'high' | 'normal' | 'low'>('normal');

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const email: Partial<EmailMessage> = {
      subject,
      body,
      to: [{ 
        id: 'temp', 
        name: to, 
        email: to, 
        type: 'other' 
      }],
      cc: cc ? [{ 
        id: 'temp-cc', 
        name: cc, 
        email: cc, 
        type: 'other' 
      }] : undefined,
      listingId: selectedListing && selectedListing !== 'none' ? selectedListing : undefined,
      listingAddress: selectedListing && selectedListing !== 'none' ? mockListings.find(l => l.id === selectedListing)?.address : undefined,
      priority
    };

    onSendEmail(email);
    
    // Reset form
    setTo('');
    setCc('');
    setSubject('');
    setBody('');
    setSelectedListing('none');
    setPriority('normal');
    onOpenChange(false);
    
    toast.success('Email sent successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Compose Email
          </DialogTitle>
          <DialogDescription>
            Send a secure email to parties involved in your real estate transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="to">To *</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@email.com"
              type="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@email.com"
              type="email"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing">Related Listing</Label>
              <Select value={selectedListing} onValueChange={setSelectedListing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No listing</SelectItem>
                  {mockListings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Message *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-32"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </Button>
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Messages() {
  const [messages, setMessages] = useState<EmailMessage[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<string>('all');
  const [selectedPartyType, setSelectedPartyType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter messages based on search, listing, party type, and read status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchQuery || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesListing = selectedListing === 'all' || message.listingId === selectedListing;
    
    const matchesPartyType = selectedPartyType === 'all' || message.from.type === selectedPartyType;
    
    const matchesReadStatus = !showUnreadOnly || !message.isRead;
    
    return matchesSearch && matchesListing && matchesPartyType && matchesReadStatus;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatEmailTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleMessageClick = (message: EmailMessage) => {
    setSelectedMessage(message);
    
    // Mark as read
    if (!message.isRead) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      ));
    }
  };

  const handleSendEmail = (emailData: Partial<EmailMessage>) => {
    const newEmail: EmailMessage = {
      id: Date.now().toString(),
      subject: emailData.subject!,
      body: emailData.body!,
      from: {
        id: 'current-user',
        name: 'You',
        email: 'you@email.com',
        type: 'seller'
      },
      to: emailData.to!,
      cc: emailData.cc,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      listingId: emailData.listingId,
      listingAddress: emailData.listingAddress,
      priority: emailData.priority || 'normal'
    };
    
    setMessages(prev => [newEmail, ...prev]);
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
    ));
  };

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast.success('Email archived');
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast.success('Email deleted');
  };

  return (
    <div className="pb-6">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[400px_1fr] h-[80vh]">
          {/* Email List Sidebar */}
          <div className="border-r overflow-hidden flex flex-col">
            {/* Header with search and filters */}
            <div className="p-4 border-b space-y-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  size="icon"
                  onClick={() => setShowComposeDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedListing} onValueChange={setSelectedListing}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Filter by listing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Listings</SelectItem>
                      {mockListings.map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedPartyType} onValueChange={setSelectedPartyType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Filter by party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parties</SelectItem>
                      <SelectItem value="listing-agent">Listing Agent</SelectItem>
                      <SelectItem value="interested-buyer">Interested Buyer</SelectItem>
                      <SelectItem value="contracted-buyer">Contracted Buyer</SelectItem>
                      <SelectItem value="buyers-agent">Buyer's Agent</SelectItem>
                      <SelectItem value="title-company">Title Company</SelectItem>
                      <SelectItem value="lender">Lender</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Quick filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant={showUnreadOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 px-1.5">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Email List */}
            <ScrollArea className="flex-1">
              <div className="h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <Mail className="h-12 w-12 mb-2 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      {searchQuery 
                        ? "No emails match your search"
                        : "No emails found"}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowComposeDialog(true)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Compose Email
                    </Button>
                  </div>
                ) : (
                  <div>
                    {filteredMessages.map(message => (
                      <div 
                        key={message.id}
                        className={`
                          p-4 cursor-pointer border-b hover:bg-muted/30 transition-colors
                          ${selectedMessage?.id === message.id ? 'bg-muted/50' : ''}
                          ${!message.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}
                        `}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="space-y-2">
                          {/* Header */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={message.from.avatar} />
                                <AvatarFallback>
                                  {message.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm truncate ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
                                  {message.from.name}
                                </p>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${partyTypeColors[message.from.type]}`}
                                >
                                  {partyTypeLabels[message.from.type]}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {message.priority === 'high' && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              {message.isStarred && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatEmailTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Subject and listing info */}
                          <div className="space-y-1">
                            <p className={`text-sm truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                              {message.subject}
                            </p>
                            {message.listingAddress && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {message.listingAddress}
                              </p>
                            )}
                          </div>
                          
                          {/* Preview */}
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {message.body}
                          </p>
                          
                          {/* Attachments indicator */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Email Reading Pane */}
          <div className="flex flex-col h-full overflow-hidden">
            {selectedMessage ? (
              <>
                {/* Email Header */}
                <div className="p-4 border-b flex-shrink-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedMessage.from.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedMessage.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          <strong>{selectedMessage.from.name}</strong> &lt;{selectedMessage.from.email}&gt;
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${partyTypeColors[selectedMessage.from.type]}`}
                        >
                          {partyTypeLabels[selectedMessage.from.type]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>To: {selectedMessage.to.map(p => p.name).join(', ')}</span>
                        {selectedMessage.cc && selectedMessage.cc.length > 0 && (
                          <span>CC: {selectedMessage.cc.map(p => p.name).join(', ')}</span>
                        )}
                        <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                      </div>
                      {selectedMessage.listingAddress && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <Home className="h-4 w-4" />
                          <span>{selectedMessage.listingAddress}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStar(selectedMessage.id)}
                            >
                              <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {selectedMessage.isStarred ? 'Remove star' : 'Add star'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ReplyAll className="h-4 w-4 mr-2" />
                            Reply All
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(selectedMessage.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(selectedMessage.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Priority indicator */}
                  {selectedMessage.priority === 'high' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        High Priority
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Email Body */}
                <ScrollArea className="flex-1 p-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">
                      {selectedMessage.body}
                    </div>
                    
                    {/* Attachments */}
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{attachment.name}</span>
                              <span className="text-muted-foreground">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Reply Actions */}
                <div className="p-4 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <Button>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <ReplyAll className="h-4 w-4 mr-2" />
                      Reply All
                    </Button>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // No email selected
              <div className="flex flex-col items-center justify-center h-full">
                <div className="p-6 rounded-full bg-muted">
                  <Mail className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mt-6 font-medium">Select an email</h2>
                <p className="text-center text-muted-foreground mt-2 max-w-md">
                  Choose an email from the list to read its contents and respond.
                </p>
                <Button 
                  className="mt-6"
                  onClick={() => setShowComposeDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Compose New Email
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Compose Email Dialog */}
      <ComposeEmailDialog
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
}