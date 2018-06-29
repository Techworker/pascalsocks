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
 * Represents a block.
 */
class Sender {
    /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} senderData
     */
    constructor(senderData) {
        this._raw = senderData;
        this._account = null;
        this._accountNumber = new AccountNumber(senderData.account);
        this._nOperation = parseInt(senderData.n_operation, 10);
        this._amount = new PascalCurrency(senderData.amount);
        this._payload = new Payload(senderData.payload, undefined);
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

    serialize() {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            n_operation: this.nOperation,
            amount: this.amount.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null
        }
    }
}

module.exports = Sender;