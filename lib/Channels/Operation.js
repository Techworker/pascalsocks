/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

// available events
const OperationMaturedEvent = require('../Events/Operation/Matured');
const OperationPendingEvent = require('../Events/Operation/Pending');
const OperationIncludedEvent = require('../Events/Operation/Included');
const OperationNotIncludedEvent = require('../Events/Operation/NotIncluded');

const AccountNumber = require('../BlockChain/Type/AccountNumber');

/**
 * Operation channel that one can subscribe to when (s)he wants to listen to
 * operations.
 */
class Operation extends Channel
{
    /**
     * Constructor
     *
     * @param {EventManager} eventMgr
     * @param {SubscriptionManager} subscriptionManager
     */
    constructor(eventMgr, subscriptionManager)
    {
        super('operation', eventMgr, subscriptionManager);

        // when a pending operation arrives at a node
        eventMgr.on('operation.pending', this.react.bind(this));

        // when a pending operation got mined
        eventMgr.on('operation.included', this.react.bind(this));

        // when a pending operation matured
        eventMgr.on('operation.matured', this.react.bind(this));

        // when a pending operation did not get mined and is still pending
        eventMgr.on('operation.not_included', this.react.bind(this));
    }

    /**
     * Will send
     *
     * @param {OperationPendingEvent|Included} event
     */
    react(event)
    {
        const subscriptions = this.subscriptionManager.getSubscriptionsOfChannel(this.ident);
        const notifySubs = subscriptions.filter(sub => this.subscriptionWantsEvent(sub, event));
        this.eventMgr.notify(event, notifySubs);
    }

    /**
     * Gets called wwhen a new subscription arrives.
     *
     * @param subscription
     */
    subscribed(subscription)
    {
        // get all snapshot events
        const snapshotEvents = this.eventMgr.getEvents(
            [OperationIncludedEvent, OperationMaturedEvent], subscription.params.snapshot
        );

        snapshotEvents.forEach((event) => {
            if (this.subscriptionWantsEvent(subscription, event)) {
                this.eventMgr.notify(event, [subscription]);
            }
        });

        // get all snapshot events
        const recentEvents = this.eventMgr.getRecentEvents([OperationPendingEvent]);
        recentEvents.forEach((event) => {
            if (this.subscriptionWantsEvent(subscription, event)) {
                this.eventMgr.notify(event, [subscription]);
            }
        });
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
        switch(event.constructor)
        {
            case OperationMaturedEvent:
                if(subscription.params.matured) {
                    // subscription wants matured operations
                    notify = true;
                }
                break;
            case OperationPendingEvent:
                if(subscription.params.pending) {
                    // subscription wants pending operations
                    notify = true;
                }
                break;
            case OperationIncludedEvent:
                if(subscription.params.included) {
                    // subscription wants pending operations
                    notify = true;
                }
                break;
            case OperationNotIncludedEvent:
                if(subscription.params.not_included) {
                    // subscription wants pending operations
                    notify = true;
                }
                break;
        }

        if(notify === true)
        {
            if(subscription.params.payload !== undefined) {
                if(event.operation.payload.toString() !== subscription.params.payload &&
                    event.operation.payloadDecrypted.toString() !== subscription.params.payload &&
                    event.operation.payload.toAscii() !== subscription.params.payload &&
                    event.operation.payloadDecrypted.toAscii() !== subscription.params.payload) {
                    notify = false;
                }
            }
        }

        return notify;
    }

    /**
     * Validates and prepares the subscription parameters.
     *
     * @param {Subscription} subscription
     */
    validateSubscription(subscription)
    {
        // mined:
        // When a pending operation gets included in a block.
        if(subscription.params.included === undefined) {
            subscription.params.included = true;
        }

        // not_mined:
        // When a pending operation does not get included
        if(subscription.params.not_included === undefined) {
            subscription.params.not_included = true;
        }

        // pending:
        // When a pending operation arrives at the node.
        if(subscription.params.pending === undefined) {
            subscription.params.pending = true;
        }

        // matured:
        // When an operation matures
        if(subscription.params.matured === undefined) {
            subscription.params.matured = false;
        }

        // pending_snapshot
        // when a client connects (s)he will get all recent pending operations.
        if(subscription.params.pending_snapshot === undefined) {
            subscription.params.pending_snapshot = true;
        }

        //subscription.params.payload
    }
}

module.exports = Operation;

