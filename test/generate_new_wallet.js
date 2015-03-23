'use strict';

var Client = require('../');
var assert = require('assert');


describe('Ripple REST Client Generate Build Payment', function() {
  var rippleRestClient = new Client({});

  it('should generate a new ripple wallet with secret', function(done) {

    rippleRestClient.generateNewWallet(function(error, response) {

      assert(!error, 'API call failed');
      assert(response, 'response is null');
      assert(response.address);
      assert(response.secret);
      done();
    });
  });
});
