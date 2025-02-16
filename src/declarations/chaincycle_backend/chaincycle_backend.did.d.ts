import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Bid {
  'id' : bigint,
  'status' : BidStatus,
  'listingId' : bigint,
  'timestamp' : bigint,
  'amount' : bigint,
  'bidder' : UserId,
}
export type BidStatus = { 'active' : null } |
  { 'rejected' : null } |
  { 'accepted' : null };
export type ListingStatus = { 'active' : null } |
  { 'cancelled' : null } |
  { 'sold' : null };
export interface MaterialListing {
  'id' : bigint,
  'status' : ListingStatus,
  'owner' : UserId,
  'createdAt' : bigint,
  'quantity' : bigint,
  'price' : bigint,
  'ipfsHash' : [] | [string],
  'materialType' : string,
  'location' : string,
}
export interface Proposal {
  'id' : bigint,
  'status' : ProposalStatus,
  'noVotes' : bigint,
  'title' : string,
  'creator' : UserId,
  'yesVotes' : bigint,
  'description' : string,
  'voteEndTime' : bigint,
}
export type ProposalStatus = { 'active' : null } |
  { 'rejected' : null } |
  { 'passed' : null };
export type Result = { 'ok' : Proposal } |
  { 'err' : string };
export type Result_1 = { 'ok' : MaterialListing } |
  { 'err' : string };
export type Result_2 = { 'ok' : Bid } |
  { 'err' : string };
export type UserId = Principal;
export interface _SERVICE {
  'castVote' : ActorMethod<[bigint, boolean], Result>,
  'createBid' : ActorMethod<[bigint, bigint], Result_2>,
  'createListing' : ActorMethod<
    [string, bigint, string, bigint, [] | [string]],
    Result_1
  >,
  'createProposal' : ActorMethod<[string, string], Result>,
  'getAllListings' : ActorMethod<[], Array<MaterialListing>>,
  'getAllProposals' : ActorMethod<[], Array<Proposal>>,
  'getListing' : ActorMethod<[bigint], [] | [MaterialListing]>,
  'getProposal' : ActorMethod<[bigint], [] | [Proposal]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
