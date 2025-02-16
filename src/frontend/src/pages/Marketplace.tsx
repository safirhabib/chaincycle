import React, { useState, useEffect } from 'react';
import { useBackendActor } from '../hooks/useBackendActor';
import { useAuth } from '../contexts/AuthContext';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/chaincycle_backend/chaincycle_backend.did.js';
import type { _SERVICE } from '../../../declarations/chaincycle_backend/chaincycle_backend.did';

interface MaterialListing {
  id: bigint;
  owner: Principal;
  materialType: string;
  quantity: bigint;
  location: string;
  price: bigint;
  ipfsHash: string | null;
  status: { active: null } | { sold: null } | { cancelled: null };
  createdAt: bigint;
}

interface Bid {
  id: bigint;
  listingId: bigint;
  bidder: Principal;
  amount: bigint;
  status: { active: null } | { accepted: null } | { rejected: null };
  timestamp: bigint;
}

const Marketplace = () => {
  const { isAuthenticated, identity } = useAuth();
  const { actor: backendActor, error: actorError } = useBackendActor();
  const [listings, setListings] = useState<MaterialListing[]>([]);
  const [newListing, setNewListing] = useState({
    materialType: '',
    quantity: '',
    location: '',
    price: '',
    ipfsHash: ''
  });
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (backendActor && isAuthenticated) {
      fetchListings();
    }
  }, [backendActor, isAuthenticated]);

  useEffect(() => {
    if (actorError) {
      setError(actorError);
    }
  }, [actorError]);

  const ensureBackendActor = async () => {
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const host = process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://127.0.0.1:4943";
    const agent = new HttpAgent({
      identity,
      host,
    });

    if (process.env.DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }

    const canisterId = process.env.CHAINCYCLE_BACKEND_CANISTER_ID;
    if (!canisterId) {
      throw new Error("Backend canister ID not found");
    }

    return Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });
  };

  const fetchListings = async () => {
    if (!identity) {
      setError("Please login first");
      return;
    }
    
    try {
      const actor = await ensureBackendActor();
      console.log("Fetching listings...");
      const result = await actor.getAllListings();
      console.log("Received listings:", result);
      
      if (Array.isArray(result)) {
        setListings(result);
        setError(null);
      } else {
        setError('Error fetching listings: Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error instanceof Error ? error.message : "Failed to fetch listings");
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const actor = await ensureBackendActor();
      const result = await actor.createListing(
        newListing.materialType,
        BigInt(newListing.quantity),
        newListing.location,
        BigInt(newListing.price),
        newListing.ipfsHash ? [newListing.ipfsHash] : []
      );

      if ('ok' in result) {
        setNewListing({
          materialType: '',
          quantity: '',
          location: '',
          price: '',
          ipfsHash: ''
        });
        await fetchListings();
      } else {
        setError('Error creating listing: ' + result.err);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error instanceof Error ? error.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (listingId: bigint) => {
    if (!identity) {
      setError("Please login first");
      return;
    }

    setBidLoading(prev => ({ ...prev, [listingId.toString()]: true }));
    setError(null);

    try {
      const actor = await ensureBackendActor();
      const result = await actor.placeBid(listingId, BigInt(bidAmount));

      if ('ok' in result) {
        setBidAmount('');
        await fetchListings();
      } else {
        setError('Error placing bid: ' + result.err);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error instanceof Error ? error.message : "Failed to place bid");
    } finally {
      setBidLoading(prev => ({ ...prev, [listingId.toString()]: false }));
    }
  };

  if (!isAuthenticated) {
    return <div className="container mx-auto p-4">Please login to access the marketplace</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Material Type
            </label>
            <input
              type="text"
              value={newListing.materialType}
              onChange={(e) => setNewListing(prev => ({ ...prev, materialType: e.target.value }))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={newListing.quantity}
              onChange={(e) => setNewListing(prev => ({ ...prev, quantity: e.target.value }))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              value={newListing.location}
              onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              value={newListing.price}
              onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              IPFS Hash (optional)
            </label>
            <input
              type="text"
              value={newListing.ipfsHash}
              onChange={(e) => setNewListing(prev => ({ ...prev, ipfsHash: e.target.value }))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Active Listings</h2>
      <div className="grid gap-6">
        {listings.map((listing) => (
          <div key={listing.id.toString()} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{listing.materialType}</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Owner:</span> {listing.owner.toString()}</p>
              <p><span className="font-semibold">Quantity:</span> {listing.quantity.toString()}</p>
              <p><span className="font-semibold">Location:</span> {listing.location}</p>
              <p><span className="font-semibold">Price:</span> {listing.price.toString()}</p>
              <p><span className="font-semibold">Status:</span> {Object.keys(listing.status)[0]}</p>
              {'active' in listing.status && (
                <div className="mt-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  />
                  <button
                    onClick={() => handlePlaceBid(listing.id)}
                    disabled={bidLoading[listing.id.toString()]}
                    className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                      bidLoading[listing.id.toString()] ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {bidLoading[listing.id.toString()] ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
