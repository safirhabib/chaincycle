import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Iter "mo:base/Iter";

actor ChainCycle {
    // Types
    type UserId = Principal;
    
    type MaterialListing = {
        id: Nat;
        owner: UserId;
        materialType: Text;
        quantity: Nat;
        location: Text;
        price: Nat;
        ipfsHash: ?Text;
        status: ListingStatus;
        createdAt: Int;
    };

    type ListingStatus = {
        #active;
        #sold;
        #cancelled;
    };

    type Bid = {
        id: Nat;
        listingId: Nat;
        bidder: UserId;
        amount: Nat;
        status: BidStatus;
        timestamp: Int;
    };

    type BidStatus = {
        #active;
        #accepted;
        #rejected;
    };

    type UserProfile = {
        principal: UserId;
        greenScore: Nat;
        tokenBalance: Nat;
        listings: [Nat];
        bids: [Nat];
    };

    type Proposal = {
        id: Nat;
        creator: UserId;
        title: Text;
        description: Text;
        voteEndTime: Int;
        status: ProposalStatus;
        yesVotes: Nat;
        noVotes: Nat;
    };

    type ProposalStatus = {
        #active;
        #passed;
        #rejected;
    };

    // State
    private stable var nextListingId: Nat = 0;
    private stable var nextBidId: Nat = 0;
    private stable var nextProposalId: Nat = 0;

    private let users = HashMap.HashMap<UserId, UserProfile>(0, Principal.equal, Principal.hash);
    private let listings = HashMap.HashMap<Nat, MaterialListing>(0, Nat.equal, Hash.hash);
    private let bids = HashMap.HashMap<Nat, Bid>(0, Nat.equal, Hash.hash);
    private let proposals = HashMap.HashMap<Nat, Proposal>(0, Nat.equal, Hash.hash);

    // User Management
    public shared(msg) func createProfile() : async Result.Result<UserProfile, Text> {
        let caller = msg.caller;
        
        switch (users.get(caller)) {
            case (?existing) {
                #err("Profile already exists")
            };
            case null {
                let newProfile = {
                    principal = caller;
                    greenScore = 0;
                    tokenBalance = 1000; // Initial tokens
                    listings = [];
                    bids = [];
                };
                users.put(caller, newProfile);
                #ok(newProfile)
            };
        }
    };

    // Listing Management
    public shared(msg) func createListing(
        materialType: Text,
        quantity: Nat,
        location: Text,
        price: Nat,
        ipfsHash: ?Text
    ) : async Result.Result<MaterialListing, Text> {
        let caller = msg.caller;
        
        let listing = {
            id = nextListingId;
            owner = caller;
            materialType = materialType;
            quantity = quantity;
            location = location;
            price = price;
            ipfsHash = ipfsHash;
            status = #active;
            createdAt = Time.now();
        };
        
        listings.put(nextListingId, listing);
        nextListingId += 1;
        #ok(listing)
    };

    // Bidding System
    public shared(msg) func placeBid(listingId: Nat, amount: Nat) : async Result.Result<Bid, Text> {
        let caller = msg.caller;
        
        switch (listings.get(listingId)) {
            case null #err("Listing not found");
            case (?listing) {
                if (listing.status != #active) {
                    return #err("Listing is not active");
                };
                
                let bid = {
                    id = nextBidId;
                    listingId = listingId;
                    bidder = caller;
                    amount = amount;
                    status = #active;
                    timestamp = Time.now();
                };
                
                bids.put(nextBidId, bid);
                nextBidId += 1;
                #ok(bid)
            };
        }
    };

    // Query Methods
    public query func getListing(id: Nat) : async ?MaterialListing {
        listings.get(id)
    };

    public query func getAllListings() : async [MaterialListing] {
        Iter.toArray(listings.vals())
    };

    public query func getUserProfile(userId: UserId) : async ?UserProfile {
        users.get(userId)
    };

    // More methods to be implemented:
    // - acceptBid
    // - completeTransaction
    // - createProposal
    // - castVote
    // - updateGreenScore
};
