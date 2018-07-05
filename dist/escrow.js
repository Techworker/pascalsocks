// escrow example using pascalsocks

const PascalSocks = require('../client.js');

// create new websocket client
const socketClient = new PascalSocks.Client('127.0.0.1:8080');

// the escrow account number
const escrowAccount = '440065-64';

socketClient.connect().then(function() {
  // name of transaction event
  const EV_TX = PascalSocks.Events.Transaction.name();

  // 1. filter receiver (440065-64) which is the escrow account
  // 2. filter payload which needs to start with "escrow"
  const filters = [
    new PascalSocks.Filter('operationInfo.receiverAccount', 'eq', escrowAccount),
    new PascalSocks.Filter('operationInfo.payload.decrypted', 'starts_with', 'escrow')
  ];

  // now listen to all transactions that match the given filters
  client.subscribe(EV_TX, 0, filters, function(txEvent) {

    // the subscription identifiers so we can unsubscribe later
    let forwardSubscriptionId;
    let returnSubscriptionId;
    let lockSubscriptionId;

    // incoming escrow transaction arrived
    // --

    // now listen to further transactions to 440065-64 from either the sender
    // or the receiver defined in the payload

    // cutout "escrow "
    const escrowReceiver = txEvent.operationInfo.payload.decrypted.substring(7);
    const escrowSender = txEvent.operationInfo.senderAccount;
    const escrowOpHash = txEvent.operation.opHash.substring(0, 24);

    const forwardFilters = [
      new PascalSocks.Filter('operationInfo.receiverAccount', 'eq', escrowAccount),
      new PascalSocks.Filter('operationInfo.senderAccount', 'eq', escrowSender),
      new PascalSocks.Filter('operation.payload.decrypted', 'starts_with', 'forward ' + escrowOpHash)
    ];

    // listen to forward tx
    client.subscribe(EV_TX, 0, forwardFilters, function(forwardTxEvent) {
      // forward money to escrowReceiver (JSON RPC)

      // remove sub-subscriptions for the main transaction
      client.unsubscribe(
        [forwardSubscriptionId, returnSubscriptionId, lockSubscriptionId]
      );
    }).then(function(subscriptionId) => {
      forwardSubscriptionId = subscriptionId;
    });

    const returnFilters = [
      new PascalSocks.Filter('operationInfo.receiverAccount', 'eq', escrowAccount),
      new PascalSocks.Filter('operationInfo.senderAccount', 'eq', escrowSender),
      new PascalSocks.Filter('operation.payload.decrypted', 'starts_with', 'return ' + escrowOpHash)
    ];

    // listen to return tx
    client.subscribe(EV_TX, 0, forwardFilters, function(returnTxEvent) {
      // return money to escrowSender (JSON RPC)

      // remove sub-subscriptions for the main transaction
      client.unsubscribe(
        [forwardSubscriptionId, returnSubscriptionId, lockSubscriptionId]
      );
    }).then(function(subscriptionId) => {
      returnSubscriptionId = subscriptionId;
    });

    // lock filters
    const lockFilters = [
      new PascalSocks.Filter('operationInfo.receiverAccount', 'eq', escrowAccount),
      new PascalSocks.Filter('operationInfo.senderAccount', 'eq', escrowReceiver),
      new PascalSocks.Filter('operation.payload.decrypted', 'starts_with', 'lock ' + escrowOpHash)
    ];

    // listen to return tx
    client.subscribe(EV_TX, 0, lockFilters, function(lockTxEvent) {
      // maybe secure the money in other account

      // remove subscriptions for the main transaction
      client.unsubscribe(
        [forwardSubscriptionId, returnSubscriptionId, lockSubscriptionId]
      );
    }).then(function(subscriptionId) => {
      lockSubscriptionId = subscriptionId;
    });
  });
}).catch(function(ex) {
  // connection error
  console.log(ex);
});
