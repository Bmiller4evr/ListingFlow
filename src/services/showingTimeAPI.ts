/**
 * ShowingTime API Service
 * This service handles integration with the ShowingTime API for managing property showings
 */

// ShowingTime API configuration (these would be loaded from environment variables in a real app)
const SHOWING_TIME_API = {
  baseUrl: "https://api.showingtime.com/v2",
  apiKey: "YOUR_SHOWING_TIME_API_KEY_HERE",
};

// ShowingTime showing status types
export type ShowingTimeStatus = 
  | 'Requested'    // Initial request state
  | 'Confirmed'    // Showing approved by listing agent/seller
  | 'Completed'    // Showing has taken place
  | 'Canceled'     // Showing was canceled
  | 'Denied'       // Showing request was denied
  | 'Rescheduled'; // Showing was rescheduled

// Feedback status types
export type FeedbackStatus =
  | 'Pending'      // Feedback has been requested but not received
  | 'Received'     // Feedback has been submitted
  | 'None';        // No feedback has been requested yet

// ShowingTime showing interface matching their API schema
export interface ShowingTimeAppointment {
  id: string;
  propertyId: string;
  listingId: string;
  showingDate: string;         // ISO date string
  startTime: string;           // Time format HH:MM
  endTime: string;             // Time format HH:MM
  buyerAgentId?: string;
  buyerAgentName: string;
  buyerAgentPhone: string;
  buyerAgentEmail?: string;
  buyerAgentCompany?: string;
  buyerName?: string;
  showingStatus: ShowingTimeStatus;
  confirmationCode?: string;
  confirmationDate?: string;   // ISO date string
  instructions?: string;
  accessType?: string;         // e.g., "Lockbox", "Agent Present"
  feedbackStatus: FeedbackStatus;
  feedback?: {
    id: string;
    submittedDate?: string;     // ISO date string
    overallImpression: number;  // 1-5 scale
    price: number;              // 1-5 scale
    condition: number;          // 1-5 scale
    location: number;           // 1-5 scale
    comment: string;
    buyerInterest: 'Very Interested' | 'Somewhat Interested' | 'Not Interested';
    showAgain: boolean;
    buyerFeedback?: string;
  };
  cancelReason?: string;
  rescheduledFrom?: string;
}

// Mock ShowingTime API client
export class ShowingTimeAPI {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey = SHOWING_TIME_API.apiKey, baseUrl = SHOWING_TIME_API.baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  /**
   * Authenticate with ShowingTime API
   * @returns Promise<boolean> Authentication success
   */
  async authenticate(): Promise<boolean> {
    // In a real implementation, this would make an actual API call
    console.log('Authenticating with ShowingTime API');
    return Promise.resolve(true);
  }
  
  /**
   * Get all showings for a listing
   * @param listingId The MLS listing ID
   * @returns Promise<ShowingTimeAppointment[]> List of showings
   */
  async getShowings(listingId: string): Promise<ShowingTimeAppointment[]> {
    // In a real implementation, this would make an actual API call
    console.log(`Getting showings for listing: ${listingId}`);
    return Promise.resolve(mockShowingTimeData.filter(showing => showing.listingId === listingId));
  }
  
  /**
   * Create a new showing request
   * @param showingData The showing data
   * @returns Promise<ShowingTimeAppointment> The created showing
   */
  async createShowing(showingData: Partial<ShowingTimeAppointment>): Promise<ShowingTimeAppointment> {
    // In a real implementation, this would make an actual API call
    console.log('Creating new showing', showingData);
    const newShowing: ShowingTimeAppointment = {
      id: `st-${Date.now()}`,
      propertyId: showingData.propertyId || '',
      listingId: showingData.listingId || '',
      showingDate: showingData.showingDate || new Date().toISOString().split('T')[0],
      startTime: showingData.startTime || '12:00',
      endTime: showingData.endTime || '13:00',
      buyerAgentName: showingData.buyerAgentName || '',
      buyerAgentPhone: showingData.buyerAgentPhone || '',
      showingStatus: showingData.showingStatus || 'Requested',
      feedbackStatus: 'None',
    };
    
    return Promise.resolve(newShowing);
  }
  
  /**
   * Update a showing's status
   * @param showingId The showing ID
   * @param status The new status
   * @returns Promise<ShowingTimeAppointment> The updated showing
   */
  async updateShowingStatus(showingId: string, status: ShowingTimeStatus): Promise<ShowingTimeAppointment> {
    // In a real implementation, this would make an actual API call
    console.log(`Updating showing ${showingId} to status: ${status}`);
    const showing = mockShowingTimeData.find(s => s.id === showingId);
    if (!showing) {
      return Promise.reject(new Error(`Showing with ID ${showingId} not found`));
    }
    
    const updatedShowing = { ...showing, showingStatus: status };
    return Promise.resolve(updatedShowing);
  }
  
