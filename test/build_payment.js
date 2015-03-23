'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common.js');
var fixture = require('./fixtures/build_payment');

describe('Ripple REST Client buildPayment', function() {
  var client = new Client({
      account: account_info.source_account,
      secret: account_info.secret,
      from_issuer: account_info.source_account,
      to_issuer: account_info.destination_account
    });

  it('should successfully build payment', function(done) {

    var newPayment = {
      currency: 'GWD',
      amount: 10,
      recipient: account_info.destination_account,
      source_currencies: ['GWD', 'USD']
    };

    client.buildPayment(newPayment, function(error, response) {
      assert(!error, 'API call failed');
      assert(response, 'Response is null');
      assert(response.payments);
      assert(common.ensureKeysNotNull(fixture.paymentKeys, response.payments));
      done();
    });
  });

  it('should fail due to an empty payment object', function(done) {
    var newPayment = {};

    client.buildPayment(newPayment, function(error, response) {
      assert(!response);
      assert(error);
      assert(error.response);
      assert(error.response.body);
      assert(!error.response.body.success, 'Request is not successful');
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert.strictEqual(error.response.body.message,
        'Parameter is not a valid Ripple address: destination_account');
      done();
    });
  });
});
