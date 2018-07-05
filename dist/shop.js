const PascalSocks = require('../client.js');
const EV_TX = PascalSocks.Events.Transaction.name();
const Filter = PascalSocks.Filter;
const socket = new PascalSocks.Client('127.0.0.1:8080');

// show account
const shopAccount = '123456-78';

socket.connect().then(() => {

  // listen to the shop account
  const filters = [
    new Filter('operationInfo.receiverAccount', 'eq', shopAccount)
  ];
  // now listen to all transactions that match the given filters
  socket.subscribe(EV_TX, 0, filters, (txEvent) => {
    // search for order in shop database and mark it paid
    shop.lookup(txEvent.operation.payload.decrypted).markPaid(); // pseudo code
  });
}).catch((ex) => console.log(ex));
