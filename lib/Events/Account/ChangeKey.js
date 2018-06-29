/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ChangeKeyOperationInfo = require('../../BlockChain/OperationInfo/ChangeKey');

/**
 * The event that contains info about a ChangeKey event (optype = 2)
 */
class ChangeKey extends AbstractEvent
{
    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeKeyOperationInfo} info
     */
    constructor(operation, info)
    {
        super('account.change_key', `Account ${info.accountNumber} changed key`, {
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
            operation: helper.serialize(this.data.operation),
            info: helper.serialize(this.data.info),
        };
    }
}

module.exports = ChangeKey;