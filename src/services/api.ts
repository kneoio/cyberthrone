import axios from 'axios';
import keycloak from './keycloak';
import { Dictator, Achievement, CreateDictatorRequest, CreateAchievementRequest } from '../types/dictator';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  try {
    // Ensure token is fresh before each request
    if (keycloak.authenticated) {
      await keycloak.updateToken(30); // Refresh if expires within 30 seconds
      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
        console.log('Adding auth token to request:', config.url);
      } else {
        console.warn('No token available despite being authenticated');
      }
    } else {
      console.log('User not authenticated for request:', config.url);
    }
  } catch (error) {
    console.error('Error updating token:', error);
    // If token refresh fails, proceed without token (will likely get 401)
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && keycloak.authenticated) {
      try {
        // Token expired, try to refresh
        await keycloak.updateToken(5);
        // Update the failed request with new token
        error.config.headers.Authorization = `Bearer ${keycloak.token}`;
        // Retry the request
        return api.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

// Public API endpoints (no authentication required)
export const publicApi = {
  // Get all dictators
  getDictators: async (): Promise<Dictator[]> => {
    const response = await api.get<Dictator[]>('/dictators');
    return response.data;
  },

  // Get dictator by ID
  getDictatorById: async (id: number): Promise<Dictator> => {
    const response = await api.get<Dictator>(`/dictators/${id}`);
    return response.data;
  },

  // Get all achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>('/achievements');
    return response.data;
  },

  // Get achievement by ID
  getAchievementById: async (id: number): Promise<Achievement> => {
    const response = await api.get<Achievement>(`/achievements/${id}`);
    return response.data;
  },

  // Get all achievements for a specific dictator
  getDictatorAchievements: async (dictatorId: number): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>(`/dictators/${dictatorId}/achievements`);
    return response.data;
  },

  // Initialize sample data (development only)
  initSampleData: async (): Promise<void> => {
    await api.post('/init/sample-data');
  },
};

// Protected API endpoints (require authentication)
export const protectedApi = {
  // Create new dictator profile OR update existing (single endpoint for both)
  createOrUpdateDictator: async (dictator: CreateDictatorRequest & { id?: number }): Promise<Dictator> => {
    const response = await api.post<Dictator>('/dictators', dictator);
    return response.data;
  },

  // Delete dictator profile
  deleteDictator: async (id: number): Promise<void> => {
    await api.delete(`/dictators/${id}`);
  },

  // Create new achievement for a dictator
  createAchievement: async (dictatorId: number, achievement: Omit<CreateAchievementRequest, 'dictatorId'>): Promise<Achievement> => {
    const response = await api.post<Achievement>(`/dictators/${dictatorId}/achievements`, achievement);
    return response.data;
  },

  // Update achievement
  updateAchievement: async (id: number, achievement: Partial<CreateAchievementRequest>): Promise<Achievement> => {
    const response = await api.put<Achievement>(`/achievements/${id}`, achievement);
    return response.data;
  },

  // Delete achievement
  deleteAchievement: async (id: number): Promise<void> => {
    await api.delete(`/achievements/${id}`);
  },
};

export default api;
