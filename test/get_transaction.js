'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/get_transaction');

describe('Ripple REST Client Get Transaction', function() {
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
    this.timeout(5000);
    client.getTransaction(payments[0].hash, function(error, response) {
      assert(!error, 'Error happened');
      assert(response, 'Response is null');
      assert(response.success);
      assert(response.transaction);
      assert(common.ensureKeysNotNull(fixture.transactionKeys, response.transaction));
      assert(common.ensureKeysNotNull(fixture.amountKeys, response.transaction.Amount));
      assert(common.ensureKeysNotNull(fixture.metaKeys, response.transaction.meta));
      assert(common.ensureKeysNotNull(fixture.amountKeys, response.transaction.meta.delivered_amount));
      assert(common.ensureKeysNotNull(fixture.ModifiedNodesKeys, response.transaction.meta.AffectedNodes));
      done();
    });
  });

  it('should fail to get notifications', function(done) {
    client.getTransaction('FakeTransaction', function(error, response) {
      assert(error);
      assert(!response);
      assert(!error.response.body.success);
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert.strictEqual(error.response.body.message,
        'Transaction not found. A transaction hash was not supplied and there were no entries matching the client_resource_id.');
      done();
    });
  });
});
