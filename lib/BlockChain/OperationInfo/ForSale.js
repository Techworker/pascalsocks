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
     * @param {AccountNumber} account
     * @param {PascalCurrency} accountPrice
     * @param {AccountNumber} sellerAccount
     * @param {Boolean} isPrivate
     * @param {Number} lockedUntilBlock
     * @param {PascalCurrency} fee
     */
    constructor(account, accountPrice, sellerAccount, isPrivate = false, lockedUntilBlock, fee)
    {
        if(!(account instanceof AccountNumber)) {
            throw new Error("Invalid account for sale.");
        }

        if(!(sellerAccount instanceof AccountNumber)) {
            throw new Error("Invalid account seller.");
        }

        if(!(accountPrice instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        this._account = account;
        this._accountPrice = accountPrice;
        this._sellerAccount = sellerAccount;
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
     * Gets the account that is for sale.
     *
     * @returns {AccountNumber}
     */
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
}

module.exports = ForSale;