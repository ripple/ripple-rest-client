'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var uuid = require('node-uuid');
var common = require('./common/common');
var fixture = require('./fixtures/send_payment');
var SECRET = process.env.RIPPLE_ACCOUNT_SECRET;

describe('Ripple REST Client Send Payment', function() {
  var client = new Client({
    account: account_info.source_account
  });

  var successfulPayment = {
    source_account: account_info.source_account,
    source_amount: {value: '0.05', currency: 'SWD', issuer: ''},
    destination_account: account_info.destination_account,
    destination_amount: {value: '0.056', currency: 'SWD', issuer: account_info.source_account},
    partial_payment: false,
    no_direct_ripple: false,
    destination_tag: '0'
  };

  if (SECRET) {
    it('should send payment and receive status URL with protocol specified', function(done) {
      var paymentObj = {
        payment: successfulPayment,
        client_resource_id: uuid.v4(),
        secret: account_info.source_account_secret
      };

      client.sendPayment(paymentObj, function(error, response) {
        assert(!error);
        assert(response, 'Response is null');
        assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response));
        assert.strictEqual(response.success, true);
        assert.strictEqual(response.client_resource_id, paymentObj.client_resource_id);
        done();
      });
    });

  } else {
    it.skip('skipping this test because secret is not provided.');
  }

  var failedPayment = {
      source_account: '',
      source_amount: {value: '1', currency: 'XRP', issuer: ''},
      destination_account: account_info.destination_account,
      destination_amount: {value: '1', currency: 'XRP', issuer: ''},
      partial_payment: false,
      no_direct_ripple: false,
      destination_tag: '0'
    };

  it('should fail because source_account and secret are missing', function(done) {
    var paymentObj = {
      payment: failedPayment,
      client_resource_id: uuid.v4(),
      secret: account_info.source_account_secret
    };

    client.sendPayment(paymentObj, function(error, response) {
      assert(error, 'Error should not be null');
      assert(error.response.body);
      assert(!response, 'Response should be null');
      assert.strictEqual(error.response.body.success, false, 'Payment should fail');
      assert.strictEqual(error.response.body.error_type, 'invalid_request', 'Unexpected error type');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER', 'Unexpected error code');
      done();
    });
  });
});
