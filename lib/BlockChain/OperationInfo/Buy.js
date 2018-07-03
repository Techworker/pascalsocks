/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const PascalCurrency = require('../Type/PascalCurrency');
const Payload = require('../Type/Payload');

/**
 * The info about a "Buy Account" (optype = 6) operation.
 */
class Buy
{
    /**
     * Creates a new instance of the Buy operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {AccountNumber} accountNumberSeller
     * @param {AccountNumber} accountNumberBuyer
     * @param {PascalCurrency} price
     * @param {PascalCurrency} fee
     * @param {Payload} payload
     */
    constructor(accountNumber, accountNumberSeller, accountNumberBuyer,
                price, fee, payload)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(accountNumberSeller instanceof AccountNumber)) {
            throw new Error("Invalid seller account.");
        }

        if(!(accountNumberBuyer instanceof AccountNumber)) {
            throw new Error("Invalid buyer account.");
        }

        if(!(price instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        if(!(payload instanceof Payload)) {
            throw new Error("Invalid payload.");
        }

        this._accountNumber = accountNumber;
        this._accountNumberSeller = accountNumberSeller;
        this._accountNumberBuyer = accountNumberBuyer;
        this._price = price;
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

    /**
     * Gets the account number of the seller.
     *
     * @returns {AccountNumber}
     */
    get accountNumberSeller() {
        return this._accountNumberSeller;
    }

    /**
     * Gets the account number of the buyer.
     *
     * @returns {AccountNumber}
     */
    get accountNumberBuyer() {
        return this._accountNumberBuyer;
    }

    /**
     * Gets the price the account was bought for.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._price;
    }

    /**
     * Gets the amount the fee that was paid.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Gets the payload of the buy account operation.
     *
     * @returns {Payload}
     */
    get payload() {
        return this._payload;
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain) {
        const account = await chain.getAccount(this.accountNumber);
        const accountBuyer = await chain.getAccount(this.accountNumberBuyer);
        const accountSeller = await chain.getAccount(this.accountNumberSeller);
        return {
            type: 'operation_info.buy',
            account_number: this.accountNumber.toString(),
            account: account !== null ? await account.serialize(chain) : null,
            account_buyer_number: this.accountNumberBuyer.toString(),
            account_buyer: accountBuyer !== null ? await accountBuyer.serialize(chain) : null,
            account_seller_number: this.accountNumberSeller.toString(),
            account_seller: accountSeller !== null ? await accountSeller.serialize(chain) : null,
            price: this.price.toMolina(),
            fee: this.fee.toMolina(),
            payload: this.payload !== null ? this.payload.serialize() : null,
        }
    }
}

module.exports = Buy;