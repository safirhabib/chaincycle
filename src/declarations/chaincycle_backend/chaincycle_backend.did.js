export const idlFactory = ({ IDL }) => {
  const ListingStatus = IDL.Variant({
    'active' : IDL.Null,
    'cancelled' : IDL.Null,
    'sold' : IDL.Null,
  });
  const UserId = IDL.Principal;
  const MaterialListing = IDL.Record({
    'id' : IDL.Nat,
    'status' : ListingStatus,
    'owner' : UserId,
    'createdAt' : IDL.Int,
    'quantity' : IDL.Nat,
    'price' : IDL.Nat,
    'ipfsHash' : IDL.Opt(IDL.Text),
    'materialType' : IDL.Text,
    'location' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : MaterialListing, 'err' : IDL.Text });
  const UserProfile = IDL.Record({
    'principal' : UserId,
    'listings' : IDL.Vec(IDL.Nat),
    'bids' : IDL.Vec(IDL.Nat),
    'greenScore' : IDL.Nat,
    'tokenBalance' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : UserProfile, 'err' : IDL.Text });
  const BidStatus = IDL.Variant({
    'active' : IDL.Null,
    'rejected' : IDL.Null,
    'accepted' : IDL.Null,
  });
  const Bid = IDL.Record({
    'id' : IDL.Nat,
    'status' : BidStatus,
    'listingId' : IDL.Nat,
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
    'bidder' : UserId,
  });
  const Result = IDL.Variant({ 'ok' : Bid, 'err' : IDL.Text });
  return IDL.Service({
    'createListing' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'createProfile' : IDL.Func([], [Result_1], []),
    'getAllListings' : IDL.Func([], [IDL.Vec(MaterialListing)], ['query']),
    'getListing' : IDL.Func([IDL.Nat], [IDL.Opt(MaterialListing)], ['query']),
    'getUserProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    'placeBid' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
