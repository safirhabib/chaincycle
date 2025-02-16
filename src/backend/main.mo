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

    type Profile = {
        id: Principal;
        greenScore: Nat;
        listings: [Nat];
        bids: [Nat];
        votedProposals: [Nat];
        lastActivity: Int;
    };

    // State
    private stable var nextListingId: Nat = 0;
    private stable var nextBidId: Nat = 0;
    private stable var nextProposalId: Nat = 0;

    private let listings = HashMap.HashMap<Nat, MaterialListing>(0, Nat.equal, Hash.hash);
    private let bids = HashMap.HashMap<Nat, Bid>(0, Nat.equal, Hash.hash);
    private let proposals = HashMap.HashMap<Nat, Proposal>(0, Nat.equal, Hash.hash);

    // Canister references
    private let userProfileCanister = actor("b77ix-eeaaa-aaaaa-qaada-cai") : actor {
        hasVoted: shared query (Principal, Nat) -> async Bool;
        recordVote: shared (Nat) -> async Result.Result<(), Text>;
        hasProfile: shared query (Principal) -> async Bool;
        createProfile: shared () -> async Result.Result<Profile, Text>;
    };

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

    public shared(msg) func createProposal(title: Text, description: Text) : async Result.Result<Proposal, Text> {
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous principals cannot create proposals");
        };

        try {
            let hasProfile = await userProfileCanister.hasProfile(msg.caller);
            if (not hasProfile) {
                let createResult = await userProfileCanister.createProfile();
                switch (createResult) {
                    case (#err(e)) { return #err("Error creating profile: " # e) };
                    case (#ok(_)) {};
                };
            };

            let proposal = {
                id = nextProposalId;
                creator = msg.caller;
                title = title;
                description = description;
                voteEndTime = Time.now() + 7 * 24 * 60 * 60 * 1_000_000_000; // 7 days in nanoseconds
                status = #active;
                yesVotes = 0;
                noVotes = 0;
            };

            proposals.put(nextProposalId, proposal);
            nextProposalId += 1;
            #ok(proposal)
        } catch (e) {
            #err("Error creating proposal: " # Error.message(e))
        }
    };

    public shared(msg) func castVote(proposalId: Nat, voteYes: Bool) : async Result.Result<Proposal, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals cannot vote");
        };

        switch (proposals.get(proposalId)) {
            case null { return #err("Proposal not found") };
            case (?proposal) {
                if (proposal.status != #active) {
                    return #err("Proposal is not active");
                };
                
                if (Time.now() > proposal.voteEndTime) {
                    return #err("Voting period has ended");
                };

                try {
                    let hasProfile = await userProfileCanister.hasProfile(caller);
                    if (not hasProfile) {
                        let createResult = await userProfileCanister.createProfile();
                        switch (createResult) {
                            case (#err(e)) { return #err("Error creating profile: " # e) };
                            case (#ok(_)) {};
                        };
                    };

                    let hasVoted = await userProfileCanister.hasVoted(caller, proposalId);
                    if (hasVoted) {
                        return #err("User has already voted on this proposal");
                    };

                    let recordResult = await userProfileCanister.recordVote(proposalId);
                    switch (recordResult) {
                        case (#err(e)) { return #err(e) };
                        case (#ok()) {
                            let updatedProposal = {
                                id = proposal.id;
                                creator = proposal.creator;
                                title = proposal.title;
                                description = proposal.description;
                                voteEndTime = proposal.voteEndTime;
                                status = proposal.status;
                                yesVotes = if (voteYes) proposal.yesVotes + 1 else proposal.yesVotes;
                                noVotes = if (voteYes) proposal.noVotes else proposal.noVotes + 1;
                            };
                            
                            proposals.put(proposalId, updatedProposal);
                            #ok(updatedProposal)
                        };
                    }
                } catch (e) {
                    #err("Error recording vote: " # Error.message(e))
                }
            };
        }
    };

    public shared(msg) func createBid(listingId: Nat, amount: Nat) : async Result.Result<Bid, Text> {
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous principals cannot create bids");
        };

        switch (listings.get(listingId)) {
            case null #err("Listing not found");
            case (?listing) {
                if (listing.status != #active) {
                    return #err("Listing is not active");
                };

                if (amount <= listing.price) {
                    return #err("Bid amount must be greater than listing price");
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

    public shared query func getAllProposals() : async Result.Result<[Proposal], Text> {
        if (proposals.size() == 0) {
            #err("No proposals found")
        } else {
            #ok(Iter.toArray(proposals.vals()))
        }
    };

    public shared query func getProposal(id: Nat) : async Result.Result<Proposal, Text> {
        switch (proposals.get(id)) {
            case null { #err("Proposal not found") };
            case (?proposal) { #ok(proposal) };
        }
    };

    // Query Methods
    public shared query func getListing(id: Nat) : async Result.Result<MaterialListing, Text> {
        switch (listings.get(id)) {
            case null { #err("Listing not found") };
            case (?listing) { #ok(listing) };
        }
    };

    public shared query func getAllListings() : async Result.Result<[MaterialListing], Text> {
        #ok(Iter.toArray(listings.vals()))
    };
};
