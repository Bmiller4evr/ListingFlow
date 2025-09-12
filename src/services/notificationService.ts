/**
 * Notification Service for Access Realty
 * Handles notifications across the application, powered by Twilio
 */

// Twilio service no longer exists - SMS functionality disabled
import { toast } from "sonner@2.0.3";

// Notification types
export type NotificationType = 
  | 'message'          // New message in conversation
  | 'offer'            // New offer received
  | 'showing'          // New showing request/update
  | 'document'         // Document requires attention
  | 'transaction'      // Transaction update
  | 'repair'           // Repair update
  | 'system';          // System notification

// Notification channels
export type NotificationChannel = 
  | 'in_app'           // In-app notification
  | 'sms'              // SMS notification
  | 'email'            // Email notification
  | 'push';            // Push notification

// Notification importance
export type NotificationImportance =
  | 'low'              // Non-urgent notification
  | 'medium'           // Default importance
  | 'high';            // Critical notification

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  propertyId?: string;
  entityId?: string;      // ID of the entity (showing, offer, document, etc.)
  actionUrl?: string;     // URL to navigate to when clicked
  importance: NotificationImportance;
}

// User notification preferences
export interface NotificationPreferences {
  message: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  offer: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  showing: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  document: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  transaction: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  repair: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  system: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
}

class NotificationService {
  private notifications: Notification[] = mockNotifications;
  private userPreferences: NotificationPreferences = defaultPreferences;
  private userPhoneNumber: string = "+15555551234"; // Would come from user profile in real app
  private userEmail: string = "user@example.com"; // Would come from user profile in real app
  
  constructor() {
    // Initialize notification service
    console.log("Notification service initialized");
  }
  
  /**
   * Get all notifications for the current user
   * @param limit Number of notifications to fetch
   * @returns Array of notifications
   */
  getNotifications(limit?: number): Notification[] {
    // Sort by timestamp, newest first
    const sorted = [...this.notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return limit ? sorted.slice(0, limit) : sorted;
  }
  
  /**
   * Get unread notification count
   * @returns Number of unread notifications
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
  
  /**
   * Mark a notification as read
   * @param id Notification ID to mark as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }
  
  /**
   * Create a new notification
   * @param type Notification type
   * @param title Notification title
   * @param message Notification message
   * @param options Additional options
   * @returns The created notification
   */
  async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    options: {
      propertyId?: string;
      entityId?: string;
      actionUrl?: string;
      importance?: NotificationImportance;
      channels?: NotificationChannel[];
    } = {}
  ): Promise<Notification> {
    const importance = options.importance || 'medium';
    const channels = options.channels || this.getDefaultChannels(type);
    
    // Create the notification object
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      propertyId: options.propertyId,
      entityId: options.entityId,
      actionUrl: options.actionUrl,
      importance
    };
    
    // Add to local notifications
    this.notifications.unshift(notification);
    
    // Send through selected channels based on preferences
    await this.sendThroughChannels(notification, channels);
    
