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
     * Creates a new instance of the Mined class.
     *
     * @param {Block} block
     */
    constructor(block)
    {
        super('block.mined',
            `Mined block: ${block.block}`,
            { block }
        );
    }

    /**
     * Gets the block associated to the event.
     *
     * @return {Block}
     */
    get block() {
        return this.data.block;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            block: helper.serialize(this.block)
        };
    }
}

module.exports = Mined;