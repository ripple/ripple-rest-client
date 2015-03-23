'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/get_payments');

describe('Ripple REST Client Get Payments', function() {
  var client;
  var payments;

  before(function (done) {
    client = new Client({
      account: account_info.source_account
    });

    client.getPayments(null, function(error, payment_array) {
      payments = payment_array;
      done();
    });
  });

  // Given the hash for the second last payment, the response should contain the
  // hashes of last payment and third last payment.
  it('should get notifications', function(done) {
    client.getPayment(payments[0].hash, function(error, response) {
      assert(payments, 'Payments is null');
      assert(response, 'Response is null');
      assert.deepEqual(payments[0].payment, response, 'The payment object should be the same');
      assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response, 'Required keys are not found'));
      assert(common.ensureKeysNotNull(fixture.amountExpectedKeys, response.source_amount, 'Required keys missing'));
      assert(common.ensureKeysNotNull(fixture.amountExpectedKeys, response.destination_amount, 'Required keys missing'));
      done();
    });
  });

  it('should fail due to invalid transaction', function(done) {
    client.getPayment('FakeHash', function(error, response) {
      assert(error);
      assert(!response);
      assert(!error.response.success);
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert.strictEqual(error.response.body.message,
        'Transaction not found. A transaction hash was not supplied and there were no entries matching the client_resource_id.');
      done();
    });
  });
});
