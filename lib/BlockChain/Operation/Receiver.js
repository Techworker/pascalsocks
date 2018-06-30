/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const Payload = require('../Type/Payload');
const PascalCurrency = require('../Type/PascalCurrency');

/**
 * Represents a receiver in an operation.
 */
class Receiver
{
    /**
     * Creates a new instance of the Receiver class.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Receiver();
        instance._rpc = rpc;
        instance._account = null;
        instance._accountNumber = new AccountNumber(rpc.account);
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

    /**
     * Gets the account  of the sender.
     *
     * @returns {Account}
     */
    get account() {
        return this._account;
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
     * Tries to resolve the given account on match.
     *
     * @param {Account} account
     */
    resolveInvolvedAccount(account) {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }
    }

    /**
     * Gets the serialized version of the instance.
     *
     * @returns {Object}
     */
    serialize()
    {
        return {
            account_number: this.accountNumber.toString(),
            account: this.account !== null ? this.account.serialize() : null,
            amount: this.amount.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null
        }
    }
}

module.exports = Receiver;