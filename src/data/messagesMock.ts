import { mockListings } from "./mockData";

// Define the message participant types
export type ParticipantType = 'realtor' | 'title-company' | 'buyers-agent' | 'contractor' | 'photographer' | 'self';

// Define the message attachment types
export type AttachmentType = 'image' | 'document' | 'contract';

// Interface for message participants
export interface Participant {
  id: string;
  name: string;
  type: ParticipantType;
  avatar?: string;
  role?: string;
  company?: string;
  propertyId?: string; // Which property this conversation is related to
  lastActive?: string;
}

// Interface for message attachments
export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  url?: string;
  size?: number; // in bytes
  thumbnailUrl?: string;
}

// Interface for individual messages
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string
  read: boolean;
  attachments?: MessageAttachment[];
}

// Interface for conversations
export interface Conversation {
  id: string;
  participants: Participant[];
  subject?: string;
  lastMessageId?: string;
  propertyId?: string;
  lastActivity: string; // ISO string
  unreadCount: number;
}

// Mock participants
export const mockParticipants: Participant[] = [
  {
    id: 'user-1',
    name: 'You',
    type: 'self',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=256&h=256&fit=crop&crop=faces&q=60',
  },
  {
    id: 'realtor-1',
    name: 'Sarah Johnson',
    type: 'realtor',
    company: 'Access Realty',
    role: 'Lead Agent',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=faces&q=60',
    lastActive: '2025-05-30T15:45:00Z',
  },
  {
    id: 'title-1',
    name: 'Richard Martinez',
    type: 'title-company',
    company: 'Clear Title Services',
    role: 'Escrow Officer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces&q=60',
    propertyId: 'prop-1',
    lastActive: '2025-05-29T10:20:00Z',
  },
  {
    id: 'buyer-agent-1',
    name: 'Emily Wong',
    type: 'buyers-agent',
    company: 'Metro Realty Group',
    role: 'Buyer\'s Agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&q=60',
    propertyId: 'prop-1',
    lastActive: '2025-05-30T09:15:00Z',
  },
  {
    id: 'contractor-1',
    name: 'Mike Reynolds',
    type: 'contractor',
    company: 'Quality Home Repairs',
    role: 'General Contractor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces&q=60',
    propertyId: 'prop-2',
    lastActive: '2025-05-28T14:30:00Z',
  },
  {
    id: 'photographer-1',
    name: 'Jessica Alvarez',
    type: 'photographer',
    company: 'Capture Real Estate',
    role: 'Lead Photographer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces&q=60',
    propertyId: 'prop-3',
    lastActive: '2025-05-27T11:45:00Z',
  },
  {
    id: 'contractor-2',
    name: 'Robert Chen',
    type: 'contractor',
    company: 'Austin Plumbing Pros',
    role: 'Plumbing Specialist',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=256&h=256&fit=crop&crop=faces&q=60',
    propertyId: 'prop-1',
    lastActive: '2025-05-29T16:10:00Z',
  },
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'realtor-1')!],
    subject: 'Listing Strategy Discussion',
    propertyId: 'prop-1',
    lastActivity: '2025-05-30T15:45:00Z',
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'title-1')!],
    subject: 'Closing Documents Review',
    propertyId: 'prop-1',
    lastActivity: '2025-05-29T10:20:00Z',
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'buyer-agent-1')!],
    subject: 'Offer Negotiation',
    propertyId: 'prop-1',
    lastActivity: '2025-05-30T09:15:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'contractor-1')!],
    subject: 'Kitchen Renovation Quote',
    propertyId: 'prop-2',
    lastActivity: '2025-05-28T14:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'photographer-1')!],
    subject: 'Property Photography Session',
    propertyId: 'prop-3',
    lastActivity: '2025-05-27T11:45:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-6',
    participants: [mockParticipants.find(p => p.id === 'user-1')!, mockParticipants.find(p => p.id === 'contractor-2')!],
    subject: 'Plumbing Inspection Results',
    propertyId: 'prop-1',
    lastActivity: '2025-05-29T16:10:00Z',
    unreadCount: 3,
  },
];

