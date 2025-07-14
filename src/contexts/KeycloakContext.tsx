import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloak, { initKeycloak, login, logout, getUsername, getUserInfo } from '../services/keycloak';

interface KeycloakContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  userInfo: any;
  login: () => void;
  logout: () => void;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

interface KeycloakProviderProps {
  children: ReactNode;
}

let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const initializeKeycloak = async () => {
      // Prevent multiple initializations
      if (isInitialized) {
        setIsLoading(false);
        setIsAuthenticated(keycloak.authenticated || false);
        if (keycloak.authenticated) {
          setUsername(getUsername());
          setUserInfo(getUserInfo());
        }
        return;
      }

      // If initialization is already in progress, wait for it
      if (initializationPromise) {
        try {
          const authenticated = await initializationPromise;
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
        return;
      }

      // Start initialization
      initializationPromise = initKeycloak();
      
      try {
        const authenticated = await initializationPromise;
        isInitialized = true;
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

  const value: KeycloakContextType = {
    isAuthenticated,
    isLoading,
    username,
    userInfo,
    login,
    logout,
  };

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};
