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
 * Represents a receiver.
 */
class Receiver
{
    /**
     * Creates a new instance of the Receiver class.
     *
     * @param {Object} receiverData
     */
    constructor(receiverData)
    {
        this._raw = receiverData;
        this._account = null;
        this._accountNumber = new AccountNumber(receiverData.account);
        this._amount = new PascalCurrency(receiverData.amount);
        this._payload = new Payload(receiverData.payload, undefined)

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
     *
     * @param {Account} account
     */
    resolveInvolvedAccount(account) {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }
    }

    serialize()
    {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            amount: this.amount.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null
        }
    }
}

module.exports = Receiver;