  /**
   * Request feedback for a completed showing
   * @param showingId The showing ID
   * @returns Promise<boolean> Success indicator
   */
  async requestFeedback(showingId: string): Promise<boolean> {
    // In a real implementation, this would make an actual API call
    console.log(`Requesting feedback for showing: ${showingId}`);
    const showing = mockShowingTimeData.find(s => s.id === showingId);
    if (!showing || showing.showingStatus !== 'Completed') {
      return Promise.reject(new Error(`Cannot request feedback for showing ${showingId}`));
    }
    
    return Promise.resolve(true);
  }
  
  /**
   * Get feedback for a showing
   * @param showingId The showing ID
   * @returns Promise<ShowingTimeAppointment['feedback']> The feedback data
   */
  async getFeedback(showingId: string): Promise<ShowingTimeAppointment['feedback'] | null> {
    // In a real implementation, this would make an actual API call
    console.log(`Getting feedback for showing: ${showingId}`);
    const showing = mockShowingTimeData.find(s => s.id === showingId);
    if (!showing) {
      return Promise.reject(new Error(`Showing with ID ${showingId} not found`));
    }
    
    return Promise.resolve(showing.feedback || null);
  }
  
  /**
   * Cancel a showing
   * @param showingId The showing ID
   * @param reason The cancellation reason
   * @returns Promise<ShowingTimeAppointment> The updated showing
   */
  async cancelShowing(showingId: string, reason: string): Promise<ShowingTimeAppointment> {
    // In a real implementation, this would make an actual API call
    console.log(`Canceling showing ${showingId}. Reason: ${reason}`);
    const showing = mockShowingTimeData.find(s => s.id === showingId);
    if (!showing) {
      return Promise.reject(new Error(`Showing with ID ${showingId} not found`));
    }
    
    const updatedShowing = { 
      ...showing, 
      showingStatus: 'Canceled' as ShowingTimeStatus,
      cancelReason: reason 
    };
    return Promise.resolve(updatedShowing);
  }
  
  /**
   * Reschedule a showing
   * @param showingId The showing ID to reschedule
   * @param newDate The new date
   * @param newStartTime The new start time
   * @param newEndTime The new end time
   * @returns Promise<ShowingTimeAppointment> The updated showing
   */
  async rescheduleShowing(
    showingId: string, 
    newDate: string, 
    newStartTime: string, 
    newEndTime: string
  ): Promise<ShowingTimeAppointment> {
    // In a real implementation, this would make an actual API call
    console.log(`Rescheduling showing ${showingId} to ${newDate} from ${newStartTime} to ${newEndTime}`);
    const showing = mockShowingTimeData.find(s => s.id === showingId);
    if (!showing) {
      return Promise.reject(new Error(`Showing with ID ${showingId} not found`));
    }
    
    const updatedShowing = { 
      ...showing, 
      showingStatus: 'Rescheduled' as ShowingTimeStatus,
      showingDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      rescheduledFrom: `${showing.showingDate} ${showing.startTime}`
    };
    return Promise.resolve(updatedShowing);
  }
}

