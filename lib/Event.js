/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Block = require('../lib/BlockChain/Block');
const helper = require('../lib/helper');

/**
 * An abstract event class that provides basic methods for events.
 */
class Event
{
    /**
     * Initializes a new event object.
     *
     * @param {String} message
     */
    constructor(message)
    {
        if(this.constructor.name !== 'Included' && this.constructor.name !== 'Matured') {
            // TODO: dafuq?
            //console.log(message);
        }

        if (new.target === Event) {
            throw new TypeError('Cannot construct Event instance directly');
        }

        this._message = message;
        this._blockNumber = null;
    }

    /**
     * Returns the serialized version of this object.
     */
    serialize()
    {
        let obj = {
            event: this.name,
            message: this.message
        };

        if(this.associated !== null) {
            obj.snapshot = true;
            obj.associated = this.associated;
        }

        return JSON.stringify(Object.assign(obj, this.serializeEvent()));
    }

    /**
     * Gets the event message.
     *
     * @returns {String}
     */
    get message() {
        return this._message;
    }

    /**
     * Sets the associated block of the event.
     *
     * @param {Number} associated
     */
    set associated(associated) {
        this._blockNumber = parseInt(associated, 10);
    }

    /**
     * Gets the block number associated with the event.
     *
     * @returns {Number}
     */
    get associated() {
        return this._blockNumber;
    }

    /**
     * Abstract method that serializes event data.
     *
     * @return {Object}
     */
    serializeEvent()
    {
        throw new Error('Implement `serializeEvent` method in your event.');
    }
}

module.exports = Event;