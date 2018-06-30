/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ChangeNameOpInfo = require('../../BlockChain/OperationInfo/ChangeName');

/**
 * The event that contains info about a ChangeNameAndType event (optype = 7)
 */
class ChangeName extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'account.change_name';
    }

    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeNameOpInfo} info
     */
    constructor(operation, info)
    {
        super(`Account ${info.accountNumber} changed name to ${info.newName}`);

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
            operation: this.operation.serialize(),
            info: this.info.serialize(),
        };
    }
}

module.exports = ChangeName;