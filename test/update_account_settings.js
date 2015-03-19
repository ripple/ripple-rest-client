'use strict';

var Client = require('../');
var assert = require('assert');
var account_info = require('./fixtures/account_info')();

describe('Ripple REST Client Update Account Settings', function() {
  var client = new Client({
    account: account_info.source_account
  });

  it('should set require destination tag', function(done) {
    var optsHotWallet = {
      account: account_info.source_account,
      data: {
        secret: account_info.source_account_secret,
        settings: {
          require_destination_tag: false,
          disallow_xrp: false
        }
      }
    };

    client.updateAccountSettings(optsHotWallet, function(error, settings) {
      assert(!error);
      assert(settings);
      assert(settings.success);
      assert(settings.hash);
      assert.strictEqual(optsHotWallet.data.settings.require_destination_tag, settings.settings.require_destination_tag);
      assert.strictEqual(optsHotWallet.data.settings.disallow_xrp, settings.settings.disallow_xrp);
      done();
    });
  });

  it('should fail to set require destination tag', function(done) {
    var optsHotWallet = {
      account: account_info.source_account,
      data: {
      }
    };

    client.updateAccountSettings(optsHotWallet, function(error, settings) {
      assert(error);
      assert(!settings);
      assert(!error.response.body.success);
      assert.strictEqual(error.response.body.error_type, 'invalid_request');
      assert.strictEqual(error.response.body.error, 'restINVALID_PARAMETER');
      assert.strictEqual(error.response.body.message, 'Parameter missing: secret');
      done();
    });
  });

});
