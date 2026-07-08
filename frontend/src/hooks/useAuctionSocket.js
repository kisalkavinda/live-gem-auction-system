import { useState, useEffect, useRef, useCallback } from 'react';

// MOCK DATA
export const MOCK_AUCTIONS = [
  {
    id: 'a1',
    name: 'Kashmiri Blue Sapphire',
    type: 'Sapphire',
    caratWeight: 4.05,
    certAuthority: 'GIA',
    certNumber: 'GIA-2022-031187',
    clarity: 'VS2',
    cut: 'Cushion',
    origin: 'Kashmir, India',
    description: 'The holy grail of sapphires — a Kashmir origin cushion cut with the legendary velvety cornflower blue. GIA certified, unheated.',
    color: '#1E40AF',
    colorName: 'Kashmir Cornflower Blue',
    imageUrl: '/images/gems/sapphire.png',
    startingBid: 8500000,
    minIncrement: 50000,
    status: 'LIVE',
    endsAt: new Date(Date.now() + 5 * 60000).toISOString(), // 5 mins from now
  },
  {
    id: 'a2',
    name: 'Burmese Pigeon Blood Ruby',
    type: 'Ruby',
    caratWeight: 3.21,
    certAuthority: 'GIA',
    certNumber: 'GIA-2024-087431',
    clarity: 'VS1',
    cut: 'Oval',
    origin: 'Mogok, Myanmar',
    description: 'An exceptional Burmese ruby of the finest pigeon blood hue, sourced from the legendary Mogok valley. GIA certified with no heat treatment.',
    color: '#B91C1C',
    colorName: 'Pigeon Blood Red',
    imageUrl: '/images/gems/ruby.png',
    startingBid: 1500000,
    minIncrement: 25000,
    status: 'LIVE',
    endsAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 mins from now
  },
  {
    id: 'a3',
    name: 'Colombian Vivid Green Emerald',
    type: 'Emerald',
    caratWeight: 2.87,
    certAuthority: 'CDTEC',
    certNumber: 'CDTEC-2024-005512',
    clarity: 'SI1',
    cut: 'Emerald',
    origin: 'Muzo, Colombia',
    description: 'Muzo origin vivid green emerald exhibiting the classic warm saturation unique to Colombian stones.',
    color: '#15803D',
    colorName: 'Vivid Green',
    imageUrl: '/images/gems/emerald.png',
    startingBid: 2100000,
    minIncrement: 30000,
    status: 'UPCOMING',
    endsAt: new Date(Date.now() + 2 * 3600000).toISOString(), // 2 hours from now
  },
  {
    id: 'a4',
    name: 'Padparadscha Sapphire',
    type: 'Sapphire',
    caratWeight: 1.92,
    certAuthority: 'GIA',
    certNumber: 'GIA-2024-054209',
    clarity: 'VVS1',
    cut: 'Oval',
    origin: 'Ratnapura, Sri Lanka',
    description: 'An exceptionally rare Padparadscha sapphire exhibiting the delicate salmon-pink hue reminiscent of a lotus blossom.',
    color: '#EA580C',
    colorName: 'Lotus Pink-Orange',
    imageUrl: '/images/gems/topaz.png',
    startingBid: 4200000,
    minIncrement: 40000,
    status: 'LIVE',
    endsAt: new Date(Date.now() + 45 * 1000).toISOString(), // 45 seconds from now (for testing urgency state)
  }
];

const MOCK_BIDDERS = ['Bidder ****42', 'Bidder ****91', 'Bidder ****07', 'Bidder ****88', 'Bidder ****33'];

/**
 * -----------------------------------------------------------------------------
 * TODO: REAL WEBSOCKET INTEGRATION
 * When the backend is ready, replace this mock implementation with a real
 * WebSocket client (e.g., native WebSocket API).
 * 
 * Example Native WebSocket approach:
 * 
 * const ws = useRef(null);
 * useEffect(() => {
 *   ws.current = new WebSocket(`wss://api.gemhaven.com/auctions/${auctionId}`);
 *   ws.current.onopen = () => setConnectionStatus('CONNECTED');
 *   ws.current.onmessage = (event) => {
 *     const data = JSON.parse(event.data);
 *     if (data.type === 'NEW_BID') handleNewBid(data.payload);
 *     if (data.type === 'AUCTION_END') handleAuctionEnd(data.payload);
 *   };
 *   ws.current.onclose = () => setConnectionStatus('DISCONNECTED');
 *   return () => ws.current.close();
 * }, [auctionId]);
 * 
 * const placeBid = (amount) => {
 *   ws.current.send(JSON.stringify({ type: 'PLACE_BID', payload: { amount } }));
 * };
 * -----------------------------------------------------------------------------
 */

