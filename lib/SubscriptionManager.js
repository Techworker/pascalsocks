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
class SubscriptionManager
{
    /**
     * Constructor.
     *
     * @param {Hashids} hashIds
     */
    constructor(hashIds)
    {
        this.subscriptions = [];
        this.subscriptionCounter = 0;
        this.hashIds = hashIds;
    }

    /**
     * Adds a single subscription with the given data and returns the created
     * Subscription instance.
     *
     * @param {String} clientId
     * @param {String} channel
     * @param {String} eventName
     * @param {Number} snapshot
     * @param {Object} filters
     * @returns {Subscription}
     */
    subscribe(clientId, channel, eventName, snapshot, filters = [])
    {
        const channelId = this.hashIds.encode(++this.subscriptionCounter);
        const subscription = new Subscription(
            clientId, channel, channelId, eventName, snapshot, filters
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
        this.unsubscribeChannelId(
            subscription.clientId,
            subscription.channel,
            subscription.channelId
        );
    }

    /**
     * Removes all subscriptions of the given clientId.
     *
     * @param {String} clientId
     */
    unsubscribeClientId(clientId)
    {
        let removed = [];
        this.subscriptions = this.subscriptions.filter(sub => {
            let keep = sub.isNotClientId(clientId);
            if(!keep) removed.push(sub);
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
    unsubscribeChannel(clientId, channel)
    {
        let removed = [];
        this.subscriptions = this.subscriptions.filter(sub => {
            let keep = (
                sub.isNotClientId(clientId) ||
                sub.isNotChannel(channel)
            );
            if(!keep) removed.push(sub);
            return keep;
        });
        //console.log(this.subscriptions);

        return removed;
    }

    /**
     * Removes all subscriptions of the given clientId and returns the removed
     * subscriptions.
     *
     * @param {String} clientId
     * @param {String} channel
     * @param {String} channelId
     *
     * @return {Array<Subscription>}
     */
    unsubscribeChannelId(clientId, channel, channelId)
    {
        let removed = [];
        this.subscriptions = this.subscriptions.filter(sub => {
            let keep = (
                sub.isNotClientId(clientId) ||
                sub.isNotChannel(channel) ||
                sub.isNotChannelId(channelId)
            );
            if(!keep) removed.push(sub);
            return keep;
        });

        return removed;
    }

    /**
     * Gets all subscriptions of the given clientId.
     *
     * @param {String} clientId
     * @returns {Array<Subscription>}
     */
    getSubscriptionsOfClientId(clientId)
    {
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
    getSubscriptionsOfChannel(channel)
    {
        return this.subscriptions.filter(
            sub => sub.isChannel(channel) && sub.isActive()
        );
    }

    /**
     * Gets a subscription identified by the given id.
     *
     * @param {String} channelId
     * @returns {Array<Subscription>}
     */
    getSubscriptionsOfChannelId(channelId)
    {
        return this.subscriptions.filter(
            sub => sub.isChannelId(channelId) && sub.isActive()
        );
    }
}

module.exports = SubscriptionManager;