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
  try {
    const response = await apiClient.post('/auctions', auctionData);
    return { success: true, auction: response.data };
  } catch (error) {
    console.error("Error creating auction:", error);
    throw error;
  }
}

export async function endAuctionEarly(id) {
  try {
    const response = await apiClient.post(`/auctions/${id}/end-early`);
    return { success: true, auction: response.data };
  } catch (error) {
    console.error(`Error ending auction early ${id}:`, error);
    throw error;
  }
}

export async function deleteAuction(id) {
  try {
    await apiClient.delete(`/auctions/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting auction ${id}:`, error);
    throw error;
  }
}

export async function addLandListing(landData) {
  try {
    const response = await apiClient.post('/land', landData);
    return { success: true, land: response.data };
  } catch (error) {
    console.error("Error adding land listing:", error);
    throw error;
  }
}

export async function deleteLandListing(id) {
  try {
    await apiClient.delete(`/land/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting land listing ${id}:`, error);
    throw error;
  }
}

export async function updateBuyerStatus(buyerId, status) {
  await delay(500);
  console.log(`Mock API: Update Buyer ${buyerId} to ${status}`);
  return { success: true };
}

export async function updateBookingStatus(bookingId, status) {
  try {
    await apiClient.put(`/land/bookings/${bookingId}/status`, { status });
    return { success: true };
  } catch (error) {
    console.error(`Error updating booking ${bookingId} status to ${status}:`, error);
    throw error;
  }
}

