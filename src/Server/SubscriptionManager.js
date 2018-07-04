/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Subscription = require('./Subscription');

/**
 * A simple manager object that handles clientId subscriptions for channels.
 */
class SubscriptionManager {
  /**
     * Constructor.
     *
     * @param {Hashids} hashIds
     */
  constructor(hashIds) {
    this.subscriptions = [];
  }

  /**
     * Adds a single subscription with the given data and returns the created
     * Subscription instance.
     *
     * @param {String} clientId
     * @param {String} ident
     * @param {String} eventName
     * @param {Number} snapshot
     * @param {Object} filters
     * @returns {Subscription}
     */
  subscribe(clientId, ident, eventName, snapshot, filters = []) {
    const subscription = new Subscription(
      clientId, ident, eventName, snapshot, filters
    );

    this.subscriptions.push(subscription);

    return subscription;
  }

  /**
     * Removes the given subscription.
     *
     * @param {Subscription} subscription
     */
  unsubscribe(subscription) {
    this.unsubscribeIdent(
      subscription.clientId,
      subscription.ident
    );
  }

  /**
   * Removes all subscriptions of the given clientId.
   *
   * @param {String} clientId
   */
  unsubscribeClientId(clientId) {
    let removed = [];

    this.subscriptions = this.subscriptions.filter(sub => {
      let keep = (sub.clientId !== clientId);

      if (!keep) removed.push(sub);
      return keep;
    });

    return removed;
  }

  /**
   * Removes all subscriptions of the given clientId.
   *
   * @param {String} clientId
   */
  unsubscribeEvent(clientId, event) {
    let removed = [];

    this.subscriptions = this.subscriptions.filter(sub => {
      let keep = (sub.event === event && sub.clientId === clientId);

      if (!keep) removed.push(sub);
      return keep;
    });

    return removed;
  }

  /**
     * Removes all subscriptions of the given clientId and channel and returns
     * the removed ones.
     *
     * @param {String} clientId
     * @param {String} channel
     *
     * @return {Array<Subscription>}
     */
  unsubscribeIdent(clientId, event, ident) {
    let removed = [];

    this.subscriptions = this.subscriptions.filter(sub => {
      let keep = !(sub.clientId !== clientId && sub.event !== event && sub.ident !== ident);

      if (!keep) removed.push(sub);
      return keep;
    });
    // console.log(this.subscriptions);

    return removed;
  }

  /**
     * Gets all subscriptions of the given clientId.
     *
     * @param {String} clientId
     * @returns {Array<Subscription>}
     */
  getSubscriptionsOfClientId(clientId) {
    return this.subscriptions.filter(
      sub => sub.isClientId(clientId) && sub.isActive()
    );
  }

  /**
     * Gets all subscriptions of the given channel.
     *
     * @param channel
     * @returns {Array<Subscription>}
     */
  getSubscriptionsOfEvent(event) {
    return this.subscriptions.filter(
      sub => sub.event === event && sub.isActive()
    );
  }

  /**
     * Gets a subscription identified by the given id.
     *
     * @param {String} channelId
     * @returns {Array<Subscription>}
     */
  getSubscriptionsOfChannelId(channelId) {
    return this.subscriptions.filter(
      sub => sub.isChannelId(channelId) && sub.isActive()
    );
  }
}

module.exports = SubscriptionManager;
