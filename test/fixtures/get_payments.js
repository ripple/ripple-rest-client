'use strict';

exports.rootExpectedKeys = [
  'source_account', 'source_tag', 'source_amount', 'source_slippage',
  'destination_account', 'destination_tag', 'destination_amount',
  'invoice_id', 'paths', 'no_direct_ripple', 'partial_payment', 'direction',
  'result', 'timestamp', 'fee', 'source_balance_changes',
  'destination_balance_changes', 'order_changes'
];

exports.amountExpectedKeys = [
  'value', 'currency', 'issuer'
];
