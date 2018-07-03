/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const TransactionOpInfo = require('../../BlockChain/OperationInfo/Transaction');

/**
 * The event that contains info about a ChangeKey event (optype = 2)
 */
class Transaction extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'account.transaction';
    }

    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {TransactionOpInfo} info
     */
    constructor(operation, info)
    {
        super(`Account ${info.senderAccountNumber} sent ${info.amount} to ${info.destinationAccountNumber} (fee=${info.fee})`);

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
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            operation: this.operation,
            info: this.info,
        };
    }
}

module.exports = Transaction;