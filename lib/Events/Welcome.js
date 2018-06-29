/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');
const helper = require('../helper');

/**
 * The welcome event that is sent to a new client.
 */
class Welcome extends AbstractEvent
{
    /**
     * Creates a new instance of the the Welcome class.
     *
     * @param {String} id
     */
    constructor(id)
    {
        super('welcome', `Welcome user ${id}`, {
            id
        });
    }

    /**
     * Gets the client id.
     *
     * @returns {String}
     */
    get id() {
        return this.data.id;
    }
    
    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return { id: this.id };
    }
}

module.exports = Welcome;