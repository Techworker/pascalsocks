/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../../Event');
const helper = require('../../helper');

const ChangeAccountInfoOperationInfo = require('../../BlockChain/OperationInfo/ChangeAccountInfo');

/**
 * The event that contains info about a ChangeNameAndType event (optype = 7)
 */
class ChangeNameAndType extends AbstractEvent
{
    /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeAccountInfoOperationInfo} info
     */
    constructor(operation, info)
    {
        const msg = `Account ${info.account} changed type and/or name`;
        super('account.change_name_and_type', msg, { operation, info });
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

module.exports = ChangeNameAndType;