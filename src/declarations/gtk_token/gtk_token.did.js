export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const TransactionType = IDL.Variant({
    'burn' : IDL.Null,
    'mint' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : IDL.Int,
    'txType' : TransactionType,
    'amount' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'buyTokens' : IDL.Func([], [Result_1], []),
    'getTotalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'getTransaction' : IDL.Func([IDL.Nat], [IDL.Opt(Transaction)], ['query']),
    'initialize' : IDL.Func([], [Result], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
