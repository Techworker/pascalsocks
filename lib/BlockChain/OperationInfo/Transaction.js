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
const Payload = require('../Type/Payload');

/**
 * The info about a "Transaction" (optype = 1) operation.
 */
class Transaction
{
    /**
     * Creates a new instance of the Transaction operation info.
     *
     * @param {AccountNumber} accountNumberSender
     * @param {AccountNumber} accountNumberReceiver
     * @param {PascalCurrency} amount
     * @param {PascalCurrency} fee
     * @param {Payload} payload
     */
    constructor(accountNumberSender, accountNumberReceiver,
                amount, fee, payload)
    {
        if(!(accountNumberSender instanceof AccountNumber)) {
            throw new Error("Invalid sender account.");
        }

        if(!(accountNumberReceiver instanceof AccountNumber)) {
            throw new Error("Invalid receiver account.");
        }

        if(!(amount instanceof PascalCurrency)) {
            throw new Error("Invalid amount.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        if(!(payload instanceof Payload)) {
            throw new Error("Invalid payload.");
        }

        this._accountNumberSender = accountNumberSender;
        this._accountNumberReceiver = accountNumberReceiver;
        this._amount = amount;
        this._fee = fee;
        this._payload = payload;
    }

    /**
     * Gets the account number that sends the amount.
     *
     * @returns {AccountNumber}
     */
    get accountNumberSender() {
        return this._accountNumberSender;
    }

    /**
     * Gets the account number that gets the amount.
     *
     * @returns {AccountNumber}
     */
    get accountNumberReceiver() {
        return this._accountNumberReceiver;
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
     * Gets the fee.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Gets the payload.
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
        if(account.accountNumber.equals(this.senderAccountNumber)) {
            this._senderAccount = account;
        }
        if(account.accountNumber.equals(this.destinationAccountNumber)) {
            this._destinationAccount = account;
        }
    }

    /**
     * Gets the serialized version of the instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain) {
        const accountSender = await chain.getAccount(this.accountNumberSender);
        const accountReceiver = await chain.getAccount(this.accountNumberSender);

        return {
            type: 'operation_info.transaction',
            account_number_sender: this.accountNumberSender.toString(),
            account_sender: accountSender !== null ? await accountSender.serialize(chain) : null,
            account_number_receiver: this.accountNumberReceiver.toString(),
            account_receiver: accountReceiver !== null ? await accountReceiver.serialize(chain) : null,
            amount: this.amount.toMolina(),
            fee: this.fee.toMolina(),
            payload: this.payload !== null ? this.payload.serialize() : null
        };
    }
}

module.exports = Transaction;