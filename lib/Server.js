// nodejs
const WebSocket = require('ws');

// npm
const Hashids = require('hashids');


// lib
const helper = require('./helper');

const Config = require('./Config');
const EventManager = require('./EventManager');
const Listener = require('./Listener');
const ChainLoader = require('./ChainLoader');
const ClientManager = require('./ClientManager');
const SubscriptionManager = require('./SubscriptionManager');
const PascalRPCClient = require('./PascalRPCClient');
const BlockChain = require('./BlockChain');
const Subscription = require('./Subscription');

const WelcomeEvent = require('./Events/Welcome');
const SubscriptionSubscribedEvent = require('./Events/Subscription/Subscribed');
const SubscriptionErrorEvent = require('./Events/Subscription/Error');

/**
 * The server class which is the entrypoint of the application.
 */
class Server
{
    /**
     * Creates a new instance of the Server class.
     *
     * @param {Config} config
     * @param {EventManager} eventMgr
     * @param {ClientManager} clientManager
     * @param {SubscriptionManager} subscriptionManager
     * @param {PascalRPCClient} pascalRPCClient
     * @param {BlockChain} chain
     * @param {Listener} listener
     * @param {ChainLoader} chainLoader
     * @param {Array<Channel>} channels
     */
    constructor(config, eventMgr, clientManager, subscriptionManager,
                pascalRPCClient, chain, listener, chainLoader, channels)
    {
        // a flag indicating whether the server is ready to receive connections
        this.readyToConnect = false;

        this.config = config;
        this.eventMgr = eventMgr;
        this.clientManager = clientManager;
        this.subscriptionManager = subscriptionManager;
        this.pascalRPCClient = pascalRPCClient;
        this.chain = chain;
        this.listener = listener;
        this.chainLoader = chainLoader;

        // initialize channels, simple array from outside, map inside
        this.channels = new Map();
        channels.forEach((c) => this.channels.set(c.constructor.name, c));

        // this is fixed..
        this.webSocketServer = new WebSocket.Server({ port: config.wsPort });
    }

    /**
     * Starts the server.
     */
    run()
    {
        // load history first
        this.chainLoader.load(this.config.blockLookBack).then(() => {
            this.readyToConnect = true;
            this.listener.listen(this.config.listenInterval);
        });

        // listen to incoming connections
        this.webSocketServer.on('connection',
            (webSocket) => this.onConnection(webSocket)
        );

        // as soon as we get a notify event, we will send it to all subscriptions
        this.eventMgr.on('notify',
            (event, recipients) => this.onNotify(event, recipients)
        );
    }

    /**
     * Handler that will send the given event to the given recipients.
     *
     * @param {Event} event
     * @param {Array<Subscription|WebSocket>} recipients
     */
    onNotify(event, recipients)
    {
        if(recipients.length === 0) {
            return;
        }

        // now loop all subscriptions and send the data to it
        recipients.forEach((recipient) => {

            let webSocketClient;
            if(recipient.constructor === Subscription) {
                webSocketClient = this.clientManager.getClientByUuid(recipient.clientId);
            } else {
                webSocketClient = recipient;
            }

            helper.send(webSocketClient, event, function(error) {
                // the client disconnected, clean up
                if(error !== undefined) {
                    this.webSocketClient.terminate();
                    this.server.clientManager.removeClientBySocket(this.webSocketClient);

                    // TODO: unknown implementation detail!
                    this.server.subscriptionManager.unsubscribeClientId(this.webSocketClient.__pascal.uuid);
                }
            }.bind({webSocketClient, server: this}));

        });
    }

    /**
     * Gets called when a new connection is established.
     *
     * @param {WebSocket} webSocket
     */
    onConnection(webSocket)
    {
        // register the clientId and send him a nice welcome and his uuid
        let uuid = this.clientManager.addClient(webSocket);
        helper.send(webSocket, new WelcomeEvent(uuid), () => {});

        // listen to messages from the clientId (subscribe, unsubscribe etc.)
        webSocket.on('message', (message) => this.onMessage(message, webSocket));
    }

    /**
     * Handles a JSON encoded string message from the client to the server
     * (subscription, ..)
     *
     * @param {String} message
     * @param {WebSocket} webSocket
     */
    onMessage(message, webSocket)
    {
        let msg;
        try {
            // parse the message and see if its of type json
            msg = JSON.parse(message);
        } catch(e) {
            // TODO: use helper.send with a custom event
            webSocket.send(JSON.stringify({
                error: true,
                message: 'Unable to parse message: ' + message
            }));
            return;
        }

        // subscription
        if(msg.action === 'subscribe')
        {
            if(!this.readyToConnect) {
                const errorEvent = new SubscriptionErrorEvent(`Initializing service, please try again later`);
                this.eventMgr.notify(errorEvent, [webSocket]);
                return;
            }

            // check if the channel is given and registered
            if(msg.channel === undefined || !this.channels.has(msg.channel))
            {
                const errorEvent = new SubscriptionErrorEvent(`Unable to subscribe to channel: "${msg.channel}"`);
                this.eventMgr.notify( errorEvent, [webSocket]);
                return;
            }

            const channel = this.channels.get(msg.channel);

            // now subscribe the user
            // TODO: Implementation detail
            const subscription = this.subscriptionManager.subscribe(
                webSocket.__pascal.uuid, msg.channel, msg.params || {}
            );

            try
            {
                channel.validateSubscription(subscription);
            } catch(ex) {
                this.subscriptionManager.unsubscribe(subscription);
                const errorEvent = new SubscriptionErrorEvent(ex.message);
                this.eventMgr.notify(errorEvent, [subscription]);
                return;
            }

            const subscribedEvent = new SubscriptionSubscribedEvent(subscription);
            this.eventMgr.notify(subscribedEvent, [subscription]);
            subscription.activate();

            // we will check if the channel has a subscribed method and call it.
            // This way the channel can react to a new subscription and probably
            // send a snapshot and such.
            if(channel.subscribed !== undefined) {
                channel.subscribed(subscription);
            }
        }
    }
}

module.exports = Server;