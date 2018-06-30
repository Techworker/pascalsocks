/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * Abstract channel.
 */
class Channel
{
    /**
     * Constructor
     *
     * @param {EventManager} eventMgr
     * @param {SubscriptionManager} subscriptionManager
     */
    constructor(eventMgr, subscriptionManager)
    {
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

        /**
         * The manager that holds all subscriptions.
         *
         * @type {SubscriptionManager}
         */
        this.subscriptionManager = subscriptionManager;

        // add react handlers for events
        this.constructor.events.forEach((E) => eventMgr.on(E.name, (e) => this.react(e)));
    }

    static name() {
        throw new Error("Abstract");
    }

    static events() {
        throw new Error("Abstract");
    }

    /**
     * Will send
     *
     * @param {Event} event
     */
    react(event)
    {
        // fetch all subscriptions for this channel
        const subscriptions = this.subscriptionManager.getSubscriptionsOfChannel(this.name);

        // now loop all subscriptions and fetch the ones which apply
        const matchedSubscriptions = subscriptions.filter(
            sub => this.subscriptionWantsEvent(sub, event)
        );

        // go ahead and notify the matching subscriptions
        this.eventMgr.notify(event, matchedSubscriptions);
    }

    subscriptionWantsEvent(subscription, event) {
        return true;
    }

    validateSubscription() {
        return true;
    }

}

module.exports = Channel;