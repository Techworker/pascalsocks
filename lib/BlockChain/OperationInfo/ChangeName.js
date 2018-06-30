/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const PascalCurrency = require('../Type/PascalCurrency');

/**
 * The info about a "Change Name" (optype = 8) operation.
 */
class ChangeName
{
    /**
     * Creates a new instance of the ChangeName operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {string} newName
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, newName, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._accountNumber = accountNumber;
        this._account = null;
        this._newName = newName;
        this._fee = fee;
    }

    /**
     * Gets the account number.
     *
     * @returns {AccountNumber}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the account.
     *
     * @returns {Account|*|null}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the new name of the account.
     *
     * @returns {Boolean}
     */
    get newName() {
        return this._newName;
    }

    /**
     * Gets the fee paid for the operation.
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
            account_number: this.accountNumber.toString(),
            account: this.account !== null ? this.account.serialize() : null,
            new_name: this.newName,
            fee: this.fee.toString()
        }
    }
}

module.exports = ChangeName;