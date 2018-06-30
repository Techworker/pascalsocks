/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const BuyOpInfo = require('../../BlockChain/OperationInfo/Buy');

/**
 * The event gets fired when an account is bought on the chain.
 */
class Buy extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'account.buy';
    }

    /**
     * Creates a new instance of the Buy class.
     *
     * @param {Operation} operation
     * @param {BuyOpInfo} info
     */
    constructor(operation, info)
    {
        super(`Account ${info.accountBuyerNumber} bought ${info.accountNumber} for ${info.amount}`);
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
     * @return {BuyOpInfo}
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

module.exports = Buy;