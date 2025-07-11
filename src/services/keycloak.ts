import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    });
    
    if (authenticated) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
    
    return authenticated;
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error);
    throw error;
  }
};

export const login = () => {
  keycloak.login();
};

export const logout = () => {
  keycloak.logout();
};

export const getToken = () => {
  return keycloak.token;
};

export const isAuthenticated = () => {
  return keycloak.authenticated;
};

export const getUsername = () => {
  return keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.sub;
};

export const getUserInfo = () => {
  return keycloak.tokenParsed;
};

export default keycloak;
