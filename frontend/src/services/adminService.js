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

export async function publishGem(id) {
  try {
    const response = await apiClient.post(`/gems/${id}/publish`);
    return { success: true, gem: response.data };
  } catch (error) {
    console.error(`Error publishing gem ${id}:`, error);
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

export async function updateAuction(id, auctionData) {
  try {
    const response = await apiClient.put(`/auctions/${id}`, auctionData);
    return { success: true, auction: response.data };
  } catch (error) {
    console.error(`Error updating auction ${id}:`, error);
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

export async function exportAuctionLog(auctionId) {
  try {
    const response = await apiClient.get(`/auctions/${auctionId}/export-log`, {
      responseType: 'blob', // Important for downloading files
    });
    
    // Create a temporary link element to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Extract filename from headers if possible, otherwise use default
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `auction_${auctionId}_log.csv`;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (fileNameMatch && fileNameMatch.length === 2)
        fileName = fileNameMatch[1];
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error(`Error exporting auction log ${auctionId}:`, error);
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

