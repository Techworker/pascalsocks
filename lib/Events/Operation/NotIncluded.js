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
class NotIncluded extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'operation.not_included';
    }

    /**
     * Creates a new instance of the NotIncluded class.
     *
     * @param {Operation} operation
     */
    constructor(operation)
    {
        super(`Pending operation not included: ${operation.op_hash}`);

        this._operation = operation;
    }

    /**
     * Gets the operation.
     *
     * @returns {Operation}
     */
    get operation() {
        return this._operation;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            operation: this.operation,
        };
    }
}

module.exports = NotIncluded;