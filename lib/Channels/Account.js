/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

const AccountBuy = require('../Events/Account/BuyAccount');
const AccountChangeAccountKey = require('../Events/Account/ChangeAccountKey');
const AccountChangeKey = require('../Events/Account/ChangeKey');
const AccountChangeNameAndType = require('../Events/Account/ChangeNameAndType');
const AccountDelist = require('../Events/Account/Delist');
const AccountForSale = require('../Events/Account/ForSale');

/**
 * Pendings channel that one can subscribe to when he wants immediate info about
 * new pending operations.
 */
class Account extends Channel {
    /**
     * Constructor
     *
     * @param {EventManager} eventMgr
     * @param {SubscriptionManager} subscriptionManager
     */
    constructor(eventMgr, subscriptionManager)
    {
        super('account', eventMgr, subscriptionManager);

        eventMgr.on('account.buy', this.react.bind(this));
        eventMgr.on('account.change_account_key', this.react.bind(this));
        eventMgr.on('account.change_key', this.react.bind(this));
        eventMgr.on('account.change_name_and_type', this.react.bind(this));
        eventMgr.on('account.delist', this.react.bind(this));
        eventMgr.on('account.for_sale', this.react.bind(this));
    }

    /**
     * Syncs the locally saled pendng operations with the recent ones and
     * emits and event for each pending operation.
     */
    react(event) {
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
            case AccountBuy:
                if(subscription.params.buy) {
                    notify = true;
                }
                break;
            case AccountChangeAccountKey:
                if(subscription.params.change_account_key) {
                    notify = true;
                }
                break;
            case AccountChangeKey:
                if(subscription.params.change_key) {
                    notify = true;
                }
                break;
            case AccountChangeNameAndType:
                if(subscription.params.change_name_and_type) {
                    notify = true;
                }
                break;
            case AccountDelist:
                if(subscription.params.delist) {
                    notify = true;
                }
                break;
            case AccountForSale:
                if(subscription.params.for_sale) {
                    notify = true;
                }
                break;
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
            [AccountBuy, AccountChangeAccountKey, AccountChangeKey, AccountChangeNameAndType, AccountDelist, AccountForSale], subscription.params.snapshot
        );

        snapshotEvents.forEach((event) => {
            if (this.subscriptionWantsEvent(subscription, event)) {
                this.eventMgr.notify(event, [subscription]);
            }
        });


        // get all snapshot events
        const recentEvents = this.eventMgr.getRecentEvents([AccountBuy, AccountChangeAccountKey, AccountChangeKey, AccountChangeNameAndType, AccountDelist, AccountForSale]);
        recentEvents.forEach((event) => {
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
    validateSubscription(subscription) {
        if(subscription.params.buy === undefined) {
            subscription.params.buy = true;
        }
        if(subscription.params.change_account_key === undefined) {
            subscription.params.change_account_key = true;
        }
        if(subscription.params.change_key === undefined) {
            subscription.params.change_key = true;
        }
        if(subscription.params.change_name_and_type === undefined) {
            subscription.params.change_name_and_type = true;
        }
        if(subscription.params.delist === undefined) {
            subscription.params.delist = true;
        }
        if(subscription.params.for_sale === undefined) {
            subscription.params.for_sale = true;
        }
    }
}

module.exports = Account;