    return notification;
  }
  
  /**
   * Create a message notification
   * @param conversationId Conversation ID
   * @param senderName Sender name
   * @param messagePreview Message preview
   * @returns The created notification
   */
  async createMessageNotification(
    conversationId: string,
    senderName: string,
    messagePreview: string
  ): Promise<Notification> {
    return this.createNotification(
      'message',
      `New message from ${senderName}`,
      messagePreview,
      {
        entityId: conversationId,
        actionUrl: `/messages?conversation=${conversationId}`,
        importance: 'medium'
      }
    );
  }
  
  /**
   * Create an offer notification
   * @param propertyId Property ID
   * @param offerId Offer ID
   * @param buyerName Buyer name
   * @param amount Offer amount
   * @returns The created notification
   */
  async createOfferNotification(
    propertyId: string,
    offerId: string,
    buyerName: string,
    amount: number
  ): Promise<Notification> {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
    
    return this.createNotification(
      'offer',
      `New Offer: ${formattedAmount}`,
      `${buyerName} has submitted an offer of ${formattedAmount} for your property.`,
      {
        propertyId,
        entityId: offerId,
        actionUrl: `/properties/${propertyId}/offers/${offerId}`,
        importance: 'high'
      }
    );
  }
  
  /**
   * Create a showing notification
   * @param propertyId Property ID
   * @param showingId Showing ID
   * @param agentName Agent name
   * @param dateTime Date and time of showing
   * @returns The created notification
   */
  async createShowingNotification(
    propertyId: string,
    showingId: string,
    agentName: string,
    dateTime: string
  ): Promise<Notification> {
    const formattedDate = new Date(dateTime).toLocaleString();
    
    return this.createNotification(
      'showing',
      'New Showing Request',
      `${agentName} has requested a showing at ${formattedDate}.`,
      {
        propertyId,
        entityId: showingId,
        actionUrl: `/properties/${propertyId}/showings`,
        importance: 'medium'
      }
    );
  }
  
  /**
   * Create a document notification
   * @param propertyId Property ID
   * @param documentId Document ID
   * @param documentName Document name
   * @param action Action required
   * @returns The created notification
   */
  async createDocumentNotification(
    propertyId: string,
    documentId: string,
    documentName: string,
    action: 'sign' | 'review' | 'upload'
  ): Promise<Notification> {
    let title = '';
    let message = '';
    
    switch (action) {
      case 'sign':
        title = 'Document Requires Signature';
        message = `Please sign ${documentName} to proceed with your transaction.`;
        break;
      case 'review':
        title = 'Document Ready for Review';
        message = `${documentName} is ready for your review.`;
        break;
      case 'upload':
        title = 'Document Upload Required';
        message = `Please upload ${documentName} to proceed with your transaction.`;
        break;
    }
    
    return this.createNotification(
      'document',
      title,
      message,
      {
        propertyId,
        entityId: documentId,
        actionUrl: `/properties/${propertyId}/documents/${documentId}`,
        importance: action === 'sign' ? 'high' : 'medium'
      }
    );
  }
  
  /**
   * Update user notification preferences
   * @param preferences Updated notification preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    console.log("Updated notification preferences:", this.userPreferences);
  }
  
  /**
   * Get user notification preferences
   * @returns Current notification preferences
   */
  getPreferences(): NotificationPreferences {
    return this.userPreferences;
  }
  
  /**
   * Send notification through selected channels
   * @param notification Notification to send
   * @param channels Channels to send through
   */
  private async sendThroughChannels(
    notification: Notification,
    channels: NotificationChannel[]
  ): Promise<void> {
    // In a real implementation, these would be sent through actual channels
    
    // Always show as in-app toast
    if (channels.includes('in_app')) {
      const variant = 
        notification.importance === 'high' ? 'destructive' :
        notification.importance === 'medium' ? 'default' : 'secondary';
      
      toast(notification.title, {
        description: notification.message,
        action: notification.actionUrl ? {
          label: "View",
          onClick: () => console.log("Navigating to", notification.actionUrl)
        } : undefined,
        duration: notification.importance === 'high' ? 8000 : 5000,
        variant
      });
    }
    
    // Send SMS (temporarily disabled - no Twilio service)
    if (channels.includes('sms')) {
      console.log("Would send SMS to", this.userPhoneNumber, ":", `${notification.title}: ${notification.message}`);
    }
    
    // Log other channels that would be implemented in a real app
    if (channels.includes('email')) {
      console.log("Would send email to", this.userEmail, "with subject", notification.title);
    }
    
    if (channels.includes('push')) {
      console.log("Would send push notification:", notification.title);
    }
  }
  
  /**
   * Get default notification channels based on type and preferences
   * @param type Notification type
   * @returns Array of default channels
   */
  private getDefaultChannels(type: NotificationType): NotificationChannel[] {
    const prefs = this.userPreferences[type];
    const channels: NotificationChannel[] = [];
    
    if (prefs.inApp) channels.push('in_app');
    if (prefs.sms) channels.push('sms');
    if (prefs.email) channels.push('email');
    if (prefs.push) channels.push('push');
    
    return channels;
  }
}

