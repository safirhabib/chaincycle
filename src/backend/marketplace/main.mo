import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";

actor Marketplace {
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

    // State
    private stable var nextListingId: Nat = 0;
    private stable var nextBidId: Nat = 0;

    private let listings = HashMap.HashMap<Nat, MaterialListing>(0, Nat.equal, Hash.hash);
    private let bids = HashMap.HashMap<Nat, Bid>(0, Nat.equal, Hash.hash);

    // Canister references
    private let gtkToken = actor "br5f7-7uaaa-aaaaa-qaaca-cai" : actor {
        transfer: shared (Principal, Nat) -> async Result.Result<(), Text>;
        balanceOf: shared query (Principal) -> async Nat;
    };

    // Listing Management
    public shared(msg) func createListing(
        materialType: Text,
        quantity: Nat,
        location: Text,
        price: Nat,
        ipfsHash: ?Text
    ) : async Result.Result<MaterialListing, Text> {
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous principals cannot create listings");
        };

        let listing = {
            id = nextListingId;
            owner = msg.caller;
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
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous principals cannot place bids");
        };

        switch (listings.get(listingId)) {
            case null #err("Listing not found");
            case (?listing) {
                if (listing.status != #active) {
                    return #err("Listing is not active");
                };

                // Check if bidder has enough GTK tokens
                let balance = await gtkToken.balanceOf(msg.caller);
                if (balance < amount) {
                    return #err("Insufficient GTK balance");
                };
                
                let bid = {
                    id = nextBidId;
                    listingId = listingId;
                    bidder = msg.caller;
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

    public shared(msg) func acceptBid(listingId: Nat, bidId: Nat) : async Result.Result<(), Text> {
        switch (listings.get(listingId), bids.get(bidId)) {
            case (?listing, ?bid) {
                if (listing.owner != msg.caller) {
                    return #err("Only the listing owner can accept bids");
                };

                if (listing.status != #active) {
                    return #err("Listing is not active");
                };

                if (bid.status != #active) {
                    return #err("Bid is not active");
                };

                if (bid.listingId != listingId) {
                    return #err("Bid is for a different listing");
                };

                // Transfer GTK tokens from bidder to seller
                let transferResult = await gtkToken.transfer(listing.owner, bid.amount);
                switch (transferResult) {
                    case (#err(e)) { return #err(e) };
                    case (#ok()) {
                        // Update listing status
                        let updatedListing = {
                            id = listing.id;
                            owner = listing.owner;
                            materialType = listing.materialType;
                            quantity = listing.quantity;
                            location = listing.location;
                            price = listing.price;
                            ipfsHash = listing.ipfsHash;
                            status = #sold;
                            createdAt = listing.createdAt;
                        };
                        listings.put(listingId, updatedListing);

                        // Update bid status
                        let updatedBid = {
                            id = bid.id;
                            listingId = bid.listingId;
                            bidder = bid.bidder;
                            amount = bid.amount;
                            status = #accepted;
                            timestamp = bid.timestamp;
                        };
                        bids.put(bidId, updatedBid);

                        #ok()
                    };
                }
            };
            case (null, _) { #err("Listing not found") };
            case (_, null) { #err("Bid not found") };
        }
    };

    // Query Methods
    public query func getListing(id: Nat) : async ?MaterialListing {
        listings.get(id)
    };

    public query func getAllListings() : async [MaterialListing] {
        Iter.toArray(listings.vals())
    };

    public query func getBid(id: Nat) : async ?Bid {
        bids.get(id)
    };

    public query func getListingBids(listingId: Nat) : async [Bid] {
        var listingBids = Buffer.Buffer<Bid>(0);
        for ((_, bid) in bids.entries()) {
            if (bid.listingId == listingId) {
                listingBids.add(bid);
            };
        };
        Buffer.toArray(listingBids)
    };
};
