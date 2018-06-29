// nodejs
const WebSocket = require('ws');

// npm
const Hashids = require('hashids');

// load .env
const dotEnvResult = require('dotenv').config();
if (dotEnvResult.error) {
    throw dotEnvResult.error
}

const Server = require('./lib/Server');

// lib
const EventManager = require('./lib/EventManager');
const Listener = require('./lib/Listener');
const ChainLoader = require('./lib/ChainLoader');
const ClientManager = require('./lib/ClientManager');
const SubscriptionManager = require('./lib/SubscriptionManager');
const OperationChannel = require('./lib/Channels/Operation');
const BlockChannel = require('./lib/Channels/Block');
const AccountChannel = require('./lib/Channels/Account');
const PascalRPCClient = require('./lib/PascalRPCClient');
const BlockChain = require('./lib/BlockChain');
const Subscription = require('./lib/Subscription');
const Config = require('./lib/Config');

const config = Config.fromEnv();
const hashIds = new Hashids(config.hashidsHash);
const eventMgr = new EventManager();
const pascalRPCClient = new PascalRPCClient(config.host, config.port);
const chain = new BlockChain(eventMgr);
const subscriptionManager = new SubscriptionManager(hashIds);

new Server(
    config,
    eventMgr,
    new ClientManager(),
    subscriptionManager,
    pascalRPCClient,
    chain,
    new Listener(pascalRPCClient, chain),
    new ChainLoader(pascalRPCClient, chain),
    [
        new OperationChannel(eventMgr, subscriptionManager),
        new BlockChannel(eventMgr, subscriptionManager),
        new AccountChannel(eventMgr, subscriptionManager)
    ]
).run();