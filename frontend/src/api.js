const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to handle API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// API methods
export const polygonsAPI = {
  // Get all polygons
  getAll: () => apiRequest('/polygons'),
  
  // Create a new polygon
  create: (polygon) => apiRequest('/polygons', {
    method: 'POST',
    body: JSON.stringify(polygon),
  }),
  
  // Delete a polygon
  delete: (id) => apiRequest(`/polygons/${id}`, {
    method: 'DELETE',
  }),
};
