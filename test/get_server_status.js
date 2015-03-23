'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/get_server_status');

describe('Ripple REST Client Get Server Status', function() {
	var client = new Client({
		account: account_info.source_account
	});

	it('should successfully get server status', function(done) {
		client.getServerStatus(null, function(error, response) {
			assert(!error, 'API call failed');
			assert(response, 'Response is null');
			assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response), 'Root keys are missing');
			assert(common.ensureKeysNotNull(fixture.statusExpectedKeys,
				response.rippled_server_status), 'Status keys are missing');
			assert(common.ensureKeysNotNull(fixture.ledgerExpectedKeys,
				response.rippled_server_status.validated_ledger), 'Ledger keys are missing');
			done();
		});
	});
});
