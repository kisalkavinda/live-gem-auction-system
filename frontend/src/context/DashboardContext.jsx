import React, { createContext, useContext, useState } from 'react';
import { MOCK_GEMS } from '../data/mockGems';
import { MOCK_LAND_PLOTS } from '../data/mockLandPlots';
import { mockBuyers } from '../data/mockBuyers';
import { mockBookings } from '../data/mockBookings';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  // We use the imported mock data as the initial state
  const [gems, setGems] = useState(MOCK_GEMS);
  
  // Since we don't have a separate mockAuctions file, we derive initial mock auctions 
  // from the mockGems that have auction data (e.g., currentBid).
  // For the dashboard, we want an isolated list of auctions.
  const [auctions, setAuctions] = useState([
    {
      id: 'a1',
      gemId: 'g1',
      gemName: 'The Crimson Heart',
      currentBid: 1250000,
      status: 'Live',
      startTime: '2024-06-01T10:00:00Z',
      endTime: '2024-06-15T10:00:00Z',
      biddersCount: 14
    },
    {
      id: 'a2',
      gemId: 'g2',
      gemName: 'Midnight Star Sapphire',
      currentBid: 850000,
      status: 'Scheduled',
      startTime: '2024-07-01T10:00:00Z',
      endTime: '2024-07-15T10:00:00Z',
      biddersCount: 0
    },
    {
      id: 'a3',
      gemId: 'g3',
      gemName: 'Royal Emerald Cut',
      currentBid: 3200000,
      status: 'Ended',
      startTime: '2024-05-01T10:00:00Z',
      endTime: '2024-05-15T10:00:00Z',
      biddersCount: 42
    }
  ]);
  
  const [lands, setLands] = useState(MOCK_LAND_PLOTS);
  const [buyers, setBuyers] = useState(mockBuyers);
  const [bookings, setBookings] = useState(mockBookings);

  // Expose updater functions to be called after adminService resolves
  const addGemState = (gem) => setGems(prev => [gem, ...prev]);
  const updateGemState = (id, updatedGem) => setGems(prev => prev.map(g => g.id === id ? updatedGem : g));
  const deleteGemState = (id) => setGems(prev => prev.filter(g => g.id !== id));

  const addAuctionState = (auction) => setAuctions(prev => [auction, ...prev]);
  const deleteAuctionState = (id) => setAuctions(prev => prev.filter(a => a.id !== id));
  const updateAuctionState = (id, updatedAuction) => setAuctions(prev => prev.map(a => a.id === id ? updatedAuction : a));

  const addLandState = (land) => setLands(prev => [land, ...prev]);
  const deleteLandState = (id) => setLands(prev => prev.filter(l => l.id !== id));

  const updateBuyerStatusState = (id, status) => setBuyers(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  const updateBookingStatusState = (id, status) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

  return (
    <DashboardContext.Provider value={{
      gems, addGemState, updateGemState, deleteGemState,
      auctions, addAuctionState, updateAuctionState, deleteAuctionState,
      lands, addLandState, deleteLandState,
      buyers, updateBuyerStatusState,
      bookings, updateBookingStatusState
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
