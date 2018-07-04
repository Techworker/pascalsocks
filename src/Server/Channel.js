/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * Single channel.
 */
class Channel {
  /**
   * Constructor
   *
   * @param {EventManager} eventMgr
   * @param {EventManager} eventMgr
   * @param {SubscriptionManager} subscriptionManager
   */
  constructor(events, eventMgr, subscriptionManager) {
    /**
         * Internal flag to avoid async overruns.
         *
         * @type {boolean}
         */
    this.working = false;

    /**
         * Event emitter that will emit the data from the channel to the
         * websocket server.
         *
         * @type {EventManager}
         */
    this.eventMgr = eventMgr;

    this.events = events;

    /**
         * The manager that holds all subscriptions.
         *
         * @type {SubscriptionManager}
         */
    this.subscriptionManager = subscriptionManager;

    // add react handlers for events
    this.events.forEach((E) => {
      eventMgr.on(E.name(), (e) => {
        this.react(e);
      });
    });
  }

  static name() {
    throw new Error('Abstract');
  }

  static events() {
    throw new Error('Abstract');
  }

  /**
     * Will send
     *
     * @param {Event} event
     */
  react(event) {
    // fetch all subscriptions for this channel
    const subscriptions = this.subscriptionManager.getSubscriptionsOfEvent(event.constructor.name());

    // now loop all subscriptions and fetch the ones which apply
    const matchedSubscriptions = subscriptions.filter(
      sub => sub.eventApplies(event)
    );

    // go ahead and notify the matching subscriptions
    this.eventMgr.notify(event, matchedSubscriptions);
  }

  /**
     * Sends all recent.
     *
     * @param subscription
     */
  subscribed(subscription) {
    // get all snapshot events
    const snapshotEvents = this.eventMgr.getEvents(
      subscription.eventName, subscription.snapshot
    );

    snapshotEvents.forEach((event) => {
      if (subscription.eventApplies(event)) {
        this.eventMgr.notify(event, [subscription]);
      }
    });

    // get all snapshot events from the recent events
    const recentEvents = this.eventMgr.getRecentEvents(subscription.eventName);

    recentEvents.forEach((event) => {
      if (subscription.eventApplies(event)) {
        this.eventMgr.notify(event, [subscription]);
      }
    });
  }
}

module.exports = Channel;
