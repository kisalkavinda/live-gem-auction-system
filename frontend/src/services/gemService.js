import apiClient from './apiClient';

export async function fetchGems(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.clarity) params.append('clarity', filters.clarity);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.status) params.append('status', filters.status);
    
    // The backend doesn't support minPrice/maxPrice directly in the controller yet,
    // so we will fetch and filter on the frontend for those, or the backend could be updated later.
    // For now, let's fetch from the backend:
    const response = await apiClient.get(`/gems?${params.toString()}`);
    let gems = response.data;

    // Client-side filtering for price (since backend doesn't have it in the @GetMapping currently)
    if (filters.minPrice != null) {
      gems = gems.filter(g => g.price >= filters.minPrice);
    }
    if (filters.maxPrice != null) {
      gems = gems.filter(g => g.price <= filters.maxPrice);
    }

    return gems;
  } catch (error) {
    console.error("Error fetching gems:", error);
    return [];
  }
}

export async function fetchGemById(id) {
  try {
    const response = await apiClient.get(`/gems/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching gem ${id}:`, error);
    return null;
  }
}
