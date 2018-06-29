/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');

/**
 * The info about a "Change Key" (optype = 7) operation.
 */
class ChangeKeyByAccount
{
    /**
     * Creates a new instance of the ChangeKey class.
     *
     * @param {AccountNumber} account
     */
    constructor(account, newEncPubkey, fee)
    {
        if(account.constructor !== AccountNumber) {
            throw new Error("Invalid account.");
        }

        this._account = account;
        this._newEncPubKey = newEncPubkey;
        this._fee = fee;
    }

    /**
     * Gets the account number.
     *
     * @returns {AccountNumber}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            account: this.account.toString(),
            key_type: this.keyType
        }
    }
}

module.exports = ChangeKeyByAccount;