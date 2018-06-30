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
 * The event that contains a mined block.
 */
class Mined extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'block.mined';
    }

    /**
     * Creates a new instance of the Mined class.
     *
     * @param {Block} block
     */
    constructor(block)
    {
        super(`Mined block: ${block.blockNumber}`);

        this._block = block;
    }

    /**
     * Gets the block associated to the event.
     *
     * @return {Block}
     */
    get block() {
        return this._block;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            block: this.block.serialize(),
        };
    }
}

module.exports = Mined;