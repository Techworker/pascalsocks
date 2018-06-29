/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const HexaString = require('../Type/HexaString');
const PascalCurrency = require('../Type/PascalCurrency');

/**
 * Represents a receiver.
 */
class Receiver
{
    /**
     * Creates a new instance of the Receiver class.
     *
     * @param {Object} senderData
     * @param {Function} payloadResolver
     */
    constructor(senderData) {
        this.raw = senderData;
    }

    async init(payloadResolver) {
        this._account = new AccountNumber(this.raw.account);
        this._amount = new PascalCurrency(this.raw.amount);
        this._payload = await payloadResolver(this.raw.payload);
        return this;
    }

    /**
     * Gets the account  of the sender.
     *
     * @returns {AccountNumber}
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

}

module.exports = Receiver;