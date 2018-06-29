/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

/**
 * The subscribed event that is sent to a client if a subscription was
 * successful.
 */
class Subscribed extends AbstractEvent
{
    /**
     * Creates a new instance of the the Subscribed class.
     *
     * @param {Subscription} subscription
     */
    constructor(subscription)
    {
        super('subscription.subscribed',
            `Subscribed to channel ${subscription.channel}`,
            {subscription}
        );
    }


    /**
     * Gets the subscription.
     *
     * @returns {Subscription}
     */
    get subscription() {
        return this.data.subscription;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            subscription: helper.serialize(this.subscription)
        };
    }
}

module.exports = Subscribed;