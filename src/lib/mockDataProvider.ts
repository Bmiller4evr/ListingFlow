// Centralized mock data provider with dev mode checking
import { getCurrentUser } from './auth'
import { isDevMode } from './devMode'

// Import all mock data
import { mockListings } from '../data/mockData'
import { mockTodoItems } from '../data/calendarMock'
import { mockDocuments } from '../data/documentsMock'
import { mockMessages } from '../data/messagesMock'

export async function getListings() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    return mockListings
  }
  return []
}

export async function getTodoItems() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    return mockTodoItems
  }
  return []
}

export async function getDocuments() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    return mockDocuments
  }
  return []
}

export async function getMessages() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    return mockMessages
  }
  return []
}

export async function getShowings() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    // Return mock showings based on listings
    return mockListings.flatMap(listing => 
      // Generate some mock showings for each listing
      Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `${listing.id}-showing-${i}`,
        listingId: listing.id,
        listingAddress: listing.address,
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        time: ['10:00 AM', '2:00 PM', '4:00 PM'][Math.floor(Math.random() * 3)],
        agentName: 'John Smith',
        buyerName: 'Potential Buyer',
        status: ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)]
      }))
    )
  }
  return []
}

export async function getOffers() {
  const user = await getCurrentUser()
  if (isDevMode(user?.email || null)) {
    // Return mock offers based on listings
    return mockListings.slice(0, 2).map((listing, i) => ({
      id: `offer-${listing.id}`,
      listingId: listing.id,
      listingAddress: listing.address,
      buyerName: ['Sarah Johnson', 'Mike Wilson'][i],
      offerAmount: listing.price * (0.9 + Math.random() * 0.1),
      submittedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)]
    }))
  }
  return []
}