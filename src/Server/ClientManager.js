/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * A small manager class to handle client connections.
 */
class ClientManager {
  /**
     * Creates a new instance of the ClientManager class.
     */
  constructor() {
    this.clients = new Map();
  }

  /**
     * Adds a single clientId to the list of clients and returns its unique
     * identifier.
     *
     * @param {WebSocket} client
     */
  addClient(client) {
    // TODO: __pascal as name is stupid
    // new websocket clientId, set our pascal related data
    if (client.__pascal === undefined) {
      client.__pascal = {
        uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

          return v.toString(16);
        }),
        lastUpdated: Date.now()
      };
    }

    this.clients.set(client.__pascal.uuid, client);
    return client.__pascal.uuid;
  }

  /**
     * Gets the clientId identified by the given socket connection.
     *
     * @param {WebSocket} socket
     * @returns {WebSocket}
     */
  getClientIdBySocket(socket) {
    return this.clients.get(socket.__pascal.uuid);
  }

  /**
     * Gets the socket identified by the given client id.
     *
     * @param {String} uuid
     * @returns {WebSocket}
     */
  getClientByUuid(uuid) {
    return this.clients.get(uuid);
  }

  /**
     * Removes a single client from the list of clients identified by the socket.
     *
     * @param {WebSocket} socket
     */
  removeClientBySocket(socket) {
    this.clients.delete(this.getClientIdBySocket(socket));
    return this;
  }

  /**
     * Removes a single client from the list of clients identified by the socket.
     *
     * @param {String} clientId
     */
  removeClientByClientId(clientId) {
    this.clients.delete(clientId);
    return this;
  }
}

module.exports = ClientManager;
