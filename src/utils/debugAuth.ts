import keycloak from '../services/keycloak';

export const debugAuthState = () => {
  console.log('=== AUTH DEBUG ===');
  console.log('Keycloak authenticated:', keycloak.authenticated);
  console.log('Keycloak token exists:', !!keycloak.token);
  console.log('Token length:', keycloak.token?.length || 0);
  console.log('Token expired:', keycloak.isTokenExpired());
  console.log('Token parsed:', keycloak.tokenParsed);
  console.log('==================');
};

// Add to window for easy debugging
(window as any).debugAuth = debugAuthState;
