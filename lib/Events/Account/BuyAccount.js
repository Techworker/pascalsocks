/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const BuyAccountOperationInfo = require('../../BlockChain/OperationInfo/BuyAccount')

/**
 * The event that contains info about a ChangeKey event (optype = 2)
 */
class BuyAccount extends AbstractEvent
{
    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {BuyAccountOperationInfo} info
     */
    constructor(operation, info)
    {
        const msg = `Account ${info.accountBuyer} bought ${info.account} for ${info.amount}`;
        console.log(msg);
        super('account.buy', msg, { operation, info });
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
            info: helper.serialize(this.data.info),
        };
    }
}

module.exports = BuyAccount;