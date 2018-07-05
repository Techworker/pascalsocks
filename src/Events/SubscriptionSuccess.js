/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The subscribed event that is sent to a client if a subscription was
 * successful.
 */
class SubscriptionSuccess extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'subscription_subscribed';
  }

  /**
     * Creates a new instance of the the Subscribed class.
     *
     * @param {Subscription} subscription
     */
  constructor(subscription) {
    super(`Subscribed to event ${subscription.event}`);

    this._subscription = subscription;
  }

  /**
     * Gets the subscription.
     *
     * @returns {Subscription}
     */
  get subscription() {
    return this._subscription;
  }

  /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serializeEvent(chain) {
    return {
      subscription: this.subscription.serialize()
    };
  }
}

module.exports = SubscriptionSuccess;
