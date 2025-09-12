export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
  type: 'showing';
  status?: 'upcoming' | 'completed';
  propertyId?: string;
  propertyAddress?: string;
  participants?: string[];
  agentName?: string;
  agentContact?: string;
  buyerName?: string;
  contactMethod?: 'phone' | 'email' | 'text';
  feedback?: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category?: 'document' | 'inspection' | 'offer' | 'closing' | 'general';
  propertyId?: string;
  propertyAddress?: string;
  assignedTo?: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "showing-1",
    title: "Property Showing - 123 Main St",
    start: "2024-12-20T14:00:00",
    end: "2024-12-20T14:30:00",
    description: "Scheduled showing with potential buyers",
    type: "showing",
    status: "completed",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX",
    participants: ["John & Sarah Smith", "Agent: Mike Johnson"],
    agentName: "Mike Johnson",
    agentContact: "(555) 123-4567",
    buyerName: "John & Sarah Smith",
    contactMethod: "phone",
    feedback: "Buyers were very impressed with the kitchen renovation and spacious layout. They mentioned they will likely submit an offer within the next few days."
  },
  {
    id: "showing-2",
    title: "Property Showing - 456 Oak Ave",
    start: "2024-12-21T10:00:00",
    end: "2024-12-21T10:45:00",
    description: "Morning showing appointment",
    type: "showing",
    status: "completed",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX",
    participants: ["Emma Wilson", "Agent: Lisa Chen"],
    agentName: "Lisa Chen",
    agentContact: "(555) 234-5678",
    buyerName: "Emma Wilson",
    contactMethod: "email"
  },
  {
    id: "showing-3",
    title: "Property Showing - 789 Pine Rd",
    start: "2024-12-22T16:30:00",
    end: "2024-12-22T17:00:00",
    description: "Weekend showing",
    type: "showing",
    status: "completed",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Rd, Austin, TX",
    participants: ["Robert Taylor", "Agent: Jessica Brown"],
    agentName: "Jessica Brown",
    agentContact: "(555) 345-6789",
    buyerName: "Robert Taylor",
    contactMethod: "phone",
    feedback: "Buyer appreciated the updated bathrooms but was concerned about the lack of a garage. They will consider the property but want to see a few more options first."
  },
  {
    id: "showing-4",
    title: "Property Showing - 321 Elm St",
    start: "2024-12-25T13:00:00",
    end: "2024-12-25T13:30:00",
    description: "Holiday showing",
    type: "showing",
    status: "upcoming",
    propertyId: "prop-4",
    propertyAddress: "321 Elm St, Austin, TX",
    participants: ["Michael & Jennifer Davis", "Agent: Amanda White"],
    agentName: "Amanda White",
    agentContact: "(555) 456-7890",
    buyerName: "Michael & Jennifer Davis",
    contactMethod: "text"
  }
];

export const mockTodoItems: TodoItem[] = [
  {
    id: "todo-1",
    title: "Upload Seller's Disclosure",
    description: "Complete and upload the required seller's disclosure form",
    completed: false,
    dueDate: "2024-12-21T17:00:00",
    priority: "high",
    category: "document",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX"
  },
  {
    id: "todo-2",
    title: "Schedule Home Inspection",
    description: "Coordinate with buyer's inspector for property inspection",
    completed: false,
    dueDate: "2024-12-23T09:00:00",
    priority: "high",
    category: "inspection",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX"
  },
  {
    id: "todo-3",
    title: "Review Purchase Offer",
    description: "Review and respond to incoming purchase offer from the Johnson family",
    completed: false,
    dueDate: "2024-12-20T15:00:00",
    priority: "high",
    category: "offer",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX"
  },
  {
    id: "todo-4",
    title: "Prepare for Closing",
    description: "Gather all required documents for closing next week",
    completed: false,
    dueDate: "2024-12-25T10:00:00",
    priority: "medium",
    category: "closing",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Rd, Austin, TX"
  },
  {
    id: "todo-5",
    title: "Update Property Photos",
    description: "Take new photos after recent renovations",
    completed: true,
    dueDate: "2024-12-19T14:00:00",
    priority: "medium",
    category: "general",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX"
  },
  {
    id: "todo-6",
    title: "Upload Appraisal Report",
    description: "Upload the official property appraisal report",
    completed: false,
    dueDate: "2024-12-22T12:00:00",
    priority: "medium",
    category: "document",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX"
  },
  {
    id: "todo-7",
    title: "Coordinate Final Walkthrough",
    description: "Schedule final walkthrough with buyer before closing",
    completed: false,
    dueDate: "2024-12-24T16:00:00",
    priority: "medium",
    category: "inspection",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Rd, Austin, TX"
  },
  {
    id: "todo-8",
    title: "Respond to Repair Requests",
    description: "Review and respond to buyer's repair requests from inspection",
    completed: false,
    dueDate: "2024-12-21T11:00:00",
    priority: "high",
    category: "general",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX"
  },
  {
    id: "todo-9",
    title: "Sign Counter Offer",
    description: "Review and sign counter offer documentation",
    completed: true,
    dueDate: "2024-12-18T13:00:00",
    priority: "high",
    category: "offer",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX"
  },
  {
    id: "todo-10",
    title: "Submit HOA Documents",
    description: "Provide HOA financials and bylaws to buyer's agent",
    completed: false,
    dueDate: "2024-12-23T16:00:00",
    priority: "low",
    category: "document",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Rd, Austin, TX"
  }
];