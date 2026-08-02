import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGems } from '../services/gemService';
import apiClient from '../services/apiClient';
import { mockBuyers } from '../data/mockBuyers';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [gems, setGems] = useState([]);
  
  useEffect(() => {
    fetchGems({ status: 'ALL' }).then(data => setGems(data));
    
    // Fetch auctions and lands for everyone
    apiClient.get('/land').then(res => setLands(res.data)).catch(console.error);
    apiClient.get('/auctions').then(res => setAuctions(res.data)).catch(console.error);

    // Only fetch admin-specific data if the user is an ADMIN
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user && user.role === 'ADMIN';

    if (isAdmin) {
      apiClient.get('/admin/stats/overview').then(res => setStats(res.data)).catch(console.error);
      apiClient.get('/admin/activity').then(res => setRecentActivity(res.data)).catch(console.error);
      apiClient.get('/land/bookings').then(res => setBookings(res.data)).catch(console.error);
      apiClient.get('/admin/buyers').then(res => {
        const mapped = res.data.map(b => ({
          ...b,
          name: b.fullName,
          joinDate: b.joinDate ? new Date(b.joinDate).toLocaleDateString() : 'N/A'
        }));
        setBuyers(mapped);
      }).catch(console.error);
    }
  }, []);
  
  const [auctions, setAuctions] = useState([]);
  
  const [lands, setLands] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

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
      bookings, updateBookingStatusState,
      stats, recentActivity
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
