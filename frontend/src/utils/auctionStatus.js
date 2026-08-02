export function parseDatePossible(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d;
}

// Returns one of: 'UPCOMING', 'LIVE', 'ENDED'
export function getAuctionStatus(auction = {}) {
  // Prefer explicit backend status when it is authoritative
  const backendStatus = (auction.status || '').toString().toUpperCase();

  // Normalize potential date fields
  const start = parseDatePossible(auction.startTime || auction.startsAt || auction.starts_at || auction.start);
  const end = parseDatePossible(auction.endTime || auction.endsAt || auction.ends_at || auction.end || auction.endsAt);

  const now = new Date();

  // If we have both start and end, determine based on time window
  if (start && end) {
    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'LIVE';
    return 'ENDED';
  }

  // If only end is available, use it as a proxy
  if (end) {
    if (now < end) {
      // If backend explicitly marks upcoming, respect that
      if (backendStatus === 'UPCOMING' || backendStatus === 'SCHEDULED') return 'UPCOMING';
      return 'LIVE';
    }
    return 'ENDED';
  }

  // Fallback to backend status strings
  if (backendStatus === 'SCHEDULED' || backendStatus === 'UPCOMING') return 'UPCOMING';
  if (backendStatus === 'LIVE' || backendStatus === 'ACTIVE' || backendStatus === 'PUBLISHED') return 'LIVE';
  if (backendStatus === 'ENDED' || backendStatus === 'CLOSED' || backendStatus === 'FINISHED') return 'ENDED';

  // Default: if nothing helpful, assume upcoming to be safe
  return 'UPCOMING';
}

export function isUpcoming(auction) { return getAuctionStatus(auction) === 'UPCOMING'; }
export function isLive(auction) { return getAuctionStatus(auction) === 'LIVE'; }
export function isEnded(auction) { return getAuctionStatus(auction) === 'ENDED'; }
