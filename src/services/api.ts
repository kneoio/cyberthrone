import axios from 'axios';
import keycloak from './keycloak';
import { Dictator, Achievement, CreateDictatorRequest, CreateAchievementRequest } from '../types/dictator';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  if (keycloak.authenticated && keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      keycloak.updateToken(5).then(() => {
        // Retry the request
        return api.request(error.config);
      }).catch(() => {
        // Refresh failed, redirect to login
        keycloak.login();
      });
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

  // Get dictator by username
  getDictatorByUsername: async (username: string): Promise<Dictator> => {
    const response = await api.get<Dictator>(`/dictators/username/${username}`);
    return response.data;
  },

  // Get all achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>('/achievements');
    return response.data;
  },

  // Initialize sample data (development only)
  initSampleData: async (): Promise<void> => {
    await api.post('/init/sample-data');
  },
};

// Protected API endpoints (require authentication)
export const protectedApi = {
  // Create new dictator profile
  createDictator: async (dictator: CreateDictatorRequest): Promise<Dictator> => {
    const response = await api.post<Dictator>('/dictators', dictator);
    return response.data;
  },

  // Update dictator profile
  updateDictator: async (id: number, dictator: Partial<CreateDictatorRequest>): Promise<Dictator> => {
    const response = await api.put<Dictator>(`/dictators/${id}`, dictator);
    return response.data;
  },

  // Delete dictator profile
  deleteDictator: async (id: number): Promise<void> => {
    await api.delete(`/dictators/${id}`);
  },

  // Create new achievement
  createAchievement: async (achievement: CreateAchievementRequest): Promise<Achievement> => {
    const response = await api.post<Achievement>('/achievements', achievement);
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
