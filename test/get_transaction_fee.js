'use strict';

var Client = require('../');
var assert = require('assert');

describe('Ripple REST Client Get Transaction Fee', function() {
	var client = new Client({});

	it('should successfully get transaction fee', function(done) {
		client.getTransactionFee(function(error, response) {
			assert(!error);
			assert(response);
			assert(response.success);
			assert(response.fee);
			done();
		});
	});
});
