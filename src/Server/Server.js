// nodejs
const WebSocket = require('ws');

// lib
const helper = require('./../helper');

const Subscription = require('./Subscription');

const EventWelcome = require('../Events/Welcome');
const EventSubscriptionSuccess = require('../Events/SubscriptionSuccess');
const EventSubscriptionError = require('../Events/SubscriptionError');

/**
 * The server class which is the entrypoint of the application.
 */
class Server {
  /**
     * Creates a new instance of the Server class.
     *
     * @param {Config} config
     * @param {EventManager} eventMgr
     * @param {ClientManager} clientManager
     * @param {SubscriptionManager} subscriptionManager
     * @param {RPC} pascalRPCClient
     * @param {BlockChain} chain
     * @param {Listener} listener
     * @param {ChainLoader} chainLoader
     * @param {Channel} channel
     */
  constructor(config, eventMgr, clientManager, subscriptionManager,
    pascalRPCClient, chain, listener, chainLoader, channel) {
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
    this.channel = channel;

    // this is fixed..
    this.webSocketServer = new WebSocket.Server({ port: config.wsPort });
  }

  /**
     * Starts the server.
     */
  run() {
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
  onNotify(event, recipients) {
    if (recipients.length === 0) {
      return;
    }

    helper.debug(this, 'sending ' + event.constructor.name() + ' to ' + recipients.length + ' recps');

    // now loop all subscriptions and send the data to it
    recipients.forEach((recipient) => {

      let webSocketClient;
      let subscriptionIdent;

      if (recipient.constructor === Subscription) {
        webSocketClient = this.clientManager.getClientByUuid(recipient.clientId);
        subscriptionIdent = recipient.ident;
      } else {
        webSocketClient = recipient;
      }

      helper.send(webSocketClient, subscriptionIdent, event, function (error) {
        // the client disconnected, clean up
        if (error !== undefined) {
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
  async onConnection(webSocket) {
    // register the clientId and send him a nice welcome and his uuid
    let uuid = this.clientManager.addClient(webSocket);
    const event = new EventWelcome(uuid);

    await event.serialize(null);
    helper.send(webSocket, null, event, () => {});

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
  async onMessage(message, webSocket) {
    let msg;

    try {
      // parse the message and see if its of type json
      msg = JSON.parse(message);
    } catch (e) {
      // TODO: use helper.send with a custom event
      webSocket.send(JSON.stringify({
        error: true,
        message: 'Unable to parse message: ' + message
      }));
      return;
    }

    // subscription
    if (msg.action === 'subscribe') {
      if (!this.readyToConnect) {
        const errorEvent = new EventSubscriptionError('Initializing service, please try again later');

        await errorEvent.serialize();
        this.eventMgr.notify(errorEvent, [webSocket]);
        return;
      }

      // check if the channel is given and registered
      if (msg.ident === undefined) {
        const errorEvent = new EventSubscriptionError('Unable to subscribe without an ident');

        await errorEvent.serialize();
        this.eventMgr.notify(errorEvent, [webSocket]);
        return;
      }

      // now subscribe the user
      // TODO: Implementation detail
      const subscription = this.subscriptionManager.subscribe(
        webSocket.__pascal.uuid, msg.ident, msg.event, msg.snapshot, msg.filters || []
      );

      const subscribedEvent = new EventSubscriptionSuccess(subscription);

      await subscribedEvent.serialize();
      this.eventMgr.notify(subscribedEvent, [subscription]);

      // we will check if the channel has a subscribed method and call it.
      // This way the channel can react to a new subscription and probably
      // send a snapshot and such.
      this.channel.subscribed(subscription);
      subscription.activate();
    }
  }
}

module.exports = Server;
