import apiClient from './apiClient';

/**
 * adminService.js
 * 
 * Live API service functions for Dashboard CRUD operations.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function addGem(gemData) {
  try {
    const response = await apiClient.post('/gems', gemData);
    return { success: true, gem: response.data };
  } catch (error) {
    console.error("Error adding gem:", error);
    throw error;
  }
}

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { url: '...' }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function updateGem(id, gemData) {
  try {
    const response = await apiClient.put(`/gems/${id}`, gemData);
    return { success: true, gem: response.data };
  } catch (error) {
    console.error(`Error updating gem ${id}:`, error);
    throw error;
  }
}

export async function deleteGem(id) {
  try {
    await apiClient.delete(`/gems/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting gem ${id}:`, error);
    throw error;
  }
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

