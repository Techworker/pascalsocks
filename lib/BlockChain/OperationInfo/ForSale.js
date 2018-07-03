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
     * @param {AccountNumber} accountNumberSeller
     * @param {Boolean} isPrivate
     * @param {Number} lockedUntilBlock
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, price, accountNumberSeller,
                isPrivate, lockedUntilBlock, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account for sale.");
        }

        if(!(accountNumberSeller instanceof AccountNumber)) {
            throw new Error("Invalid account seller.");
        }

        if(!(price instanceof PascalCurrency)) {
            throw new Error("Invalid price.");
        }

        this._accountNumber = accountNumber;
        this._price = price;
        this._accountNumberSeller = accountNumberSeller;
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
    get accountNumberSeller() {
        return this._accountNumberSeller;
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
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain)
    {
        const account = await chain.getAccount(this.accountNumber);
        const accountSeller = await chain.getAccount(this.accountNumberSeller);

        return {
            type: 'operation_info.for_sale',
            account_number: this.accountNumber.toString(),
            account: account !== null ? await account.serialize(chain) : null,
            price: this.price.toMolina(),
            account_number_seller: this.accountNumberSeller.toString(),
            account_seller: accountSeller !== null ? await accountSeller.serialize(chain) : null,
            is_private: this.isPrivate,
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toMolina(),
        }
    }
}

module.exports = ForSale;