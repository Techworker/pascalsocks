/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const PascalCurrency = require('../Type/PascalCurrency');
const HexaString = require('../Type/HexaString');

/**
 * The info about a "Transaction" (optype = 1) operation.
 */
class Transaction
{
    /**
     * Creates a new instance of the Buy operation info.
     *
     * @param {AccountNumber} senderAccount
     * @param {AccountNumber} destinationAccount
     * @param {PascalCurrency} amount
     * @param {PascalCurrency} fee
     * @param {HexaString} payload
     */
    constructor(senderAccount, destinationAccount, amount, fee, payload)
    {
        if(!(senderAccount instanceof AccountNumber)) {
            throw new Error("Invalid from sender account.");
        }

        if(!(destinationAccount instanceof AccountNumber)) {
            throw new Error("Invalid to destination account.");
        }

        if(!(amount instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        this._senderAccount = senderAccount;
        this._destinationAccount = destinationAccount;
        this._amount = amount;
        this._fee = fee;
        this._payload = payload;
    }

    /**
     * Gets the account number that sends the amount.
     *
     * @returns {AccountNumber}
     */
    get senderAccount() {
        return this._senderAccount;
    }

    /**
     * Gets the account number that gets the amount.
     *
     * @returns {AccountNumber}
     */
    get destinationAccount() {
        return this._destinationAccount;
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
     * Gets the payload.
     *
     * @returns {HexaString}
     */
    get payload() {
        return this._payload;
    }

    /**
     * Gets the fee.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }
}

module.exports = Transaction;