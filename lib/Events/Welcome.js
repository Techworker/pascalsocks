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
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'welcome';
    }

    /**
     * Creates a new instance of the the Welcome class.
     *
     * @param {String} id
     */
    constructor(id)
    {
        super(`Welcome user ${id}`);

        this._id = id;
    }

    /**
     * Gets the client id.
     *
     * @returns {String}
     */
    get id() {
        return this._id;
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