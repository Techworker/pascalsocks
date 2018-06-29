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
     * @param {AccountNumber} senderAccountNumber
     * @param {AccountNumber} destinationAccountNumber
     * @param {PascalCurrency} amount
     * @param {PascalCurrency} fee
     * @param {HexaString} payload
     */
    constructor(senderAccountNumber, destinationAccountNumber, amount, fee, payload)
    {
        if(!(senderAccountNumber instanceof AccountNumber)) {
            throw new Error("Invalid from sender account.");
        }

        if(!(destinationAccountNumber instanceof AccountNumber)) {
            throw new Error("Invalid to destination account.");
        }

        if(!(amount instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        this._senderAccount = null;
        this._senderAccountNumber = senderAccountNumber;
        this._destinationAccount = null;
        this._destinationAccountNumber = destinationAccountNumber;
        this._amount = amount;
        this._fee = fee;
        this._payload = payload;
    }

    /**
     * Gets the account number that sends the amount.
     *
     * @returns {AccountNumber}
     */
    get senderAccountNumber() {
        return this._senderAccountNumber;
    }

    get senderAccount() {
        return this._senderAccount;
    }

    /**
     * Gets the account number that gets the amount.
     *
     * @returns {AccountNumber}
     */
    get destinationAccountNumber() {
        return this._destinationAccountNumber;
    }

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

    /**
     * Sets the accounts of the matching account numbers.
     *
     * @param {Account} account
     */
    resolveInvolvedAccount(account)
    {
        if(account.accountNumber.equals(this.senderAccountNumber)) {
            this._senderAccount = account;
        }
        if(account.accountNumber.equals(this.destinationAccountNumber)) {
            this._destinationAccount = account;
        }
    }

    serialize() {
        return {
            sender_account: this.senderAccount !== null ? this.senderAccount.serialize() : null,
            sender_account_number: this.senderAccountNumber.toString(),
            destination_account: this.destinationAccount !== null ? this.destinationAccount : null,
            destination_account_number: this.destinationAccountNumber.toString(),
            amount: this.amount.toString(),
            fee: this.fee.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null
        };
    }
}

module.exports = Transaction;