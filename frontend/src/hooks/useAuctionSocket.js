import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../services/apiClient';

export function useAuctionSocket(auctionId) {
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');
  const [winner, setWinner] = useState(null);
  
  const stompClient = useRef(null);
  const timerRef = useRef(null);
  const isAuctionEnded = useRef(false);

  // Initialize auction from backend
  useEffect(() => {
    if (!auctionId) return;
    
    let isMounted = true;
    
    const fetchAuctionData = async () => {
      try {
        const { data } = await apiClient.get(`/auctions/${auctionId}`);
        if (!isMounted) return;
        
        const mappedAuction = {
          ...data,
          ...data.gemstone,
          id: data.id,
          endsAt: data.endTime,
          startsAt: data.startTime,
        };
        
        setAuction(mappedAuction);
        setCurrentBid(data.currentBid || data.startingPrice);
        
        if (data.status === 'ENDED' || data.status === 'SOLD') {
            isAuctionEnded.current = true;
        }

        // Fetch real bid history
        const historyRes = await apiClient.get(`/auctions/${auctionId}/bids`);
        if (!isMounted) return;
        
        const bids = historyRes.data.content || [];
        
        const mappedHistory = bids.map(b => ({
          id: b.id?.toString() || Math.random().toString(36).substr(2, 9),
          bidder: b.user ? `Bidder ****${b.user.email.substring(0, Math.max(0, b.user.email.indexOf('@') - 2))}` : 'Bidder',
          amount: b.amount,
          timestamp: b.timestamp,
          isSystem: false,
          isUser: false 
        }));
        
        // Add start event at the end of the list (oldest)
        mappedHistory.push({
          id: 'start',
          bidder: 'System',
          amount: data.startingPrice,
          timestamp: data.startTime,
          isSystem: true,
          message: 'Auction started at'
        });
        
        setBidHistory(mappedHistory);
        
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch auction:", err);
      }
    };

    fetchAuctionData();
    
    return () => {
      isMounted = false;
    };
  }, [auctionId]);

  // Connect STOMP WebSocket
  useEffect(() => {
    if (!auctionId || isAuctionEnded.current) return;
    
    // Get token to pass via URL for backend JwtAuthFilter
    const token = localStorage.getItem('token') || '';
    // Use the backend base URL or fallback to localhost
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
    
    const client = new Client({
      // We must pass the token as a query param because browser WebSockets don't support custom headers on connection
      webSocketFactory: () => new SockJS(`${baseUrl}/ws?token=${token}`),
      debug: function () {
        // console.log('[STOMP] ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('[STOMP] Connected to Auction WS');
      setConnectionStatus('CONNECTED');
      
      // Subscribe to auction updates (global broadcasts)
      client.subscribe(`/topic/auctions/${auctionId}`, (message) => {
        if (message.body) {
          const update = JSON.parse(message.body);
          if (update.type === 'BID_PLACED') {
             setCurrentBid(update.currentBid);
             
             // If endTime was extended, update the local auction state
             if (update.endTime) {
                 setAuction(prev => prev ? { ...prev, endsAt: update.endTime } : prev);
             }

             setBidHistory(prev => [{
               id: Math.random().toString(36).substr(2, 9),
               bidder: update.bidder || 'Bidder',
               amount: update.currentBid,
               timestamp: update.timestamp || new Date().toISOString(),
               isSystem: false,
               isUser: false
             }, ...prev]);
             
          } else if (update.type === 'AUCTION_ENDED') {
             isAuctionEnded.current = true;
             setConnectionStatus('DISCONNECTED');
             setWinner({ bidder: 'Highest Bidder', amount: update.winningBid });
             setBidHistory(prev => [{
               id: 'end',
               bidder: 'System',
               amount: update.winningBid || 0,
               timestamp: new Date().toISOString(),
               isSystem: true,
               message: update.message || 'Auction ended.'
             }, ...prev]);
             client.deactivate();
          }
        }
      });
      
      // Subscribe to personal errors
      client.subscribe(`/user/queue/errors`, (message) => {
         if (message.body) {
           const err = JSON.parse(message.body);
           if (err.auctionId === parseInt(auctionId, 10)) {
             console.error('[STOMP] Bidding error:', err.message);
             alert(`Bid Failed: ${err.message}`);
           }
         }
      });

      // Subscribe to outbid notifications
      client.subscribe(`/user/queue/outbid`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          if (data.auctionId === parseInt(auctionId, 10)) {
            // Can be used to show a toast notification
            console.log('You have been outbid!', data.newHighestBid);
          }
        }
     });
    };

    client.onStompError = (frame) => {
      console.error('[STOMP] Broker reported error: ' + frame.headers['message']);
      console.error('[STOMP] Additional details: ' + frame.body);
      setConnectionStatus('DISCONNECTED');
    };

    client.onWebSocketClose = () => {
      console.log('[STOMP] WebSocket closed');
      setConnectionStatus('DISCONNECTED');
    };
    
    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [auctionId]);

  // Countdown timer loop
  useEffect(() => {
    if (!auction || isAuctionEnded.current) return;

    const tick = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endsAt).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeRemaining(diff);
      
      if (diff <= 0) {
        clearInterval(timerRef.current);
        isAuctionEnded.current = true;
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => clearInterval(timerRef.current);
  }, [auction]);

  // Function to place a manual bid
  const placeBid = useCallback((amount) => {
    if (isAuctionEnded.current || connectionStatus !== 'CONNECTED' || !stompClient.current) {
      return { success: false, message: 'Auction is not active or connection lost.' };
    }
    
    if (amount < currentBid + (auction?.minIncrement || 0)) {
      return { success: false, message: `Bid must be at least LKR ${(currentBid + (auction?.minIncrement || 0)).toLocaleString('en-LK')}` };
    }

    // Send bid to backend via STOMP
    stompClient.current.publish({
      destination: `/app/auctions/${auctionId}/bid`,
      body: JSON.stringify({ amount })
    });
    
    return { success: true };
  }, [auctionId, currentBid, auction, connectionStatus]);

  return {
    auction,
    currentBid,
    bidHistory,
    timeRemaining,
    connectionStatus,
    winner,
    placeBid
  };
}
