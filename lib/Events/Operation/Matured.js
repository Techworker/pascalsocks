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
 * The event that contains a pending operation.
 */
class Matured extends AbstractEvent
{
    /**
     * Creates a new instance of the Included class.
     *
     * @param {Operation} operation
     */
    constructor(operation)
    {
        super('operation.matured',
            `Operation matured: ${operation.opHash}`,
            { operation }
        );
    }

    /**
     * Gets the operation.
     *
     * @returns {Operation}
     */
    get operation() {
        return this.data.operation;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            operation: helper.serialize(this.operation)
        };
    }
}

module.exports = Matured;