// Default notification preferences
export const defaultPreferences: NotificationPreferences = {
  message: {
    inApp: true,
    sms: false,
    email: false,
    push: true
  },
  offer: {
    inApp: true,
    sms: true,
    email: true,
    push: true
  },
  showing: {
    inApp: true,
    sms: true,
    email: false,
    push: true
  },
  document: {
    inApp: true,
    sms: false,
    email: true,
    push: true
  },
  transaction: {
    inApp: true,
    sms: false,
    email: true,
    push: true
  },
  repair: {
    inApp: true,
    sms: false,
    email: false,
    push: true
  },
  system: {
    inApp: true,
    sms: false,
    email: false,
    push: false
  }
};

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "offer",
    title: "New Offer: $635,000",
    message: "The Thompson Family has submitted an offer of $635,000 for your property.",
    timestamp: "2025-05-30T14:35:00Z",
    read: false,
    propertyId: "prop-3",
    entityId: "offer-1",
    actionUrl: "/properties/prop-3/offers/offer-1",
    importance: "high"
  },
  {
    id: "notif-2",
    type: "message",
    title: "New message from Sarah Johnson",
    message: "Also, we have one showing requested for Saturday at 2pm. Would that work for you?",
    timestamp: "2025-05-31T08:45:00Z",
    read: false,
    entityId: "conv-1",
    actionUrl: "/messages?conversation=conv-1",
    importance: "medium"
  },
  {
    id: "notif-3",
    type: "showing",
    title: "New Showing Request",
    message: "Jennifer Lee has requested a showing on Sunday at 1:00 PM.",
    timestamp: "2025-05-31T09:15:00Z",
    read: false,
    propertyId: "prop-3",
    entityId: "st-1005",
    actionUrl: "/properties/prop-3/showings",
    importance: "medium"
  },
  {
    id: "notif-4",
    type: "document",
    title: "Document Requires Signature",
    message: "Please sign the Purchase Offer - Thompson Family to proceed with your transaction.",
    timestamp: "2025-05-30T15:00:00Z",
    read: true,
    propertyId: "prop-3",
    entityId: "doc-5",
    actionUrl: "/properties/prop-3/documents/doc-5",
    importance: "high"
  },
  {
    id: "notif-5",
    type: "repair",
    title: "Repair Estimate Ready",
    message: "Your roof repair estimate from Austin Contractors is ready for review.",
    timestamp: "2025-05-29T14:10:00Z",
    read: true,
    propertyId: "prop-3",
    entityId: "repair-1",
    actionUrl: "/properties/prop-3/repairs/repair-1",
    importance: "medium"
  },
  {
    id: "notif-6",
    type: "message",
    title: "New message from Emma Thompson",
    message: "Here's an example of a recent virtual tour we created for a similar property to give you an idea of what to expect.",
    timestamp: "2025-05-31T09:30:00Z",
    read: false,
    entityId: "conv-5",
    actionUrl: "/messages?conversation=conv-5",
    importance: "low"
  },
  {
    id: "notif-7",
    type: "system",
    title: "Account Verification Complete",
    message: "Your account has been verified successfully. You now have full access to all Access Realty features.",
    timestamp: "2025-05-28T10:00:00Z",
    read: true,
    importance: "low"
  },
  {
    id: "notif-8",
    type: "transaction",
    title: "Transaction Status Update",
    message: "Your transaction for 789 Pine Blvd has moved to the 'Under Contract' stage.",
    timestamp: "2025-05-30T16:15:00Z",
    read: true,
    propertyId: "prop-3",
    actionUrl: "/properties/prop-3/transaction",
    importance: "high"
  },
  {
    id: "notif-9",
    type: "message",
    title: "New message from David Wilson",
    message: "Just checking in to see if you've had a chance to review our offer?",
    timestamp: "2025-05-30T17:45:00Z",
    read: false,
    entityId: "conv-3",
    actionUrl: "/messages?conversation=conv-3",
    importance: "medium"
  },
  {
    id: "notif-10",
    type: "document",
    title: "Document Ready for Review",
    message: "Home Inspection Report is ready for your review.",
    timestamp: "2025-05-29T13:00:00Z",
    read: true,
    propertyId: "prop-3",
    entityId: "doc-4",
    actionUrl: "/properties/prop-3/documents/doc-4",
    importance: "medium"
  }
];

export default new NotificationService();