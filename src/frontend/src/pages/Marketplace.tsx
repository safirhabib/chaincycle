import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Temporary type definition until we generate the actual declarations
interface MaterialListing {
  id: bigint;
  owner: Principal;
  materialType: string;
  quantity: bigint;
  location: string;
  price: bigint;
  ipfsHash: [] | [string];
  status: { active: null } | { sold: null } | { cancelled: null };
  createdAt: bigint;
}

interface NewListing {
  materialType: string;
  quantity: number;
  location: string;
  price: number;
}

const Marketplace = () => {
  const [listings, setListings] = useState<MaterialListing[]>([]);
  const [actor, setActor] = useState<any>(null);
  const [newListing, setNewListing] = useState<NewListing>({
    materialType: '',
    quantity: 0,
    location: '',
    price: 0,
  });

  useEffect(() => {
    const initActor = async () => {
      try {
        // Initialize agent
        const agent = new HttpAgent({
          host: 'http://127.0.0.1:4943',
        });

        // Only fetch root key in development
        if (process.env.NODE_ENV !== "production") {
          try {
            await agent.fetchRootKey();
          } catch (err) {
            console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
          }
        }

        const canisterId = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
        
        // Create actor interface
        const actor = Actor.createActor(
          ({ IDL }) => {
            const MaterialListing = IDL.Record({
              'id': IDL.Nat,
              'owner': IDL.Principal,
              'materialType': IDL.Text,
              'quantity': IDL.Nat,
              'location': IDL.Text,
              'price': IDL.Nat,
              'ipfsHash': IDL.Opt(IDL.Text),
              'status': IDL.Variant({
                'active': IDL.Null,
                'sold': IDL.Null,
                'cancelled': IDL.Null
              }),
              'createdAt': IDL.Int
            });

            return IDL.Service({
              'createListing': IDL.Func(
                [IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
                [IDL.Variant({ 'ok': MaterialListing, 'err': IDL.Text })],
                []
              ),
              'getAllListings': IDL.Func([], [IDL.Vec(MaterialListing)], ['query'])
            });
          },
          {
            agent,
            canisterId,
          }
        );

        setActor(actor);
        
        // Fetch existing listings
        try {
          console.log('Fetching initial listings...');
          const result = await actor.getAllListings();
          console.log('Initial listings:', result);
          setListings(result as MaterialListing[]);
        } catch (error) {
          console.error('Error fetching initial listings:', error);
        }
      } catch (error) {
        console.error('Error initializing actor:', error);
      }
    };

    initActor();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actor) {
      console.error('Actor not initialized');
      alert('System not ready. Please try again in a moment.');
      return;
    }

    // Validate input
    if (!newListing.materialType || !newListing.quantity || !newListing.location || !newListing.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      console.log('Creating listing with data:', {
        materialType: newListing.materialType,
        quantity: newListing.quantity,
        location: newListing.location,
        price: newListing.price
      });

      const result = await actor.createListing(
        newListing.materialType,
        BigInt(newListing.quantity),
        newListing.location,
        BigInt(newListing.price),
        [] // Optional IPFS hash
      );

      console.log('Raw response from canister:', result);

      // Type check the response
      if (typeof result === 'object' && result !== null) {
        if ('ok' in result) {
          console.log('Listing created successfully:', result.ok);
          
          // Reset form
          setNewListing({
            materialType: '',
            quantity: 0,
            location: '',
            price: 0,
          });

          // Refresh listings
          try {
            const updatedListings = await actor.getAllListings();
            console.log('Updated listings:', updatedListings);
            setListings(updatedListings as MaterialListing[]);
            alert('Listing created successfully!');
          } catch (refreshError) {
            console.error('Error refreshing listings:', refreshError);
          }
        } else if ('err' in result) {
          console.error('Error from canister:', result.err);
          alert(`Error creating listing: ${result.err}`);
        } else {
          console.error('Unexpected response format:', result);
          alert('Received an unexpected response format from the system');
        }
      } else {
        console.error('Invalid response type:', result);
        alert('Received an invalid response from the system');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error instanceof Error) {
        alert(`Error creating listing: ${error.message}`);
      } else {
        alert('An unexpected error occurred while creating the listing');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Material Marketplace</h1>
      
      {/* Create Listing Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Material Type
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={newListing.materialType}
                onChange={(e) => setNewListing({...newListing, materialType: e.target.value})}
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={newListing.quantity}
                onChange={(e) => setNewListing({...newListing, quantity: parseInt(e.target.value)})}
                required
                min="1"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={newListing.location}
                onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (CYC)
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={newListing.price}
                onChange={(e) => setNewListing({...newListing, price: parseInt(e.target.value)})}
                required
                min="0"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Create Listing
          </button>
        </form>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id.toString()} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{listing.materialType}</h3>
            <p className="text-gray-600">Quantity: {listing.quantity.toString()}</p>
            <p className="text-gray-600">Location: {listing.location}</p>
            <p className="text-green-600 font-semibold">Price: {listing.price.toString()} CYC</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => {/* TODO: Implement bid logic */}}
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