// Mock messages
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'realtor-1',
      text: "Hi there! I've reviewed the comps for your property at 123 Main St and I believe we can list it at $450,000. What do you think?",
      timestamp: '2025-05-30T14:30:00Z',
      read: true,
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'user-1',
      text: 'That seems reasonable based on the recent sales in the neighborhood. Do you think we should highlight the new kitchen renovations in the listing?',
      timestamp: '2025-05-30T14:45:00Z',
      read: true,
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'realtor-1',
      text: "Absolutely! The new kitchen is a major selling point. I'd also recommend professionally staging the living area to showcase the open floor plan.",
      timestamp: '2025-05-30T15:00:00Z',
      read: true,
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'realtor-1',
      text: "I've attached a sample listing description for your review. Let me know if you'd like any changes.",
      timestamp: '2025-05-30T15:05:00Z',
      read: true,
      attachments: [
        {
          id: 'att-1-1',
          type: 'document',
          name: 'Listing_Description_Draft.pdf',
          size: 245000,
        },
      ],
    },
    {
      id: 'msg-1-5',
      conversationId: 'conv-1',
      senderId: 'realtor-1',
      text: 'Also, I have two showings already scheduled for next week once we go live. Our marketing strategies are already generating interest!',
      timestamp: '2025-05-30T15:40:00Z',
      read: false,
    },
    {
      id: 'msg-1-6',
      conversationId: 'conv-1',
      senderId: 'realtor-1',
      text: 'Can we schedule a quick call today to discuss the final listing strategy?',
      timestamp: '2025-05-30T15:45:00Z',
      read: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'title-1',
      text: "Good morning! I wanted to let you know that we've received all the necessary documents for your closing on 123 Main St.",
      timestamp: '2025-05-29T09:30:00Z',
      read: true,
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'user-1',
      text: 'Great news! Is there anything else you need from me before the closing date?',
      timestamp: '2025-05-29T09:45:00Z',
      read: true,
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'title-1',
      text: "I've attached the preliminary closing disclosure for your review. Please look it over and let me know if you have any questions.",
      timestamp: '2025-05-29T10:15:00Z',
      read: true,
      attachments: [
        {
          id: 'att-2-1',
          type: 'document',
          name: 'Closing_Disclosure.pdf',
          size: 380000,
        },
      ],
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'title-1',
      text: "Also, please remember to bring a government-issued ID to the closing. We're on schedule for June 15th at 10:00 AM.",
      timestamp: '2025-05-29T10:20:00Z',
      read: false,
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'buyer-agent-1',
      text: 'Hello! My clients are very interested in your property at 123 Main St. They would like to submit an offer of $435,000.',
      timestamp: '2025-05-29T16:30:00Z',
      read: true,
    },
    {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      senderId: 'user-1',
      text: 'Thank you for the offer. However, we were hoping for something closer to our asking price of $450,000.',
      timestamp: '2025-05-29T17:00:00Z',
      read: true,
    },
    {
      id: 'msg-3-3',
      conversationId: 'conv-3',
      senderId: 'buyer-agent-1',
      text: 'I understand. My clients are willing to increase their offer to $442,000 with a quick close (21 days) and minimal contingencies.',
      timestamp: '2025-05-29T18:15:00Z',
      read: true,
    },
    {
      id: 'msg-3-4',
      conversationId: 'conv-3',
      senderId: 'user-1',
      text: "That's getting closer. Can you provide details on their financing and any other contingencies?",
      timestamp: '2025-05-30T08:45:00Z',
      read: true,
    },
    {
      id: 'msg-3-5',
      conversationId: 'conv-3',
      senderId: 'buyer-agent-1',
      text: "They are pre-approved with Wells Fargo and have a 20% down payment ready. They're requesting a standard inspection contingency but are willing to waive the appraisal contingency.",
      timestamp: '2025-05-30T09:15:00Z',
      read: true,
      attachments: [
        {
          id: 'att-3-1',
          type: 'document',
          name: 'Pre-Approval_Letter.pdf',
          size: 175000,
        },
      ],
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'contractor-1',
      text: 'I visited your property at 456 Oak Ave today and completed the assessment for the kitchen renovation.',
      timestamp: '2025-05-27T13:00:00Z',
      read: true,
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: 'user-1',
      text: "Great! What's your quote for the work we discussed?",
      timestamp: '2025-05-27T13:30:00Z',
      read: true,
    },
    {
      id: 'msg-4-3',
      conversationId: 'conv-4',
      senderId: 'contractor-1',
      text: "I've attached the detailed quote for the kitchen renovation. The total comes to $18,500 including all materials and labor.",
      timestamp: '2025-05-28T09:45:00Z',
      read: true,
      attachments: [
        {
          id: 'att-4-1',
          type: 'document',
          name: 'Kitchen_Renovation_Quote.pdf',
          size: 420000,
        },
      ],
    },
    {
      id: 'msg-4-4',
      conversationId: 'conv-4',
      senderId: 'contractor-1',
      text: "I've also included some photos of similar kitchens we've completed so you can see our work quality.",
      timestamp: '2025-05-28T09:50:00Z',
      read: true,
      attachments: [
        {
          id: 'att-4-2',
          type: 'image',
          name: 'Kitchen_Sample_1.jpg',
          size: 1200000,
          thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
          id: 'att-4-3',
          type: 'image',
          name: 'Kitchen_Sample_2.jpg',
          size: 1500000,
          thumbnailUrl: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
      ],
    },
    {
      id: 'msg-4-5',
      conversationId: 'conv-4',
      senderId: 'user-1',
      text: 'These look great. When would you be able to start the work?',
      timestamp: '2025-05-28T14:15:00Z',
      read: true,
    },
    {
      id: 'msg-4-6',
      conversationId: 'conv-4',
      senderId: 'contractor-1',
      text: 'We could start as early as June 10th. The project would take approximately 2-3 weeks to complete.',
      timestamp: '2025-05-28T14:30:00Z',
      read: true,
    },
  ],
  'conv-5': [
    {
      id: 'msg-5-1',
      conversationId: 'conv-5',
      senderId: 'photographer-1',
      text: "Hi there! I'm scheduled to photograph your property at 789 Pine Blvd this Friday at 10 AM.",
      timestamp: '2025-05-26T11:00:00Z',
      read: true,
    },
    {
      id: 'msg-5-2',
      conversationId: 'conv-5',
      senderId: 'user-1',
      text: 'Perfect. Is there anything specific I should do to prepare the house?',
      timestamp: '2025-05-26T11:30:00Z',
      read: true,
    },
    {
      id: 'msg-5-3',
      conversationId: 'conv-5',
      senderId: 'photographer-1',
      text: "Yes! I've attached our pre-photography checklist. The most important things are decluttering surfaces, removing personal photos, and ensuring all lights work properly.",
      timestamp: '2025-05-26T13:45:00Z',
      read: true,
      attachments: [
        {
          id: 'att-5-1',
          type: 'document',
          name: 'Photography_Prep_Checklist.pdf',
          size: 185000,
        },
      ],
    },
    {
      id: 'msg-5-4',
      conversationId: 'conv-5',
      senderId: 'user-1',
      text: 'Thanks for the checklist. Will you be taking exterior photos as well?',
      timestamp: '2025-05-27T09:30:00Z',
      read: true,
    },
    {
      id: 'msg-5-5',
      conversationId: 'conv-5',
      senderId: 'photographer-1',
      text: "Yes, we'll do a complete package including exterior photos, all interior rooms, and aerial drone shots of the property and surrounding area.",
      timestamp: '2025-05-27T11:45:00Z',
      read: true,
    },
  ],
  'conv-6': [
    {
      id: 'msg-6-1',
      conversationId: 'conv-6',
      senderId: 'contractor-2',
      text: 'I completed the plumbing inspection at your property today. I found a few issues that need attention.',
      timestamp: '2025-05-29T14:30:00Z',
      read: true,
    },
    {
      id: 'msg-6-2',
      conversationId: 'conv-6',
      senderId: 'user-1',
      text: 'What kind of issues did you find? Anything major?',
      timestamp: '2025-05-29T14:45:00Z',
      read: true,
    },
    {
      id: 'msg-6-3',
      conversationId: 'conv-6',
      senderId: 'contractor-2',
      text: "There's a leaking pipe under the kitchen sink that needs to be replaced. Also, the water heater is showing signs of sediment buildup and should be flushed.",
      timestamp: '2025-05-29T15:00:00Z',
      read: true,
    },
    {
      id: 'msg-6-4',
      conversationId: 'conv-6',
      senderId: 'contractor-2',
      text: 'Here are some photos of the issues I found.',
      timestamp: '2025-05-29T15:05:00Z',
      read: false,
      attachments: [
        {
          id: 'att-6-1',
          type: 'image',
          name: 'Leaking_Pipe.jpg',
          size: 850000,
          thumbnailUrl: 'https://images.unsplash.com/photo-1594644465539-783d6f6bb37a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        {
          id: 'att-6-2',
          type: 'image',
          name: 'Water_Heater.jpg',
          size: 920000,
          thumbnailUrl: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
      ],
    },
    {
      id: 'msg-6-5',
      conversationId: 'conv-6',
      senderId: 'contractor-2',
      text: "I've prepared a quote for the repairs. We can schedule the work as early as next week if you approve.",
      timestamp: '2025-05-29T15:10:00Z',
      read: false,
      attachments: [
        {
          id: 'att-6-3',
          type: 'document',
          name: 'Plumbing_Repairs_Quote.pdf',
          size: 310000,
        },
      ],
    },
    {
      id: 'msg-6-6',
      conversationId: 'conv-6',
      senderId: 'contractor-2',
      text: 'Just following up on the quote I sent. Would you like to proceed with the repairs before listing the property?',
      timestamp: '2025-05-29T16:10:00Z',
      read: false,
    },
  ],
};

// Helper function to get property address by ID
export const getPropertyAddressByConversation = (conversation: Conversation) => {
  if (conversation.propertyId) {
    const property = mockListings.find(p => p.id === conversation.propertyId);
    return property?.address || 'Unknown property';
  }
  return 'General conversation';
};

// Helper function to get the other participant in a conversation (assuming conversations are between user and one other person)
export const getOtherParticipant = (conversation: Conversation): Participant | undefined => {
  return conversation.participants.find(p => p.type !== 'self');
};

// Helper function to get the last message for a conversation
export const getLastMessage = (conversationId: string): Message | undefined => {
  const messages = mockMessages[conversationId];
  if (messages && messages.length > 0) {
    return messages[messages.length - 1];
  }
  return undefined;
};

// Helper function to format date for display
export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // If the message is from today, just show the time
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If the message is from yesterday, show "Yesterday" and the time
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise, show the date and time
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};