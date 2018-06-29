/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const PascalCurrency = require('../Type/PascalCurrency');
const PublicKey = require('../PublicKey');

/**
 * The info about a "Change Key" (optype = 2) operation.
 */
class ChangeKey
{
    /**
     * Creates a new instance of the ChangeKey class.
     *
     * @param {AccountNumber} account
     * @param {PublicKey} newEncPubkey
     * @param {PascalCurrency} fee
     */
    constructor(account, newEncPubkey, fee)
    {
        if(!(account instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(newEncPubkey instanceof PublicKey)) {
            throw new Error("Invalid public key.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._fee = fee;
        this._account = account;
        this._newEncPubkey = newEncPubkey;
    }

    /**
     * Gets the key.
     *
     * @returns {PublicKey}
     */
    get newEncPubkey() {
        return this._newEncPubkey;
    }

    /**
     * Gets the key type.
     *
     * @returns {String}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the key type.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }
}

module.exports = ChangeKey;