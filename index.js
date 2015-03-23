const async = require('async');
const uuid = require('node-uuid');
const http = require('superagent');
const _ = require('lodash');


var Client = function(options) {
  this.api = options.api || 'https://api.ripple.com/';
  this.account = options.account;
  this.secret = options.secret || '';
  this.lastPaymentHash = options.lastPaymentHash;
  this.errors = [];
  this.version = options.version || 1;
}

Client.prototype.ping = function(callback){
  var url = this.api;
  http
    .get(url)
    .end(function(error, response){
      if (error) {
        callback(error);
      } else {
        callback(null, response.body);
      }
  });
};

Client.prototype.getTransactionFee = function(callback) {
  var url = this.api+'v1/transaction-fee';

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }
      callback(null, response.body);
    });
};

Client.prototype.generateUUID = function(callback) {
  var url = this.api+'v1/uuid';

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body.uuid);
      } else {
        callback(response.body);
      }
    });
};

Client.prototype.generateNewWallet = function(callback) {
  var url = this.api+'v1/wallet/new';

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body.wallet);
      } else {
        callback(response.body);
      }
    });
};

Client.prototype.sendPayment = function(payment, callback){
  var url = this.api+'v1/accounts/'+this.account+'/payments';

  if (this.secret !== '') {
    payment.secret = this.secret;
    payment.client_resource_id = uuid.v4();
  }
  http
    .post(url)
    .send(payment)
    .end(function(error, response) {
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
    });
};

Client.prototype.getAccountBalance = function(callback){
  var url = this.api+'v1/accounts/'+this.account+'/balances';

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
  });
};

Client.prototype.buildPayment = function(opts, callback){

  var amount = opts.amount + "+" + opts.currency;
  amount += !_.isEmpty(opts.to_issuer) ? '+' + opts.to_issuer : '';

  var url = this.api+'v1/accounts/'+this.account+'/payments/paths/'+opts.recipient+'/'+amount;
  var sourceCurrenciesParam = {};
  var sourceCurrenciesString = '';

  // Source currencies comes in as an array, build a query string param to append to the url
  if (opts.source_currencies && opts.source_currencies.length > 0) {
    sourceCurrenciesString = opts.source_currencies.join(',');
    //TODO: look into this encode/decode issue
    sourceCurrenciesString += !_.isEmpty(opts.from_issuer) ? decodeURIComponent('%20') + opts.from_issuer : '';
    sourceCurrenciesParam.source_currencies = sourceCurrenciesString;
  }

  http
    .get(url)
    .query(sourceCurrenciesParam)
    .end(function(error, response){

      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }

    });
};

Client.prototype.getNotification = function(hash, callback){
  var url = this.api+'v1/accounts/'+this.account+'/notifications/'+hash;

  http
    .get(url)
    .end(function(error, response){

    if (error) {
      callback(error);
    } else {
      var notification = response.body.notification;

      if (notification && notification.next_hash) {
        notification.next_notification_hash = notification.next_hash;
        callback(null, notification);
      } else {
        callback(null, null);
      }
    }
  });
};

Client.prototype.setHash = function(paymentHash, callback) {
  this.lastPaymentHash = paymentHash;
};

Client.prototype.getPayment = function(hash, callback){
  var url = this.api+'v1/accounts/'+this.account+'/payments/'+hash;

  http
    .get(url)
    .end(function(error, response) {
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body.payment);
      } else {
        callback(response.body);
      }
    });
};


Client.prototype.getPayments = function(account, callback){
  var account = account || this.account;
  var url = this.api+'v1/accounts/'+account+'/payments';

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        callback(error);
      } else if (response.body.success) {
        callback(null, response.body.payments);
      } else {
        callback(response.body);
      }
  });
};

Client.prototype.getTransaction = function(hash, callback){
  var url = this.api+'v1/transactions/'+hash;

  http
    .get(url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
    });
};

Client.prototype.getServerStatus = function(opts, callback){
  var url = this.api+'v1/server';
  http
    .get(url)
    .end(function(error, response) {
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
    });
};


Client.prototype.updateAccountSettings = function(opts, callback) {

  var account = opts.account || this.account;
  opts.data.secret = opts.data.secret || this.secret;

  var options = {
    url: this.api + 'v1/accounts/'+account+'/settings',
    json: opts.data
  };

  http
    .post(options.url)
    .send(options.json)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
    });
};


Client.prototype.getPaymentStatus = function(statusUrl, callback){
  http.
    get(statusUrl)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body);
      } else {
        callback(response.body);
      }
  });
};

Client.prototype._getAndHandlePaymentStatus = function(statusUrl, callback, loopFunction){
  var self = this;
  self.getPaymentStatus(statusUrl, function(error, response) {
    if (error) {
      if (error.response && error.response.body && error.response.body.error === 'txnNotFound') {
        setTimeout(function() {
          loopFunction(statusUrl, callback, loopFunction);
        }, 100);
      } else {
        callback(error, null);
      }
      return;
    }
    if (response && (response.state === 'validated' || response.state === 'failed')) {
      callback(null, response.payment);
    } else {
      setTimeout(function() {
        loopFunction(statusUrl, callback, loopFunction);
      }, 100);
    }
  });
};

Client.prototype.pollPaymentStatus = function(payment, callback){
  var self = this;
  if (payment && payment.status_url) {
    var urlParse = require('url').parse;
    var url = urlParse(payment.status_url);

    if (_.isEmpty(url.protocol)) {
      payment.status_url = 'https://' + payment.status_url;
    }

    self._getAndHandlePaymentStatus(payment.status_url, callback,
      self._getAndHandlePaymentStatus.bind(this));
  } else {
    callback(new Error('RippleRestError:StatusUrlUnavailable'));
  }
};

Client.prototype.setTrustLines = function(options, callback){
  var account = options.account || this.account;
  var options = {
    url: this.api + 'v1/accounts/'+account+'/trustlines',
    json: {
      secret: options.secret,
      trustline: {
        limit: options.limit,
        currency: options.currency,
        counterparty: options.counterparty
      }
    }
  };

  http
    .post(options.url)
    .send(options.json)
    .end(function(error, response) {
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body.trustline);
      } else {
        callback(response.body);
      }
    });

};

Client.prototype.getTrustLines = function(options, callback){

  var account = options.fromAccount || this.account;
  var url = this.api + 'v1/accounts/'+account+'/trustlines';

  if (options.toAccount) {
    url += '?counterparty=' + options.toAccount;
  }

  if (options.toAccount && options.currency) {
    url += '&currency='+options.currency;
  }

  var settings = {
    url: url,
    json: true
  };

  http
    .get(settings.url)
    .end(function(error, response){
      if (error) {
        return callback(error);
      }

      if (response.body.success) {
        callback(null, response.body.trustlines);
      } else {
        callback(response.body);
      }
    });
};

Client.prototype.sendAndConfirmPayment = function(opts, callback){
  var self = this;
  async.waterfall([
    function(next){
      self.sendPayment(opts, next);
    },
    function(payment, next){
      self.pollPaymentStatus(payment, next);
    }
  ], callback);
};

module.exports = Client;
