'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/get_balance');

describe('Ripple REST Client Get Balances', function() {
	var client = new Client({
		account: account_info.source_account
	});

	it('should get balances', function(done) {

		client.getAccountBalance(function(error, response) {
			assert(!error);
			assert(response);
			assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response));
			assert(common.ensureKeysNotNull(fixture.amountKeys, response.balances));
			done();
		});
	});

	it('should fail to get balances', function(done) {

		client = new Client({});

		client.getAccountBalance(function(error, response) {
			assert(error);
			assert(!response);
			assert(!error.response.body.success);
			assert.strictEqual(error.response.body.error_type, 'invalid_request');
			assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
			assert.strictEqual(error.response.body.message,
				'Parameter is not a valid Ripple address: account');
			done();
		});
	});
});
