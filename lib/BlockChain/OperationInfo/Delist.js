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
     * @param {PascalCurrency} price
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, price, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(price instanceof PascalCurrency)) {
            throw new Error("Invalid account price.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._accountNumber = accountNumber;
        this._account = null;
        this._price = price;
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
     * Gets the account if resolved.
     *
     * @returns {null|Account}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the price the account was listed for.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._accountPrice;
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
     * Gets the serialized version of this info.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            account_number: this.accountNumber.toString(),
            account: this.account !== null ? this.account.serialize() : null,
            price: this.price.serialize(),
            fee: this.fee.toString()
        }
    }
}

module.exports = Delist;