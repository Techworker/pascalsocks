/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Subscription = require('./Subscription');

/**
 * A simple manager object that manages subscriptions.
 */
class SubscriptionManager {
  /**
     * Constructor.
     */
  constructor() {
    this.subscriptions = new Map();
  }

  /**
     * Adds a single subscription with the given data and returns the created
     * Subscription instance.
     *
     * @param {String} clientId
     * @param {String} ident
     * @param {String} event
     * @param {Number} snapshot
     * @param {Array} filters
     * @returns {Subscription}
     */
  subscribe(clientId, ident, event, snapshot, filters = [])
  {
    const subscription = new Subscription(
      clientId, ident, event, snapshot, filters
    );

    this.subscriptions[ident] = subscription;

    return subscription;
  }

  /**
   * Gets a value indicating whether the manager has the given ident.
   *
   * @param {String} ident
   * @returns {boolean}
   */
  hasIdent(ident) {
    return this.subscriptions.has(ident);
  }

  /**
   * Removes all subscriptions of the given clientId.
   *
   * @param {String} clientId
   */
  unsubscribeClientId(clientId) {
    let toRemove = [];

    for (let [ident, subscription] of this.subscriptions) {
      if (subscription.isClientId(clientId)) {
        toRemove.push(ident);
      }
    }

    toRemove.forEach(ident => this.subscriptions.delete(ident));
  }

  /**
   * Removes all subscriptions of the given clientId and event.
   *
   * @param {String} clientId
   * @param {String} event
   */
  unsubscribeEvent(clientId, event) {
    let toRemove = [];

    for (let [ident, subscription] of this.subscriptions) {
      if (subscription.clientId === clientId && subscription.event === event) {
        toRemove.push(ident);
      }
    }

    toRemove.forEach(ident => this.subscriptions.delete(ident));
  }

  /**
     * Removes all subscriptions of the given clientId and channel and returns
     * the removed ones.
     *
     * @param {String} clientId
     * @param {String} ident
     *
     * @return {Array<Subscription>}
     */
  unsubscribeIdent(clientId, ident) {
    let toRemove = [];

    for (let [, subscription] of this.subscriptions) {
      if (subscription.clientId === clientId && subscription.ident === ident) {
        toRemove.push(ident);
      }
    }

    toRemove.forEach(ident => this.subscriptions.delete(ident));
  }

  /**
   * Gets all subscriptions of the given channel.
   *
   * @param {String} event
   * @returns {Array<Subscription>}
   */
  getSubscriptionsOfEvent(event) {
    let subscriptions = [];

    for (let [, subscription] of this.subscriptions) {
      if (subscription.event === event) {
        subscriptions.push(subscription);
      }
    }

    return subscriptions;
  }

  /**
   * Gets the subscription of the given ident.
   *
   * @param {String} ident
   * @returns {Subscription|null}
   */
  getSubscription(ident) {
    if (this.hasIdent(ident)) {
      return this.subscriptions.get(ident);
    }

    return null;
  }
}

module.exports = SubscriptionManager;
