/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Channel = require('../Channel');

const EventAccountBuy = require('../Events/Account/Buy');
const EventAccountChangeKey = require('../Events/Account/ChangeKey');
const EventAccountChangeName = require('../Events/Account/ChangeName');
const EventAccountChangeType = require('../Events/Account/ChangeType');
const EventAccountDelist = require('../Events/Account/Delist');
const EventAccountForSale = require('../Events/Account/ForSale');
const EventAccountTransaction = require('../Events/Account/Transaction');

/**
 * Account channel that delegates all events related to accounts.
 */
class Account extends Channel
{
    /**
     * Gets the name of the channel.
     *
     * @returns {string}
     */
    static get name() {
        return 'account';
    }

    /**
     * Gets the list of events this channel handles.
     *
     * @returns {[Event]}
     */
    static get events() {
        return [
            EventAccountBuy,
            EventAccountChangeKey,
            EventAccountChangeName,
            EventAccountChangeType,
            EventAccountDelist,
            EventAccountForSale,
            EventAccountTransaction
        ];
    }
}

module.exports = Account;