/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

const BlockMinedEvent = require('../Events/Block/Mined');

/**
 * This channel handles events that are related to blocks.
 */
class Block extends Channel
{
    /**
     * Creates a new instance of the Block class.
     *
     * @param {EventManager} eventMgr
     * @param {SubscriptionManager} subscriptionManager
     */
    constructor(eventMgr, subscriptionManager)
    {
        super('block', eventMgr, subscriptionManager);

        // gets fired when a block is mined
        eventMgr.on('block.mined', this.react.bind(this))
    }

    /**
     * This will send the given event to all subscriptions that fit.
     */
    react(event)
    {
        // first we will fetch all subscriptions
        const subscriptions = this.subscriptionManager.getSubscriptionsOfChannel(this.ident);
        const notifySubs = subscriptions.filter(sub => this.subscriptionWantsEvent(sub, event));
        this.eventMgr.notify(event, notifySubs);
    }

    /**
     * Checks if a subscription wants to receive the given event.
     *
     * @param {Subscription} subscription
     * @param {Event} event
     */
    subscriptionWantsEvent(subscription, event)
    {
        let notify = false;
        // first check the type of event
        switch(event.constructor)
        {
            case BlockMinedEvent:
                if(subscription.params.mined) {
                    notify = true;
                }
                break;
        }

        // event applies, but we will check the additional conditions now.
        if(notify === true)
        {
            if(subscription.params.block !== undefined &&
                event.data.block.block !== subscription.params.block)
            {
                // client wants a special block but not this one
                notify = false;
            }
        }

        return notify;
    }

    /**
     * Sends all recent.
     *
     * @param subscription
     */
    subscribed(subscription)
    {
        // get all snapshot events
        const snapshotEvents = this.eventMgr.getEvents(
            [BlockMinedEvent], subscription.params.snapshot
        );

        snapshotEvents.forEach((event) => {
            if (this.subscriptionWantsEvent(subscription, event)) {
                this.eventMgr.notify(event, [subscription]);
            }
        });
    }

    /**
     * Validates and prepares the subscription parameters.
     *
     * @param {Subscription} subscription
     */
    validateSubscription(subscription)
    {
        // snapshot:
        // will send the newly subscribed client the latest mined block if no
        // value is given
        if(subscription.params.snapshot === undefined) {
            subscription.params.snapshot = 1;
        }

        // mined:
        // will inform the client that a new block was mined
        if(subscription.params.mined === undefined) {
            subscription.params.mined = true;
        }

        // block:
        // will inform the client when a block with the given id is mined
        if(subscription.params.block !== undefined) {
            subscription.params.block = parseInt(subscription.params.block, 10);
        }
    }
}

module.exports = Block;

