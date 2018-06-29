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
 * The info about a "Buy Account" (optype = 6) operation.
 */
class BuyAccount
{
    /**
     * Creates a new instance of the Buy operation info.
     *
     * @param {AccountNumber} account
     * @param {AccountNumber} accountSeller
     * @param {AccountNumber} accountBuyer
     * @param {PascalCurrency} amount
     * @param {PascalCurrency} fee
     * @param {HexaString} payload
     */
    constructor(account, accountSeller, accountBuyer, amount, fee, payload)
    {
        if(!(account instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(accountSeller instanceof AccountNumber)) {
            throw new Error("Invalid seller account.");
        }

        if(!(accountBuyer instanceof AccountNumber)) {
            throw new Error("Invalid buyer account.");
        }

        if(!(amount instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._account = account;
        this._accountSeller = accountSeller;
        this._accountBuyer = accountBuyer;
        this._amount = amount;
        this._fee = fee;
        this._payload = payload;
    }

    /**
     * Gets the account number that was bought.
     *
     * @returns {AccountNumber}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the account number that was bought.
     *
     * @returns {AccountNumber}
     */
    get accountSeller() {
        return this._accountSeller;
    }

    /**
     * Gets the account number that was bought.
     *
     * @returns {AccountNumber}
     */
    get accountBuyer() {
        return this._accountBuyer;
    }

    /**
     * Gets the amount the account was bought for.
     *
     * @returns {PascalCurrency}
     */
    get amount() {
        return this._amount;
    }

    /**
     * Gets the amount the account was bought for.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Gets the amount the account was bought for.
     *
     * @returns {PascalCurrency}
     */
    get payload() {
        return this._payload;
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            account: this.account.toString(),
            accountBuyer: this.accountBuyer.toString(),
            accountSeller: this.accountSeller.toString(),
            amount: this.amount.toString(),
            fee: this.fee.toString(),
            payload: this.payload.toString(),
        }
    }
}

module.exports = BuyAccount;