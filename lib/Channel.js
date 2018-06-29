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
     * @param {String} ident
     * @param {EventManager} eventMgr
     * @param {SubscriptionManager} subscriptionManager
     */
    constructor(ident, eventMgr, subscriptionManager)
    {
        this._ident = ident;

        /**
         * Internal flag to avoid sequential overruns.
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
    }

    get ident() {
        return this._ident;
    }
}

module.exports = Channel;