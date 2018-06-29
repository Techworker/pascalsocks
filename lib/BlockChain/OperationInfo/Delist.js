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
 * The info about a "Delist account" (optype = 5) operation.
 */
class Delist
{
    /**
     * Creates a new instance of the Delist operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {PascalCurrency} accountPrice
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, accountPrice, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(accountPrice instanceof PascalCurrency)) {
            throw new Error("Invalid account price.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._account = null;
        this._accountNumber = accountNumber;
        this._accountPrice = accountPrice;
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

    get accountPrice() {
        return this._accountPrice;
    }

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

    serialize() {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            account_price: this.accountPrice.toString(),
            fee: this.fee.toString()
        }
    }
}

module.exports = Delist;