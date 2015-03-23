'use strict';


exports.transactionKeys = [
  'TransactionType', 'Flags', 'Sequence', 'DestinationTag',
  'LastLedgerSequence', 'Amount', 'Fee',
  'SigningPubKey', 'TxnSignature', 'Account', 'Destination', 'date',
  'hash', 'inLedger', 'ledger_index', 'meta',
  'validated'
];

exports.amountKeys = [
  'value', 'currency', 'issuer'
];

exports.metaKeys = [
  'TransactionIndex', 'AffectedNodes', 'TransactionResult', 'delivered_amount'
];

exports.ModifiedNodeKeys = [
  'LedgerEntryType', 'PreviousTxnLgrSeq', 'PreviousTxnID',
  'LedgerIndex', 'PreviousFields', 'FinalFields'
];
