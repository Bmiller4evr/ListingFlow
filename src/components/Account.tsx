import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { CreditCard, UserCircle, MapPin, Phone, Mail, Check, PlusCircle, Trash2, Receipt, Download, Calendar, Bell, MessageSquare } from "lucide-react";

const mockUserData = {
  personalInfo: {
    firstName: "Jennifer",
    lastName: "Wilson",
    email: "jennifer.wilson@example.com",
    phone: "(555) 123-4567",
    address: "1234 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94103"
  },
  notificationPreferences: {
    method: "email" // Options: "email" or "sms"
  },
  paymentMethods: [
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
      isDefault: true
    }
  ],
  paymentHistory: [
    {
      id: "txn_1",
      date: "2024-01-15",
      description: "Listing Fee - 1234 Market Street",
      amount: 399.00,
      status: "completed",
      paymentMethod: "Visa •••• 4242",
      type: "listing_fee"
    },
    {
      id: "txn_2",
      date: "2023-12-08",
      description: "Photography Service Add-on",
      amount: 150.00,
      status: "completed",
      paymentMethod: "Visa •••• 4242",
      type: "service_addon"
    },
    {
      id: "txn_3",
      date: "2023-11-22",
      description: "Premium Listing Upgrade",
      amount: 75.00,
      status: "completed",
      paymentMethod: "Visa •••• 4242",
      type: "upgrade"
    },
    {
      id: "txn_4",
      date: "2023-10-14",
      description: "Listing Fee - 5678 Oak Avenue",
      amount: 399.00,
      status: "refunded",
      paymentMethod: "Visa •••• 4242",
      type: "listing_fee"
    }
  ]
};

export function Account() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [formData, setFormData] = useState(mockUserData.personalInfo);
  const [notificationData, setNotificationData] = useState(mockUserData.notificationPreferences);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonal = () => {
    // In a real app, this would save the data to the backend
    setIsEditingPersonal(false);
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save the notification preferences to the backend
    setIsEditingNotifications(false);
  };

  const handleNotificationChange = (method: string) => {
    setNotificationData(prev => ({ ...prev, method }));
  };

  const handleAddPayment = () => {
    // In a real app, this would integrate with Stripe to add a payment method
    setIsAddingPayment(false);
  };

  const renderPaymentIcon = (type: string) => {
    return (
      <div className={`h-8 w-12 rounded flex items-center justify-center ${type === 'visa' ? 'bg-blue-600' : 'bg-red-600'}`}>
        <span className="text-white text-xs font-semibold">
          {type === 'visa' ? 'VISA' : type === 'mastercard' ? 'MC' : type.toUpperCase()}
        </span>
      </div>
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'refunded':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount: number, status: string) => {
    const formatted = `${amount.toFixed(2)}`;
    return status === 'refunded' ? `-${formatted}` : formatted;
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Personal Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal details and contact information
            </CardDescription>
          </div>
          <Button 
            variant={isEditingPersonal ? "ghost" : "outline"} 
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
          >
            {isEditingPersonal ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditingPersonal ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip" 
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{mockUserData.personalInfo.firstName} {mockUserData.personalInfo.lastName}</p>
                  <p className="text-sm text-muted-foreground">Account Owner</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{mockUserData.personalInfo.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{mockUserData.personalInfo.phone}</p>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Mailing Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p>
                      {mockUserData.personalInfo.address}<br />
                      {mockUserData.personalInfo.city}, {mockUserData.personalInfo.state} {mockUserData.personalInfo.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isEditingPersonal && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleSavePersonal}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Notification Preferences Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Select your preferred method for receiving important updates and alerts
            </CardDescription>
          </div>
          <Button 
            variant={isEditingNotifications ? "ghost" : "outline"} 
            onClick={() => setIsEditingNotifications(!isEditingNotifications)}
          >
            {isEditingNotifications ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditingNotifications ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-method">Preferred Notification Method</Label>
                <Select 
                  value={notificationData.method} 
                  onValueChange={handleNotificationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>SMS Text Messages</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                {notificationData.method === "email" 
                  ? "Receive updates about showings, offers, and important account information via email"
                  : "Get urgent alerts and time-sensitive notifications via text message"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {notificationData.method === "email" ? (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {notificationData.method === "email" ? "Email Notifications" : "SMS Text Messages"}
                  </span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {notificationData.method === "email" 
                  ? "Updates about showings, offers, and account information delivered via email"
                  : "Urgent alerts and time-sensitive notifications delivered via text message"
                }
              </p>
            </div>
          )}
        </CardContent>
        {isEditingNotifications && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              Save Preferences
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Payment Methods Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage payment methods for listings and services
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setIsAddingPayment(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingPayment ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input id="cardholderName" placeholder="Name as it appears on card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="•••" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Button onClick={handleAddPayment}>
                  Save Payment Method
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingPayment(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : mockUserData.paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {mockUserData.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {renderPaymentIcon(method.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}</p>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Check className="h-3 w-3" /> Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3>No Payment Methods Found</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                Add a payment method to easily pay for listings and services
              </p>
              <Button className="mt-4" onClick={() => setIsAddingPayment(true)}>
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <p>Payment processing is handled securely via Stripe</p>
          </div>
        </CardFooter>
      </Card>

      {/* Payment History Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View your transaction history and download receipts
            </CardDescription>
          </div>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </CardHeader>
        <CardContent>
          {mockUserData.paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {mockUserData.paymentHistory.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{transaction.description}</p>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span>{transaction.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-medium ${transaction.status === 'refunded' ? 'text-muted-foreground' : ''}`}>
                        {formatAmount(transaction.amount, transaction.status)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3>No Payment History</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                Your transaction history will appear here once you make your first payment
              </p>
            </div>
          )}
        </CardContent>
        {mockUserData.paymentHistory.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <p>Showing {mockUserData.paymentHistory.length} transactions • Need help? Contact support</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}