// npm
const Hashids = require('hashids');

const Server = require('./src/Server/Server');

// lib
const EventManager = require('./src/Server/EventManager');
const Listener = require('./src/Server/Listener');
const ChainLoader = require('./src/Server/ChainLoader');
const ClientManager = require('./src/Server/ClientManager');
const SubscriptionManager = require('./src/Server/SubscriptionManager');
const RPC = require('./src/RPC');
const BlockChain = require('./src/Server/BlockChain');
const Channel = require('./src/Server/Channel');
const Config = require('./src/Server/Config');

const EventBlockMined = require('./src/Events/BlockMined');

const EventOperationMatured = require('./src/Events/OperationMatured');
const EventOperationPending = require('./src/Events/OperationPending');
const EventOperationIncluded = require('./src/Events/OperationIncluded');
const EventOperationNotIncluded = require('./src/Events/OperationNotIncluded');

const EventAccountAdded = require('./src/Events/AccountAdded');
const EventAccountBuy = require('./src/Events/AccountBuy');
const EventAccountChangeKey = require('./src/Events/AccountChangeKey');
const EventAccountChangeName = require('./src/Events/AccountChangeName');
const EventAccountChangeType = require('./src/Events/AccountChangeType');
const EventAccountDelist = require('./src/Events/AccountDelist');
const EventAccountForSale = require('./src/Events/AccountForSale');

const EventTransaction = require('./src/Events/Transaction');

const config = Config.fromEnv();
const hashIds = new Hashids(config.hashidsHash);
const eventMgr = new EventManager();
const rpc = new RPC(config.host, config.port);
const chain = new BlockChain(eventMgr, rpc);
const subscriptionManager = new SubscriptionManager(hashIds);

new Server(
  config,
  eventMgr,
  new ClientManager(),
  subscriptionManager,
  rpc,
  chain,
  new Listener(rpc, chain),
  new ChainLoader(rpc, chain),
  new Channel([
    EventBlockMined,
    EventOperationPending,
    EventOperationIncluded,
    EventOperationMatured,
    EventOperationNotIncluded,
    EventTransaction,
    EventAccountAdded,
    EventAccountBuy,
    EventAccountChangeKey,
    EventAccountChangeName,
    EventAccountChangeType,
    EventAccountDelist,
    EventAccountForSale
  ], eventMgr, subscriptionManager)
).run();
