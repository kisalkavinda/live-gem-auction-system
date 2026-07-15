import apiClient from './apiClient';

export async function fetchLandPlots(filters = {}) {
  try {
    const response = await apiClient.get('/land', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching land plots:", error);
    throw error;
  }
}

export async function fetchLandPlotById(id) {
  try {
    const response = await apiClient.get(`/land/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching land plot ${id}:`, error);
    throw error;
  }
}

export async function submitSiteVisitBooking(bookingData) {
  try {
    // bookingData includes plotId, name, email, phone, date, visitors, notes
    const payload = {
      fullName: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      preferredVisitDate: bookingData.date,
      numVisitors: bookingData.visitors,
      message: bookingData.notes
    };
    const response = await apiClient.post(`/land/${bookingData.plotId}/bookings`, payload);
    return response.data; // usually returns the created booking
  } catch (error) {
    console.error(`Error submitting booking for land ${bookingData.plotId}:`, error);
    throw error;
  }
}
