import { useEffect, useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useAuth } from '../contexts/AuthContext';
import { idlFactory } from '../../../declarations/chaincycle_backend/chaincycle_backend.did.js';
import type { _SERVICE } from '../../../declarations/chaincycle_backend/chaincycle_backend.did';

export const useBackendActor = () => {
  const { isAuthenticated, identity } = useAuth();
  const [actor, setActor] = useState<_SERVICE | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initActor = async () => {
      try {
        if (!identity) {
          console.log("No identity available");
          setActor(null);
          return;
        }

        console.log("Initializing actor with identity:", identity.getPrincipal().toString());

        const host = process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://127.0.0.1:4943";
        console.log("Using host:", host);

        const agent = new HttpAgent({
          identity,
          host,
        });

        if (process.env.DFX_NETWORK !== "ic") {
          console.log("Fetching root key for local development");
          await agent.fetchRootKey();
        }

        const canisterId = process.env.CHAINCYCLE_BACKEND_CANISTER_ID;
        if (!canisterId) {
          throw new Error("Backend canister ID not found in environment variables");
        }

        console.log("Using backend canister ID:", canisterId);

        const newActor = Actor.createActor<_SERVICE>(idlFactory, {
          agent,
          canisterId,
        });

        console.log("Actor created successfully");
        setActor(newActor);
        setError(null);
      } catch (err) {
        console.error("Error initializing actor:", err);
        setActor(null);
        setError(err instanceof Error ? err.message : "Failed to initialize actor");
      }
    };

    if (identity) {
      initActor();
    }
  }, [identity, isAuthenticated]);

  return { actor, error };
};
