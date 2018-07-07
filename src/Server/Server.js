// nodejs
const WebSocket = require('ws');

// lib
const helper = require('../helper');

const Subscription = require('./Subscription');

const EventWelcome = require('../Events/Welcome');
const EventError = require('../Events/Error');
const EventSubscriptionSuccess = require('../Events/SubscribeSuccess');
const EventSubscriptionError = require('../Events/SubscribeError');

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

    // TODO: this is fixed..
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
    // register the client and send him a nice welcome and his uuid
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
      const errorEvent = new EventError('Unable to parse message: ' + message);

      await errorEvent.serialize();
      helper.send(webSocket, null, errorEvent, () => false);
      return;
    }

    // service is still intializing
    if (!this.readyToConnect) {
      const errorEvent = new EventSubscriptionError('Initializing service, please try again later');

      await errorEvent.serialize();
      this.eventMgr.notify(errorEvent, [webSocket]);
      return;
    }

    // now try to evaluate what the client wants
    switch (msg.action) {
      case 'subscribe':
        this.subscribe(msg, webSocket);
        break;
      case 'unsubscribe':
        this.unsubscribe(msg, webSocket);
        break;
      default:
        const errorEvent = new EventError(`Unknown action: ${msg.action}`);

        await errorEvent.serialize();
        this.eventMgr.notify(errorEvent, [webSocket]);
        return;
    }
  }

  /**
   * Subscribes a client based on the given message.
   *
   * @param {Object} msg
   * @param {WebSocket} webSocket
   */
  async subscribe(msg, webSocket) {
    // handle a subscription
    if (msg.action === 'subscribe') {
      // check if the client set its own ident, if not we will create one
      if (msg.ident === undefined) {
        do {
          msg.ident = helper.guid();
        } while (this.subscriptionManager.hasIdent(msg.ident));
      }


      // now subscribe the user
      const subscription = this.subscriptionManager.subscribe(
        this.clientManager.getClientIdBySocket(webSocket),
        msg.ident,
        msg.event,
        msg.snapshot,
        msg.filters || []
      );

      // .. and send the subscribed event
      const subscribedEvent = new EventSubscriptionSuccess(subscription);

      await subscribedEvent.serialize();
      this.eventMgr.notify(subscribedEvent, [subscription]);

      // send snapshots
      this.channel.snapshot(subscription);

      // ..and activate the channel (not before the snapshots are sent)
      subscription.activate();
    }
  }

  /**
   * Unsubscribes a client based on the given ident.
   *
   * @param {Object} msg
   * @param {WebSocket} webSocket
   */
  async unsubscribe(msg, webSocket) {
    // check if the client set its own ident, if we will unsubscribe the client
    // from everything
    if (msg.ident === undefined) {

      const errorEvent = new EventError(`Please set the ident of the subscription you want to unsubscribe from`);

      await errorEvent.serialize();
      this.eventMgr.notify(errorEvent, [webSocket]);
      return;
    }

    if (this.subscriptionManager.hasIdent(msg.ident)) {
      const subscription = this.subscriptionManager.getSubscription(msg.ident);

      subscription.deactivate();
      this.subscriptionManager.unsubscribeIdent(webSocket.__pascal.uuid, msg.ident);
      const errorEvent = new EventError(`Please set the ident of the subscription you want to unsubscribe from`);

      await errorEvent.serialize();
      this.eventMgr.notify(errorEvent, [webSocket]);
    }
  }

}

module.exports = Server;
