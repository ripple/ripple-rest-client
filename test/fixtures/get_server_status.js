'use strict';

exports.rootExpectedKeys = [
  'success', 'api_documentation_url', 'rippled_server_url', 'rippled_server_status'
];

exports.statusExpectedKeys = [
  'build_version', 'complete_ledgers', 'hostid', 'io_latency_ms', 'last_close',
  'load_factor', 'peers', 'pubkey_node', 'server_state', 'validated_ledger',
  'validation_quorum'
];

exports.ledgerExpectedKeys = [
  'base_fee_xrp', 'hash', 'reserve_base_xrp', 'reserve_inc_xrp', 'seq'
];
