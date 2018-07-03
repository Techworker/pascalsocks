/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ChangeTypeOpInfo = require('../../BlockChain/OperationInfo/ChangeType');

/**
 * The event that contains info about a ChangeNameAndType event (optype = 7)
 */
class ChangeType extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'account.change_type';
    }

    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeTypeOpInfo} info
     */
    constructor(operation, info)
    {
        super(`Account ${info.accountNumber} changed type to ${info.newType}`);

        this._operation = operation;
        this._info = info;
    }

    /**
     * Gets the operation.
     *
     * @return {Operation}
     */
    get operation() {
        return this._operation;
    }

    /**
     * Gets the operation.
     *
     * @return {ChangeKeyOpInfo}
     */
    get info() {
        return this._info;
    }

    /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    serializeEvent(chain)
    {
        return {
            operation: this.operation,
            info: this.info,
        };
    }
}

module.exports = ChangeType;