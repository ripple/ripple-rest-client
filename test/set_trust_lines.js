'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var common = require('./common/common');
var fixture = require('./fixtures/set_trust_lines');
var SECRET = process.env.RIPPLE_ACCOUNT_SECRET;

describe('Ripple REST Client setTrustLines', function() {
  var client = new Client({
    account: account_info.source_account
  });

  if (SECRET) {
    it('should set trust lines between two given accounts', function(done) {
      var trust = {
        account: account_info.source_account,
        secret: account_info.source_account_secret,
        limit: 100,
        currency: 'RUU',
        counterparty: account_info.destination_account
      };

      client.setTrustLines(trust, function(error, response) {
        assert(!error, 'Error is not null');
        assert(response, 'Response is null');
        assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response));
        assert.strictEqual(typeof response, 'object');
        assert.strictEqual(client.account, response.account);
        done();
      });
    });
  } else {
    it.skip('should get trust lines between two given accounts');
  }

  it('should fail because of missing secret', function(done) {
    var trust = {
      secret: '',
      amount: 1,
      currency: 'SWG',
      issuer: account_info.source_account
    };

    client.setTrustLines(trust, function(error, response) {
      assert(error, 'Error is null');
      assert.strictEqual(error.response.body.success, false, 'Request should fail');
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert(!response);
      done();
    });
  });
});
