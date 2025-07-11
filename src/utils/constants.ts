export const APP_NAME = 'Dictators Club';
export const APP_DESCRIPTION = 'A platform for managing dictator profiles and achievements';

export const ROUTES = {
  HOME: '/',
  DICTATORS: '/dictators',
  DICTATOR_DETAIL: '/dictators/:id',
  PROFILE: '/profile',
  CREATE_PROFILE: '/create',
} as const;

export const API_ENDPOINTS = {
  DICTATORS: '/dictators',
  ACHIEVEMENTS: '/achievements',
  INIT_SAMPLE_DATA: '/init/sample-data',
} as const;

export const KEYCLOAK_CONFIG = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
} as const;

export const MESSAGES = {
  LOADING: 'Loading...',
  ERROR: 'Something went wrong',
  NO_DATA: 'No data available',
  UNAUTHORIZED: 'You need to be authenticated to access this page',
  FORBIDDEN: 'You do not have permission to access this resource',
} as const;
