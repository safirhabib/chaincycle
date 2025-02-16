export const idlFactory = ({ IDL }) => {
  const ProposalStatus = IDL.Variant({
    'active' : IDL.Null,
    'rejected' : IDL.Null,
    'passed' : IDL.Null,
  });
  const UserId = IDL.Principal;
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'status' : ProposalStatus,
    'noVotes' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : UserId,
    'yesVotes' : IDL.Nat,
    'description' : IDL.Text,
    'voteEndTime' : IDL.Int,
  });
  const Result = IDL.Variant({ 'ok' : Proposal, 'err' : IDL.Text });
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
  const Result_2 = IDL.Variant({ 'ok' : Bid, 'err' : IDL.Text });
  const ListingStatus = IDL.Variant({
    'active' : IDL.Null,
    'cancelled' : IDL.Null,
    'sold' : IDL.Null,
  });
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
  const Result_1 = IDL.Variant({ 'ok' : MaterialListing, 'err' : IDL.Text });
  return IDL.Service({
    'castVote' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
    'createBid' : IDL.Func([IDL.Nat, IDL.Nat], [Result_2], []),
    'createListing' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'createProposal' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getAllListings' : IDL.Func([], [IDL.Vec(MaterialListing)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getListing' : IDL.Func([IDL.Nat], [IDL.Opt(MaterialListing)], ['query']),
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
