/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const DelistOperationInfo = require('../../BlockChain/OperationInfo/Delist');

/**
 * The event that contains info about a ChangeKey event (optype = 2)
 */
class Delist extends AbstractEvent
{
    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {DelistOperationInfo} info
     */
    constructor(operation, info)
    {
        super('account.delist', `Account aaa (signer=sss) delisted`, {
            operation, info
        });
    }

    /**
     * Gets the serialized version of this event.
     *
     * @returns {Object}
     */
    serializeEvent()
    {
        return {
            operation: helper.serialize(this.operation),
            info: helper.serialize(this.info)
        };
    }
}

module.exports = Delist;