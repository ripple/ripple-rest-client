'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/get_notification');

describe('Ripple REST Client Get Notifications', function() {
  var client = new Client({
    account: account_info.source_account
  });
  var payments;

  before(function (done) {
    client.getPayments(null, function(error, payment_array) {
      payments = payment_array;
      done();
    });
  });

  it('should get NO notification', function(done) {
    client.getNotification(null, function(error, response) {
      assert(!response, 'Response should be null');
      assert(error);
      assert(error.response);
      assert(error.response.body, 'Error should not be null');

      assert(!error.response.body.success);
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert.strictEqual(error.response.body.message,
        'Transaction not found. A transaction hash was not supplied and there were no entries matching the client_resource_id.');
      done();
    });
  });

  // Given the hash for the second last payment, the response should contain the
  // hashes of last payment and third last payment.
  it('should fail to get notifications', function(done) {
    client.getNotification(payments[1].hash, function(error, response) {
      assert(!error);
      assert(response);
      assert(common.ensureKeysNotNull(fixture.rootKeys, response));
      done();
    });
  });
});
