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
      console.log("Starting auth initialization...");
      try {
        console.log("Creating AuthClient...");
        const client = await AuthClient.create({
          idleOptions: {
            disableIdle: true,
            disableDefaultIdleCallback: true
          }
        });
        console.log("AuthClient created successfully");
        setAuthClient(client);

        console.log("Checking authentication status...");
        const isAuthenticated = await client.isAuthenticated();
        console.log("Authentication status:", isAuthenticated);
        setIsAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const identity = client.getIdentity();
          console.log("Retrieved identity:", identity.getPrincipal().toString());
          setIdentity(identity);
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        const errObj = err as { name?: string; message?: string; stack?: string };
        console.error("Error details:", {
          name: errObj.name,
          message: errObj.message,
          stack: errObj.stack
        });
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    console.log("Starting login process...");
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    const identityProvider = import.meta.env.VITE_DFX_NETWORK === "ic" 
      ? "https://identity.ic0.app"
      : `http://127.0.0.1:4943/?canisterId=${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID}`;

    console.log("Network:", import.meta.env.VITE_DFX_NETWORK);
    console.log("Internet Identity Canister ID:", import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID);
    console.log("Using identity provider:", identityProvider);

    try {
      console.log("Initiating login with Internet Identity...");
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          derivationOrigin: import.meta.env.VITE_DFX_NETWORK !== "ic" 
            ? "http://127.0.0.1:5173" 
            : undefined,
          windowOpenerFeatures: 
            `left=${window.screen.width / 2 - 525 / 2},` +
            `top=${window.screen.height / 2 - 705 / 2},` +
            `toolbar=0,location=0,menubar=0,width=525,height=705`,
          onSuccess: () => {
            console.log("Login callback received: success");
            try {
              const identity = authClient.getIdentity();
              console.log("Login successful, identity:", identity.getPrincipal().toString());
              setIsAuthenticated(true);
              setIdentity(identity);
              resolve();
            } catch (err) {
              console.error("Error getting identity after successful login:", err);
              reject(err);
            }
          },
          onError: (error) => {
            console.error("Login callback received: error");
            console.error("Login error details:", error);
            const errorObj = error as { name?: string; message?: string; stack?: string };
            console.error("Error details:", {
              name: errorObj.name,
              message: errorObj.message,
              stack: errorObj.stack
            });
            reject(error);
          }
        });
      });
    } catch (err) {
      console.error("Error during login:", err);
      const errObj = err as { name?: string; message?: string; stack?: string };
      console.error("Error details:", {
        name: errObj.name,
        message: errObj.message,
        stack: errObj.stack
      });
      throw err;
    }
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
