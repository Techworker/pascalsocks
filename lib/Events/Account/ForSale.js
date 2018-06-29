/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ForSaleOperationInfo = require('../../BlockChain/OperationInfo/ForSale');

/**
 * The event for when an account is for sale.
 */
class ForSale extends AbstractEvent
{
    /**
     * Creates a new instance of the ForSale event class.
     *
     * @param {Operation} operation
     * @param {ForSaleOperationInfo} info
     */
    constructor(operation, info)
    {
        const msg = `${info.account} for sale${info.isPrivate ? ' (private sale)' : ''} ` +
            `by ${info.sellerAccount} for ${info.accountPrice}`;
        super('account.for_sale', msg, { operation, info });
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            operation: helper.serialize(this.data.operation),
            info: helper.serialize(this.data.info)
        };
    }
}

module.exports = ForSale;