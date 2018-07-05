const helper = require('../helper');
const EventSubscriptionSuccess = require('../Events/SubscriptionSuccess');
const EventSubscriptionError = require('../Events/SubscriptionError');
const EventWelcome = require('../Events/Welcome');

/**
 * A pascalsocks client that should simplify the development of JS based
 * applications and can also serve as an implementation boilerplate for other
 * languages.
 */
class Client {

  /**
   * Creates a new instance of the Client class.
   *
   * @param {String} hostPort
   */
  constructor(hostPort) {

    // the host and port to connect to the websocket server.
    this.hostPort = hostPort;

    // the client id on successful connection
    this.clientId = null;

    // handlers which are active and will all be called when the websocket sends
    // a new message
    this.subscriptionHandlers = new Map();

    // a flag indicating whether we are trying to connect
    this.inConnect = false;

    // A flag indicating that we have a connection error
    this.isConnectError = false;
  }

  /**
   * Connects to the pascalsocks server and returns a promise.
   *
   * @returns {Promise}
   */
  connect() {
    return new Promise((resolve, reject) => {
      // set inConnect flag
      this.inConnect = true;

      // try to establish connection
      try {
        this.socket = new WebSocket('ws://' + this.hostPort);
      } catch (ex) {
        reject(ex);
      }

      // check for any error
      // TODO: this is the global handler! so if anything goes wrong beyond
      //       enabling the connection this handler will be called.
      this.socket.onerror = (event) => {
        if (this.inConnect) {
          this.isConnectError = true;
        } else {
          throw new Error('An unexpected error occured');
        }
      };

      // TODO: this is the global handler! so if a connection is closed this will
      //       be called.
      this.socket.onclose = () => {
        if (this.isConnectError) {
          reject('Unable to connect to server');
        } else {
          // TODO: reconnect?
          throw new Error('An error occured and the connection was closed.');
        }
      };

      // listen to 'welcome' message and then remove listener
      this.subscriptionHandlers.set('welcome', (message) => {
        if (message.event === EventWelcome.name()) {
          this.subscriptionHandlers.delete('welcome');
          this.clientId = message.id;
          resolve(message);
        }
      });

      this.socket.onopen = () => {
        // add the simple listener
        this.socket.onmessage = (event) => this.onMessage(event);
      };
    });
  }

  /**
   * Gets called whenever the socket receives a message.
   *
   * @param {Object} event
   */
  onMessage(event) {
    const parsed = JSON.parse(event.data);

    if (this.subscriptionHandlers[parsed.ident] !== undefined) {
      this.subscriptionHandlers[parsed.ident](parsed);
    }
  }

  /**
   * Subscribes to the given event.
   *
   * @param {String} event
   * @param {Number} snapshot
   * @param {Array} filters
   * @param {Function} callback
   * @returns {Promise}
   */
  subscribe(event, snapshot, filters, callback) {
    // create new guid to identify the subscription
    const ident = helper.guid();

    // the promise to be executed
    return new Promise((resolve, reject) => {
      // add a new onmessage handler that will check any given message
      // and if the ident matches AND it is a successful or errornous
      // subscription, we will resolve the promise and remove the
      // message handler.
      this.subscriptionHandlers.set(ident, (data) => {
        if (data.ident === ident && data.event === EventSubscriptionSuccess.name()) {
          resolve(data.ident);
          this.subscriptionHandlers.set(ident, (data) => {
            if (data.ident === ident && data.event === event) {
              callback(data);
            }
          });
        }
        if (data.ident === ident && data.event === EventSubscriptionError.name()) {
          reject(data);
        }
      });

      this.socket.send(JSON.stringify({
        action: 'subscribe',
        snapshot, event, ident, filters
      }));

    });
  }

  /**
   * Subscribes to the given event.
   *
   * @param {String} event
   * @param {Array} filters
   * @param {Function} callback
   * @returns {Promise}
   */
  once(event, filters, callback) {
    this.subscribe(event, 0, filters, (data) => {
      this.subscriptionHandlers.delete(data.ident);
      callback(data);
    });
  }
}

module.exports = Client;
