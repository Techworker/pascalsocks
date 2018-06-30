/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const Helper = require('../../helper');

/**
 * The error event that is sent to a client if a subscription was
 * successful.
 */
class Error extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'subscription.error';
    }

    /**
     * Creates a new instance of the the Error class.
     *
     * @param {String} message
     */
    constructor(message)
    {
        super(message);
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {};
    }
}

module.exports = Error;