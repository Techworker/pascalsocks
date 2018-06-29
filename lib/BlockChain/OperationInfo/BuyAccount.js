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
     * @param {AccountNumber} accountNumber
     * @param {AccountNumber} accountSellerNumber
     * @param {AccountNumber} accountBuyerNumber
     * @param {PascalCurrency} amount
     * @param {PascalCurrency} fee
     * @param {Payload} payload
     */
    constructor(accountNumber, accountSellerNumber, accountBuyerNumber, amount, fee, payload)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(accountSellerNumber instanceof AccountNumber)) {
            throw new Error("Invalid seller account.");
        }

        if(!(accountBuyerNumber instanceof AccountNumber)) {
            throw new Error("Invalid buyer account.");
        }

        if(!(amount instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._account = null;
        this._accountNumber = accountNumber;
        this._accountSeller = null;
        this._accountSellerNumber = accountSellerNumber;
        this._accountBuyer = null;
        this._accountBuyerNumber = accountBuyerNumber;
        this._amount = amount;
        this._fee = fee;
        this._payload = payload;
    }

    /**
     * Gets the account number that was bought.
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
     * Gets the account number that was bought.
     *
     * @returns {AccountNumber}
     */
    get accountSellerNumber() {
        return this._accountSellerNumber;
    }

    get accountSeller() {
        return this._accountSeller;
    }

    /**
     * Gets the account number that was bought.
     *
     * @returns {AccountNumber}
     */
    get accountBuyerNumber() {
        return this._accountBuyerNumber;
    }

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
     * @returns {Payload}
     */
    get payload() {
        return this._payload;
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
        if(account.accountNumber.equals(this.accountBuyerNumber)) {
            this._accountBuyer = account;
        }
        if(account.accountNumber.equals(this.accountSellerNumber)) {
            this._accountSeller = account;
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
            account_buyer: this.accountBuyer !== null ? this.accountBuyer.serialize() : null,
            account_buyer_number: this.accountBuyerNumber.toString(),
            account_seller: this.accountSeller !== null ? this.accountSeller.serialize() : null,
            account_seller_number: this.accountSellerNumber.toString(),
            amount: this.amount.toString(),
            fee: this.fee.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null,
        }
    }
}

module.exports = BuyAccount;