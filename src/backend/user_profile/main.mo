import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

actor UserProfile {
    type UserId = Principal;

    type Profile = {
        id: Principal;
        greenScore: Nat;
        listings: [Nat];
        bids: [Nat];
        votedProposals: [Nat];
        lastActivity: Int;
    };

    type ProfileUpdate = {
        greenScore: ?Nat;
        listings: ?[Nat];
        bids: ?[Nat];
        votedProposals: ?[Nat];
    };

    // State
    private let profiles = HashMap.HashMap<UserId, Profile>(0, Principal.equal, Principal.hash);
    private let votedProposals = HashMap.HashMap<Nat, [Principal]>(0, Nat.equal, Hash.hash);

    // Create or update profile
    public shared(msg) func createProfile() : async Result.Result<Profile, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals cannot create profiles");
        };

        switch (profiles.get(caller)) {
            case (?existing) {
                #ok(existing)
            };
            case null {
                let newProfile = {
                    id = caller;
                    greenScore = 0;
                    listings = [];
                    bids = [];
                    votedProposals = [];
                    lastActivity = Time.now();
                };
                profiles.put(caller, newProfile);
                #ok(newProfile)
            };
        }
    };

    // Update profile
    public shared(msg) func updateProfile(update: ProfileUpdate) : async Result.Result<Profile, Text> {
        let caller = msg.caller;
        
        switch (profiles.get(caller)) {
            case (?existing) {
                let updatedProfile = {
                    id = existing.id;
                    greenScore = switch (update.greenScore) {
                        case (?score) { score };
                        case null { existing.greenScore };
                    };
                    listings = switch (update.listings) {
                        case (?list) { list };
                        case null { existing.listings };
                    };
                    bids = switch (update.bids) {
                        case (?list) { list };
                        case null { existing.bids };
                    };
                    votedProposals = switch (update.votedProposals) {
                        case (?list) { list };
                        case null { existing.votedProposals };
                    };
                    lastActivity = Time.now();
                };
                profiles.put(caller, updatedProfile);
                #ok(updatedProfile)
            };
            case null {
                #err("Profile not found");
            };
        }
    };

    // Check if user has a profile
    public query func hasProfile(userId: Principal) : async Bool {
        switch (profiles.get(userId)) {
            case (?_) { true };
            case null { false };
        }
    };

    // Check if user has voted on a proposal
    public query func hasVoted(userId: Principal, proposalId: Nat) : async Bool {
        switch (profiles.get(userId)) {
            case (?profile) {
                for (votedId in profile.votedProposals.vals()) {
                    if (votedId == proposalId) return true;
                };
                false
            };
            case null { false };
        }
    };

    // Record a vote
    public shared(msg) func recordVote(proposalId: Nat) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (profiles.get(caller)) {
            case (?profile) {
                // Check if user has already voted
                for (votedId in profile.votedProposals.vals()) {
                    if (votedId == proposalId) {
                        return #err("User has already voted on this proposal");
                    };
                };

                // Add proposal to user's voted proposals
                let updatedVotedProposals = Array.append(profile.votedProposals, [proposalId]);
                
                let updatedProfile = {
                    id = profile.id;
                    greenScore = profile.greenScore;
                    listings = profile.listings;
                    bids = profile.bids;
                    votedProposals = updatedVotedProposals;
                    lastActivity = Time.now();
                };

                profiles.put(caller, updatedProfile);
                #ok()
            };
            case null {
                #err("Profile not found");
            };
        }
    };

    // Update green score
    public shared(msg) func updateGreenScore(userId: Principal, points: Nat) : async Result.Result<(), Text> {
        switch (profiles.get(userId)) {
            case (?profile) {
                let updatedProfile = {
                    id = profile.id;
                    greenScore = profile.greenScore + points;
                    listings = profile.listings;
                    bids = profile.bids;
                    votedProposals = profile.votedProposals;
                    lastActivity = Time.now();
                };
                profiles.put(userId, updatedProfile);
                #ok()
            };
            case null {
                #err("Profile not found");
            };
        }
    };

    // Query Methods
    public query func getProfile(userId: Principal) : async ?Profile {
        profiles.get(userId)
    };

    public query func getAllProfiles() : async [Profile] {
        Iter.toArray(profiles.vals())
    };
}
