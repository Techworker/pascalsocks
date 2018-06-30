/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

const BlockMinedEvent = require('../Events/Block/Mined');

/**
 * Block channel that delegates all events related to blocks.
 */
class Block extends Channel
{
    /**
     * Gets the name of the channel.
     *
     * @returns {string}
     */
    static get name() {
        return 'block';
    }

    /**
     * Gets the list of events this channel will handle.
     *
     * @returns {[Event]}
     */
    static get events() {
        return [
            BlockMinedEvent
        ]
    }
}

module.exports = Block;

