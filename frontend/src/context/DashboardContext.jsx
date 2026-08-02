import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGems } from '../services/gemService';
import apiClient from '../services/apiClient';
import { mockBuyers } from '../data/mockBuyers';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [gems, setGems] = useState([]);
  
  useEffect(() => {
    fetchGems({ status: 'ALL' }).then(data => setGems(data));
    
    // Fetch live lands and bookings for the admin dashboard
    apiClient.get('/land').then(res => setLands(res.data)).catch(console.error);
    apiClient.get('/land/bookings').then(res => setBookings(res.data)).catch(console.error);

    // Fetch auctions
    apiClient.get('/auctions').then(res => setAuctions(res.data)).catch(console.error);
  }, []);
  
  const [auctions, setAuctions] = useState([]);
  
  const [lands, setLands] = useState([]);
  const [buyers, setBuyers] = useState(mockBuyers);
  const [bookings, setBookings] = useState([]);

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
