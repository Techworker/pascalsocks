/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ForSaleOpInfo = require('../../BlockChain/OperationInfo/ForSale');

/**
 * The event for when an account is for sale.
 */
class ForSale extends AbstractEvent
{
    /**
     * Gets the name of the event.
     *
     * @return {String}
     */
    static name() {
        return 'account.for_sale';
    }

    /**
     * Creates a new instance of the ForSale event class.
     *
     * @param {Operation} operation
     * @param {ForSaleOpInfo} info
     */
    constructor(operation, info)
    {
        super(`${info.accountNumber} for sale${info.isPrivate ? ' (private sale)' : ''} ` +
            `by ${info.sellerAccountNumber} for ${info.accountPrice}`);

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

module.exports = ForSale;