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
 * The info about an account that is for sale now (optype = 4).
 */
class ForSale
{
    /**
     * Creates a new instance ForSale operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {PascalCurrency} price
     * @param {AccountNumber} sellerAccountNumber
     * @param {Boolean} isPrivate
     * @param {Number} lockedUntilBlock
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, price, sellerAccountNumber,
                isPrivate, lockedUntilBlock, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account for sale.");
        }

        if(!(sellerAccountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account seller.");
        }

        if(!(price instanceof PascalCurrency)) {
            throw new Error("Invalid price.");
        }

        this._accountNumber = accountNumber;
        this._account = null;
        this._price = price;
        this._sellerAccountNumber = sellerAccountNumber;
        this._sellerAccount = null;
        this._isPrivate = isPrivate;
        this._lockedUntilBlock = lockedUntilBlock;
        this._fee = fee;
    }


    /**
     * Gets the account number of the account that is for sale.
     *
     * @returns {AccountNumber}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     *Gets the account object of the account that is for sale (if resolved).
     *
     * @returns {null|Account}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the price the account can be bought for.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._price;
    }

    /**
     * Gets the account number that sells the account.
     *
     * @returns {AccountNumber}
     */
    get sellerAccountNumber() {
        return this._sellerAccountNumber;
    }

    /**
     * Gets the account object that sells the account (if resolved).
     *
     * @returns {Account|null}
     */
    get sellerAccount() {
        return this._sellerAccount;
    }

    /**
     * Gets a flag indicating whether it is a private sale.
     *
     * @returns {Boolean}
     */
    get isPrivate() {
        return this._isPrivate;
    }

    /**
     * Gets the block number until the account is blocked.
     *
     * @returns {Number}
     */
    get lockedUntilBlock() {
        return this._lockedUntilBlock;
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
        if(account.accountNumber.equals(this.sellerAccountNumber)) {
            this._sellerAccount = account;
        }
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize()
    {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            price: this.price.serialize(),
            seller_account: this.sellerAccount !== null ? this.sellerAccount.serialize() : null,
            seller_account_number: this.sellerAccountNumber.toString(),
            is_private: this.isPrivate,
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toString(),
        }
    }
}

module.exports = ForSale;