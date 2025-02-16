import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Transaction {
  'id' : bigint,
  'to' : [] | [Principal],
  'from' : [] | [Principal],
  'timestamp' : bigint,
  'txType' : TransactionType,
  'amount' : bigint,
}
export type TransactionType = { 'burn' : null } |
  { 'mint' : null } |
  { 'transfer' : null };
export interface _SERVICE {
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'buyTokens' : ActorMethod<[], Result_1>,
  'getTotalSupply' : ActorMethod<[], bigint>,
  'getTransaction' : ActorMethod<[bigint], [] | [Transaction]>,
  'initialize' : ActorMethod<[], Result>,
  'transfer' : ActorMethod<[Principal, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
