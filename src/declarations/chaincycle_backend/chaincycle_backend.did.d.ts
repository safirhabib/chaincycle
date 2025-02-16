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
export type Result = { 'ok' : Bid } |
  { 'err' : string };
export type Result_1 = { 'ok' : UserProfile } |
  { 'err' : string };
export type Result_2 = { 'ok' : MaterialListing } |
  { 'err' : string };
export type UserId = Principal;
export interface UserProfile {
  'principal' : UserId,
  'listings' : Array<bigint>,
  'bids' : Array<bigint>,
  'greenScore' : bigint,
  'tokenBalance' : bigint,
}
export interface _SERVICE {
  'createListing' : ActorMethod<
    [string, bigint, string, bigint, [] | [string]],
    Result_2
  >,
  'createProfile' : ActorMethod<[], Result_1>,
  'getAllListings' : ActorMethod<[], Array<MaterialListing>>,
  'getListing' : ActorMethod<[bigint], [] | [MaterialListing]>,
  'getUserProfile' : ActorMethod<[UserId], [] | [UserProfile]>,
  'placeBid' : ActorMethod<[bigint, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
