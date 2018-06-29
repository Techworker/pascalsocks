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
     * @param {AccountNumber} accountNumber
     * @param {PublicKey} newPubkey
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, newPubkey, fee)
    {
        if(accountNumber.constructor !== AccountNumber) {
            throw new Error("Invalid account.");
        }

        this._account = null;
        this._accountNumber = accountNumber;
        this._newPubkey = newPubkey;
        this._fee = fee;
    }


    /**
     * Gets the key.
     *
     * @returns {PublicKey}
     */
    get newPubkey() {
        return this._newPubkey;
    }

    /**
     * Gets the key type.
     *
     * @returns {String}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    get account() {
        return this._account;
    }

    /**
     * Gets the key type.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Sets the accounts of the matching account numbers.
     *
     * @param {Account} account
     */
    resolveInvolvedAccount(account)
    {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            new_pubkey: this.newPubkey.serialize(),
            fee: this.fee.toString(),
        }
    }
}

module.exports = ChangeKeyByAccount;