export function useAuctionSocket(auctionId) {
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');
  const [winner, setWinner] = useState(null);
  
  const timerRef = useRef(null);
  const botBidRef = useRef(null);
  const isAuctionEnded = useRef(false);

  // Initialize mock auction
  useEffect(() => {
    if (!auctionId) return;
    
    // Simulate connection delay
    const initTimer = setTimeout(() => {
      const found = MOCK_AUCTIONS.find(a => a.id === auctionId);
      if (found) {
        setAuction(found);
        setCurrentBid(found.startingBid);
        setConnectionStatus('CONNECTED');
        
        // Initial bid history (just the starting bid placeholder)
        setBidHistory([{
          id: 'initial',
          bidder: 'System',
          amount: found.startingBid,
          timestamp: new Date().toISOString(),
          isSystem: true,
          message: 'Auction started at'
        }]);
      } else {
        setConnectionStatus('DISCONNECTED');
      }
    }, 800);

    return () => clearTimeout(initTimer);
  }, [auctionId]);

  // Countdown timer loop
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !auction || isAuctionEnded.current) return;

    const tick = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endsAt).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeRemaining(diff);
      
      if (diff <= 0) {
        clearInterval(timerRef.current);
        clearTimeout(botBidRef.current);
        isAuctionEnded.current = true;
        
        // Declare winner
        setBidHistory(prev => {
          const highestBid = prev.find(b => !b.isSystem);
          if (highestBid) {
            setWinner({ bidder: highestBid.bidder, amount: highestBid.amount });
            return [{
              id: 'end',
              bidder: 'System',
              amount: highestBid.amount,
              timestamp: new Date().toISOString(),
              isSystem: true,
              message: `Auction won by ${highestBid.bidder} for`
            }, ...prev];
          } else {
            setWinner({ bidder: 'No Bids', amount: 0 });
            return [{
              id: 'end',
              bidder: 'System',
              amount: auction.startingBid,
              timestamp: new Date().toISOString(),
              isSystem: true,
              message: 'Auction ended with no bids.'
            }, ...prev];
          }
        });
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => clearInterval(timerRef.current);
  }, [auction, connectionStatus]);

  // Automated mock bids
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !auction || isAuctionEnded.current || auction.status !== 'LIVE') return;

    const scheduleNextBid = () => {
      if (isAuctionEnded.current) return;
      
      // Random delay between 4s and 12s
      const delay = Math.floor(Math.random() * 8000) + 4000;
      
      botBidRef.current = setTimeout(() => {
        if (isAuctionEnded.current) return;
        
        const bidder = MOCK_BIDDERS[Math.floor(Math.random() * MOCK_BIDDERS.length)];
        // Add 1 to 3 increments
        const increments = Math.floor(Math.random() * 3) + 1;
        
        setCurrentBid(prev => {
          const nextBid = prev + (auction.minIncrement * increments);
          
          setBidHistory(history => [{
            id: Math.random().toString(36).substr(2, 9),
            bidder,
            amount: nextBid,
            timestamp: new Date().toISOString(),
            isSystem: false
          }, ...history]);
          
          return nextBid;
        });
        
        scheduleNextBid();
      }, delay);
    };

    scheduleNextBid();

    return () => clearTimeout(botBidRef.current);
  }, [auction, connectionStatus]);

  // Function to place a manual bid
  const placeBid = useCallback((amount) => {
    if (isAuctionEnded.current || connectionStatus !== 'CONNECTED' || !auction) {
      return { success: false, message: 'Auction is not active.' };
    }
    
    if (amount < currentBid + auction.minIncrement) {
      return { success: false, message: `Bid must be at least LKR ${(currentBid + auction.minIncrement).toLocaleString('en-LK')}` };
    }

    setCurrentBid(amount);
    setBidHistory(history => [{
      id: Math.random().toString(36).substr(2, 9),
      bidder: 'You (Bidder ****MY)',
      amount: amount,
      timestamp: new Date().toISOString(),
      isSystem: false,
      isUser: true
    }, ...history]);

    return { success: true };
  }, [currentBid, auction, connectionStatus]);

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
