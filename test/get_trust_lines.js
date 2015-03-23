'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();
var fixture = require('./fixtures/get_trust_lines');
var common = require('./common/common');

describe('Ripple REST Client Get Trustlines', function() {
    var client = new Client({
      account: account_info.source_account
    });

  it('should get trust lines of accounts', function(done) {
    client.getTrustLines(client.account, function(error, response) {
      assert(!error);
      assert(response);
      assert(response instanceof Array);
      assert(common.ensureKeysNotNull(fixture.rootExpectedKeys, response));
      done();
    });
  });

  it('should fail to get trust lines of accounts', function(done) {
    client = new Client({});
    client.getTrustLines('FakeAccount', function(error, response) {
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
