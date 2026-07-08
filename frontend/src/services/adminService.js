/**
 * adminService.js
 * 
 * Mock service functions for Dashboard CRUD operations.
 * Simulates network latency and resolves with mock response structures.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function addGem(gemData) {
  await delay(600);
  console.log('Mock API: Add Gem', gemData);
  return {
    success: true,
    gem: {
      ...gemData,
      id: `new-gem-${Date.now()}` // Mock ID generation
    }
  };
}

export async function updateGem(id, gemData) {
  await delay(600);
  console.log(`Mock API: Update Gem ${id}`, gemData);
  return { success: true, gem: { ...gemData, id } };
}

export async function deleteGem(id) {
  await delay(600);
  console.log(`Mock API: Delete Gem ${id}`);
  return { success: true };
}

export async function createAuction(auctionData) {
  await delay(700);
  console.log('Mock API: Create Auction', auctionData);
  return {
    success: true,
    auction: {
      ...auctionData,
      id: `new-auction-${Date.now()}`
    }
  };
}

export async function endAuctionEarly(id) {
  await delay(500);
  console.log(`Mock API: End Auction Early ${id}`);
  return { success: true };
}

export async function deleteAuction(id) {
  await delay(500);
  console.log(`Mock API: Delete Auction ${id}`);
  return { success: true };
}

export async function addLandListing(landData) {
  await delay(600);
  console.log('Mock API: Add Land', landData);
  return {
    success: true,
    land: {
      ...landData,
      id: `new-land-${Date.now()}`
    }
  };
}

export async function deleteLandListing(id) {
  await delay(600);
  console.log(`Mock API: Delete Land ${id}`);
  return { success: true };
}

export async function updateBuyerStatus(buyerId, status) {
  await delay(500);
  console.log(`Mock API: Update Buyer ${buyerId} to ${status}`);
  return { success: true };
}

export async function updateBookingStatus(bookingId, status) {
  await delay(500);
  console.log(`Mock API: Update Booking ${bookingId} to ${status}`);
  return { success: true };
}

