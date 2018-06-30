/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

// available events
const OperationMaturedEvent = require('../Events/Operation/Matured');
const OperationPendingEvent = require('../Events/Operation/Pending');
const OperationIncludedEvent = require('../Events/Operation/Included');
const OperationNotIncludedEvent = require('../Events/Operation/NotIncluded');

/**
 * Operation channel that delegates all events related to operations.
 */
class Operation extends Channel
{
    /**
     * Gets the name of the channel.
     *
     * @returns {string}
     */
    static get name() {
        return 'operation';
    }

    /**
     * Gets the list of events this channel handles.
     *
     * @returns {[Event]}
     */
    static get events() {
        return [
            OperationMaturedEvent,
            OperationPendingEvent,
            OperationIncludedEvent,
            OperationNotIncludedEvent
        ];
    }
}

module.exports = Operation;