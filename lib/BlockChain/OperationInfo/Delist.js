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
 * The info about a "Delist account" (optype = 5) operation.
 */
class Delist
{
    /**
     * Creates a new instance of the Delist operation info.
     *
     * @param {AccountNumber} account
     * @param {PascalCurrency} accountPrice
     * @param {PascalCurrency} fee
     */
    constructor(account, accountPrice, fee)
    {
        if(!(account instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(accountPrice instanceof PascalCurrency)) {
            throw new Error("Invalid account price.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._account = account;
        this._accountPrice = accountPrice;
        this._fee = fee;
    }

    /**
     * Gets the account number.
     *
     * @returns {AccountNumber}
     */
    get account() {
        return this._account;
    }

    get accountPrice() {
        return this._accountPrice;
    }

    get fee() {
        return this._fee;
    }
}

module.exports = Delist;