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
 * Represents a Sender in an operation.
 */
class Sender {
    /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Sender();

        instance._rpc = rpc;
        instance._account = null;
        instance._accountNumber = new AccountNumber(rpc.account);
        instance._nOperation = parseInt(rpc.n_operation, 10);
        instance._amount = new PascalCurrency(rpc.amount);
        instance._payload = Payload.createFromRPCValue(rpc.payload);

        return instance;
    }

    /**
     * Gets the account  of the sender.
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
     * Gets the n operation of the sender.
     *
     * @returns {Number}
     */
    get nOperation() {
        return this._nOperation;
    }

    /**
     * Gets the amount.
     *
     * @returns {PascalCurrency}
     */
    get amount() {
        return this._amount;
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
     * Gets the serialized version of this instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain) {
        const account = await chain.getAccount(this.accountNumber);
        return {
            account_number: this.accountNumber.toString(),
            account: account !== null ? await account.serialize(chain) : null,
            n_operation: this.nOperation,
            amount: this.amount.toMolina(),
            payload: this.payload !== null ? this.payload.serialize() : null
        }
    }
}

module.exports = Sender;