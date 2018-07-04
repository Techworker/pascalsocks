module.exports = {
  Client: require('./src/Client/Client'),
  Events: {
    AccountAdded: require('./src/Events/AccountAdded'),
    AccountBuy: require('./src/Events/AccountBuy'),
    AccountChangeKey: require('./src/Events/AccountChangeKey'),
    AccountChangeName: require('./src/Events/AccountChangeName'),
    AccountChangeType: require('./src/Events/AccountChangeType'),
    AccountDelist: require('./src/Events/AccountDelist'),
    AccountForSale: require('./src/Events/AccountForSale'),
    BlockMined: require('./src/Events/BlockMined'),
    OperationIncluded: require('./src/Events/OperationIncluded'),
    OperationMatured: require('./src/Events/OperationMatured'),
    OperationNotIncluded: require('./src/Events/OperationNotIncluded'),
    OperationPending: require('./src/Events/OperationPending'),
    SubscriptionError: require('./src/Events/SubscriptionError'),
    SubscriptionSubscribed: require('./src/Events/SubscriptionSuccess'),
    Transaction: require('./src/Events/Transaction'),
    Welcome: require('./src/Events/Welcome')
  },
  Types: {
    Account: require('./src/Types/Account'),
    AccountNumber: require('./src/Types/AccountNumber'),
    Block: require('./src/Types/Block'),
    HexaString: require('./src/Types/HexaString'),
    Operation: {
      Operation: require('./src/Types/Operation'),
      Changer: require('./src/Types/Operation/Changer'),
      Receiver: require('./src/Types/Operation/Receiver'),
      Sender: require('./src/Types/Operation/Sender')
    },
    OperationInfo: {
      Buy: require('./src/Types/OperationInfo/Buy'),
      ChangeKey: require('./src/Types/OperationInfo/ChangeKey'),
      ChangeName: require('./src/Types/OperationInfo/ChangeName'),
      ChangeType: require('./src/Types/OperationInfo/ChangeType'),
      Delist: require('./src/Types/OperationInfo/Delist'),
      ForSale: require('./src/Types/OperationInfo/ForSale'),
      Transaction: require('./src/Types/OperationInfo/Transaction')
    },
    PascalCurrency: require('./src/Types/PascalCurrency'),
    Payload: require('./src/Types/Payload'),
    PublicKey: require('./src/Types/PublicKey')
  }
};
