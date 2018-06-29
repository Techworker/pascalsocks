/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ChangeKeyByAccountOperationInfo = require('../../BlockChain/OperationInfo/ChangeKeyByAccount');

/**
 * The event that contains info about a ChangeKey event (optype = 2)
 */
class ChangeAccountKey extends AbstractEvent
{
    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeKeyByAccountOperationInfo} info
     */
    constructor(operation, info)
    {
        const msg = `Account aa (signer=aa) changed key to ssw`;
        super('account.change_account_key', msg, { operation, info });
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

module.exports = ChangeAccountKey;