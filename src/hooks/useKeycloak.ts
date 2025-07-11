import { useState, useEffect } from 'react';
import keycloak, { initKeycloak, login, logout, getUsername, getUserInfo } from '../services/keycloak';

export const useKeycloak = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        const authenticated = await initKeycloak();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          setUsername(getUsername());
          setUserInfo(getUserInfo());
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeKeycloak();

    // Listen for authentication state changes
    const handleAuthStateChange = () => {
      setIsAuthenticated(keycloak.authenticated || false);
      if (keycloak.authenticated) {
        setUsername(getUsername());
        setUserInfo(getUserInfo());
      } else {
        setUsername(null);
        setUserInfo(null);
      }
    };

    // Set up token refresh
    const tokenRefreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(30).catch(() => {
          console.log('Token refresh failed');
        });
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    username,
    userInfo,
    login,
    logout,
  };
};
