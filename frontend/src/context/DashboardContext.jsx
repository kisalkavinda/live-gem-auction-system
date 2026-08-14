import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchGems } from '../services/gemService';
import apiClient from '../services/apiClient';
import { mockBuyers } from '../data/mockBuyers';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [gems, setGems] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [lands, setLands] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const [isWsConnected, setIsWsConnected] = useState(false);
  const stompClient = useRef(null);
  const subscriptions = useRef({});

  useEffect(() => {
    fetchGems({ status: 'ALL' })
      .then(data => setGems(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching gems:', err));

    // Fetch auctions and lands for everyone
    apiClient.get('/land')
      .then(res => setLands(Array.isArray(res?.data) ? res.data : []))
      .catch(console.error);

    apiClient.get('/auctions')
      .then(res => setAuctions(Array.isArray(res?.data) ? res.data : []))
      .catch(console.error);

    // Only fetch admin-specific data if the user is an ADMIN
    let user = null;
    try {
      const userStr = localStorage.getItem('user');
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }
    const isAdmin = user && user.role === 'ADMIN';

    if (isAdmin) {
      apiClient.get('/admin/stats/overview')
        .then(res => setStats(res?.data || null))
        .catch(console.error);

      apiClient.get('/admin/activity')
        .then(res => setRecentActivity(Array.isArray(res?.data) ? res.data : []))
        .catch(console.error);

      apiClient.get('/land/bookings')
        .then(res => setBookings(Array.isArray(res?.data) ? res.data : []))
        .catch(console.error);

      apiClient.get('/admin/buyers')
        .then(res => {
          if (Array.isArray(res?.data)) {
            const mapped = res.data.map(b => ({
              ...b,
              name: b.fullName || b.name || 'Buyer',
              joinDate: b.joinDate ? new Date(b.joinDate).toLocaleDateString() : 'N/A'
            }));
            setBuyers(mapped);
          } else {
            setBuyers([]);
          }
        })
        .catch(console.error);

      // Connect STOMP for live auction updates
      const token = localStorage.getItem('token') || '';
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

      Promise.all([
        import('@stomp/stompjs'),
        import('sockjs-client')
      ]).then(([stompjs, sockjsModule]) => {
        const SockJS = sockjsModule.default || sockjsModule;
        const client = new stompjs.Client({
          webSocketFactory: () => new SockJS(`${baseUrl}/ws?token=${token}`),
          reconnectDelay: 5000,
          onStompError: (frame) => {
            console.warn('STOMP Error:', frame);
          },
          onWebSocketError: (evt) => {
            console.warn('WebSocket Error:', evt);
          }
        });

        client.onConnect = () => {
          stompClient.current = client;
          setIsWsConnected(true);
        };

        client.onWebSocketClose = () => {
          setIsWsConnected(false);
          subscriptions.current = {};
        };

        client.activate();
      }).catch(err => console.warn('Failed to load WebSocket client:', err));

      return () => {
        if (stompClient.current) {
          stompClient.current.deactivate();
        }
      };
    }
  }, []);

  // Dynamically subscribe to any auction that is LIVE
  useEffect(() => {
    if (!isWsConnected || !stompClient.current) return;

    const liveAuctions = auctions.filter(a => a.status?.toUpperCase() === 'LIVE');
    liveAuctions.forEach(a => {
      if (!subscriptions.current[a.id]) {
        subscriptions.current[a.id] = stompClient.current.subscribe(`/topic/auctions/${a.id}`, (message) => {
          if (message.body) {
            const update = JSON.parse(message.body);
            if (update.type === 'BID_PLACED') {
              setAuctions(prev => prev.map(auc => 
                auc.id === update.auctionId ? { ...auc, currentBid: update.currentBid, endTime: update.endTime || auc.endTime } : auc
              ));
            } else if (update.type === 'AUCTION_ENDED') {
              setAuctions(prev => prev.map(auc => 
                auc.id === update.auctionId ? { ...auc, status: 'ENDED', currentBid: update.winningBid, highestBidderId: update.winnerId } : auc
              ));
            }
          }
        });
      }
    });
  }, [auctions, isWsConnected]);

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