// Create mock showings data that mimics ShowingTime's API response format
export const mockShowingTimeData: ShowingTimeAppointment[] = [
  {
    id: "st-1001",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-25",
    startTime: "14:00",
    endTime: "15:00",
    buyerAgentName: "Sarah Johnson",
    buyerAgentPhone: "512-555-1234",
    buyerAgentEmail: "sjohnson@realtygroup.com",
    buyerAgentCompany: "Austin Realty Group",
    buyerName: "Thomas Family",
    showingStatus: "Completed",
    confirmationCode: "ST9876543",
    confirmationDate: "2025-05-20T10:15:00Z",
    instructions: "Please remove shoes upon entry. Dog will be secured in backyard.",
    accessType: "Lockbox",
    feedbackStatus: "Received",
    feedback: {
      id: "fb-1001",
      submittedDate: "2025-05-26T09:30:00Z",
      overallImpression: 4,
      price: 3,
      condition: 5,
      location: 4,
      comment: "Clients loved the layout and kitchen. Thought the backyard was smaller than expected. Concerned about the price.",
      buyerInterest: "Somewhat Interested",
      showAgain: true,
      buyerFeedback: "Beautiful home but slightly above their budget."
    }
  },
  {
    id: "st-1002",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-27",
    startTime: "16:30",
    endTime: "17:30",
    buyerAgentName: "Michael Rodriguez",
    buyerAgentPhone: "512-555-5678",
    buyerAgentEmail: "mrodriguez@metroprealty.com",
    buyerAgentCompany: "Metro Property Group",
    buyerName: "Martinez Couple",
    showingStatus: "Completed",
    confirmationCode: "ST9876544",
    confirmationDate: "2025-05-22T14:20:00Z",
    instructions: "Please remove shoes upon entry. Dog will be secured in backyard.",
    accessType: "Lockbox",
    feedbackStatus: "Received",
    feedback: {
      id: "fb-1002",
      submittedDate: "2025-05-27T18:45:00Z",
      overallImpression: 5,
      price: 4,
      condition: 5,
      location: 5,
      comment: "Clients were very impressed with the property. They particularly liked the updated kitchen and master bathroom. Price seems reasonable for the area.",
      buyerInterest: "Very Interested",
      showAgain: true,
      buyerFeedback: "Client plans to submit an offer soon."
    }
  },
  {
    id: "st-1003",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-29",
    startTime: "10:00",
    endTime: "11:00",
    buyerAgentName: "Robert Chen",
    buyerAgentPhone: "512-555-8901",
    buyerAgentEmail: "rchen@homesellers.com",
    buyerAgentCompany: "Home Sellers Inc.",
    buyerName: "Johnson Family",
    showingStatus: "Completed",
    confirmationCode: "ST9876545",
    confirmationDate: "2025-05-25T16:30:00Z",
    accessType: "Agent Present",
    feedbackStatus: "None",
  },
  {
    id: "st-1004",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-30",
    startTime: "13:00",
    endTime: "14:00",
    buyerAgentName: "Lisa Washington",
    buyerAgentPhone: "512-555-3456",
    buyerAgentEmail: "lwashington@austinhomes.com",
    buyerAgentCompany: "Austin Homes Realty",
    buyerName: "Peterson Couple",
    showingStatus: "Completed",
    confirmationCode: "ST9876546",
    confirmationDate: "2025-05-26T11:45:00Z",
    accessType: "Lockbox",
    feedbackStatus: "Pending",
  },
  {
    id: "st-1005",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-31",
    startTime: "13:00",
    endTime: "14:00",
    buyerAgentName: "Jennifer Lee",
    buyerAgentPhone: "512-555-9012",
    buyerAgentEmail: "jlee@texasrelocation.com",
    buyerAgentCompany: "Texas Relocation Experts",
    buyerName: "Garcia Family",
    showingStatus: "Confirmed",
    confirmationCode: "ST9876547",
    confirmationDate: "2025-05-28T09:15:00Z",
    instructions: "Please leave all lights on after showing.",
    accessType: "Lockbox",
    feedbackStatus: "None",
  },
  {
    id: "st-1006",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-06-02",
    startTime: "11:30",
    endTime: "12:30",
    buyerAgentName: "David Wilson",
    buyerAgentPhone: "512-555-3456",
    buyerAgentEmail: "dwilson@luxuryrealty.com",
    buyerAgentCompany: "Luxury Realty Partners",
    buyerName: "Anderson Family",
    showingStatus: "Confirmed",
    confirmationCode: "ST9876548",
    confirmationDate: "2025-05-29T14:25:00Z",
    instructions: "Please remove shoes upon entry. Security system will be disabled.",
    accessType: "Lockbox",
    feedbackStatus: "None",
  },
  {
    id: "st-1007",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-26",
    startTime: "15:30",
    endTime: "16:30",
    buyerAgentName: "Emma Thompson",
    buyerAgentPhone: "512-555-7890",
    buyerAgentEmail: "ethompson@premier.com",
    buyerAgentCompany: "Premier Properties",
    buyerName: "Williams Family",
    showingStatus: "Canceled",
    cancelReason: "Buyer had to change plans last minute",
    accessType: "Lockbox",
    feedbackStatus: "None",
  },
  {
    id: "st-1008",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-06-03",
    startTime: "17:00",
    endTime: "18:00",
    buyerAgentName: "Marcus Johnson",
    buyerAgentPhone: "512-555-2345",
    buyerAgentEmail: "mjohnson@realtyexperts.com",
    buyerAgentCompany: "Realty Experts",
    buyerName: "Kim Family",
    showingStatus: "Requested",
    instructions: "Please confirm by tomorrow at noon.",
    accessType: "Agent Present",
    feedbackStatus: "None",
  },
  {
    id: "st-1009",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-28",
    startTime: "10:00",
    endTime: "11:00",
    buyerAgentName: "Diana Foster",
    buyerAgentPhone: "512-555-6789",
    buyerAgentEmail: "dfoster@homes.com",
    buyerAgentCompany: "Homes Realty",
    showingStatus: "Completed",
    confirmationCode: "ST9876549",
    confirmationDate: "2025-05-24T13:20:00Z",
    accessType: "Lockbox",
    feedbackStatus: "Received",
    feedback: {
      id: "fb-1009",
      submittedDate: "2025-05-28T12:30:00Z",
      overallImpression: 3,
      price: 2,
      condition: 4,
      location: 3,
      comment: "Client felt the price was too high for the size. Liked the upgrades but concerned about the busy street.",
      buyerInterest: "Not Interested",
      showAgain: false
    }
  },
  {
    id: "st-1010",
    propertyId: "prop-3",
    listingId: "AUS78745123",
    showingDate: "2025-05-29",
    startTime: "14:00",
    endTime: "15:00",
    buyerAgentName: "Alan Parker",
    buyerAgentPhone: "512-555-1122",
    buyerAgentEmail: "aparker@homebuyers.com",
    buyerAgentCompany: "Home Buyers Realty",
    buyerName: "Reynolds Couple",
    showingStatus: "Completed",
    confirmationCode: "ST9876550",
    confirmationDate: "2025-05-25T10:10:00Z",
    accessType: "Lockbox",
    feedbackStatus: "None"
  }
];

export default new ShowingTimeAPI();