import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const isAuthenticated = await client.isAuthenticated();
        setIsAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const identity = client.getIdentity();
          console.log("Retrieved identity:", identity.getPrincipal().toString());
          setIdentity(identity);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: process.env.DFX_NETWORK === "ic" 
            ? "https://identity.ic0.app"
            : `http://127.0.0.1:4943?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
          onSuccess: () => {
            const identity = authClient.getIdentity();
            console.log("Login successful, identity:", identity.getPrincipal().toString());
            setIsAuthenticated(true);
            setIdentity(identity);
            resolve();
          },
          onError: (error) => {
            console.error("Login failed:", error);
            reject(error);
          },
        });
      });
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
