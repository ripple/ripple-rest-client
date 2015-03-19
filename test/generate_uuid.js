'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();

describe('Ripple REST Client Generate UUID', function() {
	var client = new Client({
		account: account_info.source_account
	});

	it('should successfully get UUID', function(done) {
		client.generateUUID(function (error, response) {
			assert(response, 'Response is null');
			done();
		});
	});
});
