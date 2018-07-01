/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Filter = require('./Filter');

class Subscription
{
    /**
     * Constructor.
     *
     * @param {String} clientId
     * @param {String} channel
     * @param {String} channelId
     * @param {String} eventName
     * @param {String} lastKnownBlock
     * @param {Object} filters
     */
    constructor(clientId, channel, channelId, eventName, lastKnownBlock, filters = [])
    {
        this._clientId = clientId;
        this._channel = channel;
        this._channelId = channelId;
        this._eventName = eventName;
        this._lastKnownBlock = lastKnownBlock;
        this._filters = filters.map((f) => new Filter(f.field, f.type, f.value));
        this._active = false;
    }

    /**
     * Gets the clientIsnapshot depth.
     *
     * @returns {Number}
     */
    get snapshot() {
        return this._snapshot;
    }


    /**
     * Gets the clientId.
     *
     * @returns {String|*}
     */
    get clientId() {
        return this._clientId;
    }

    /**
     * Gets the name of the channel.
     *
     * @returns {String|*}
     */
    get channel() {
        return this._channel;
    }

    /**
     * Gets the params of the subscription.
     *
     * @returns {Object|*}
     */
    get params() {
        return this._params;
    }

    /**
     * Gets the id of the channel which was created for the subscription.
     *
     * @returns {String|*}
     */
    get channelId() {
        return this._channelId;
    }

    /**
     * Gets the name of the event one will listen to.
     *
     * @returns {String}
     */
    get eventName() {
        return this._eventName;
    }

    /**
     * Gets the list of filters.
     *
     * @returns {String}
     */
    get filters() {
        return this._filters;
    }

    /**
     * Gets a value indicating whether the given channel equals the recent
     * channel.
     *
     * @param {String} channel
     * @returns {boolean}
     */
    isChannel(channel) {
        return this.channel === channel;
    }

    /**
     * Gets a value indicating whether the given channel id equals the recent
     * channel id.
     *
     * @param {String} channelId
     * @returns {boolean}
     */
    isChannelId(channelId) {
        return this.channelId === channelId;
    }

    /**
     * Gets a value indicating whether the given clientId id equals the recent
     * clientId id.
     *
     * @param {String} clientId
     * @returns {boolean}
     */
    isClientId(clientId) {
        return this.clientId === clientId;
    }

    /**
     * Gets a value indicating whether the given channel does not equal the
     * recent channel.
     *
     * @param {String} channel
     * @returns {boolean}
     */
    isNotChannel(channel) {
        return this.channel !== channel;
    }

    /**
     * Gets a value indicating whether the given channel id does not equal the
     * recent channel id.
     *
     * @param {String} channelId
     * @returns {boolean}
     */
    isNotChannelId(channelId) {
        return this.channelId !== channelId;
    }

    /**
     * Gets a value indicating whether the given clientId id does not equal the
     * recent clientId id.
     *
     * @param {String} clientId
     * @returns {boolean}
     */
    isNotClientId(clientId) {
        return this.clientId !== clientId;
    }

    /**
     * Gets a value indicating whether the subscription is active.
     *
     * @returns {boolean}
     */
    isActive() {
        return this._active;
    }

    /**
     * Activates the subscription.
     */
    activate() {
        this._active = true;
    }

    /**
     * De-Activates the subscription.
     */
    deactivate() {
        this._active = false;
    }

    /**
     * Gets the serialized version of the subscription.
     *
     * @returns {Object}
     */
    serialize()
    {
        return {
            clientId: this.clientId,
            channel: this.channel,
            channelId: this.channelId,
            eventName: this.eventName,
            filters: this.filters
        };
    }
}

module.exports = Subscription;