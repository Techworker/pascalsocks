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
 * The info about a "Change Name" or "Change Type" (optype = 8) operation.
 */
class ChangeAccountInfo
{
    /**
     * Creates a new instance of the ChangeAccountInfo operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {string} newName
     * @param {Number} newType
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, newName, newType, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._account = null;
        this._accountNumber = accountNumber;
        this._newName = newName;
        this._newType = newType;
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
     * Gets the new Type of the account.
     *
     * @returns {Boolean}
     */
    get newType() {
        return this._newType;
    }

    /**
     * Gets the fee.
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
            new_name: this.newName,
            new_type: this.newType,
            fee: this.fee.toString()
        }
    }
}

module.exports = ChangeAccountInfo;