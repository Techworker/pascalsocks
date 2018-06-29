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
 * The info about an account that is for sale now (optype = 4) operation.
 */
class ForSale
{
    /**
     * Creates a new instance ForSale operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {PascalCurrency} accountPrice
     * @param {AccountNumber} sellerAccountNumber
     * @param {Boolean} isPrivate
     * @param {Number} lockedUntilBlock
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, accountPrice, sellerAccountNumber, isPrivate = false, lockedUntilBlock, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account for sale.");
        }

        if(!(sellerAccountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account seller.");
        }

        if(!(accountPrice instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        this._account = null;
        this._accountNumber = accountNumber;
        this._accountPrice = accountPrice;
        this._sellerAccount = null;
        this._sellerAccountNumber = sellerAccountNumber;
        this._isPrivate = isPrivate;
        this._lockedUntilBlock = lockedUntilBlock;
        this._fee = fee;
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
     * Gets the fee.
     *
     * @returns {Number}
     */
    get lockedUntilBlock() {
        return this._lockedUntilBlock;
    }

    /**
     * Gets the account that is for sale.
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
     * Gets the amount of PascalCurrency the account can be bought for.
     *
     * @returns {PascalCurrency}
     */
    get accountPrice() {
        return this._accountPrice;
    }

    /**
     * Gets the account that sells the account.
     *
     * @returns {AccountNumber}
     */
    get sellerAccountNumber() {
        return this._sellerAccountNumber;
    }

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

    serialize()
    {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            account_price: this.accountPrice.toString(),
            seller_account: this.sellerAccount !== null ? this.sellerAccount.serialize() : null,
            seller_account_number: this.sellerAccountNumber.toString(),
            is_private: this.isPrivate,
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toString(),
        }
    }
}

module.exports = ForSale;