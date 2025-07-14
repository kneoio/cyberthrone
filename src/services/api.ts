import axios from 'axios';
import keycloak from './keycloak';
import { Dictator, CreateDictatorRequest } from '../types/dictator';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    if (keycloak.authenticated) {
      await keycloak.updateToken(30); 
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
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && keycloak.authenticated) {
      try {
        await keycloak.updateToken(5);
        error.config.headers.Authorization = `Bearer ${keycloak.token}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export const publicApi = {
  getDictators: async (): Promise<Dictator[]> => {
    const response = await api.get<Dictator[]>('/dictators');
    return response.data;
  },
  getDictatorById: async (id: number): Promise<Dictator> => {
    const response = await api.get<Dictator>(`/dictators/${id}`);
    return response.data;
  },
};

export const protectedApi = {
  createOrUpdateDictator: async (dictator: CreateDictatorRequest & { id?: number }): Promise<Dictator> => {
    if (dictator.id) {
      const response = await api.post<Dictator>(`/dictators/${dictator.id}`, dictator);
      return response.data;
    } else {
      const response = await api.post<Dictator>('/dictators', dictator);
      return response.data;
    }
  },

  deleteDictator: async (id: number): Promise<void> => {
    await api.delete(`/dictators/${id}`);
  },
};

export default api;
