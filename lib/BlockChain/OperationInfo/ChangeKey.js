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
 * The info about a "Change Key" (optype = 2,7) operation.
 */
class ChangeKey
{
    /**
     * Creates a new instance of the ChangeKey class.
     *
     * @param {AccountNumber} accountNumber
     * @param {PublicKey} newPublicKey
     * @param {PascalCurrency} fee
     */
    constructor(accountNumber, newPublicKey, fee)
    {
        if(!(accountNumber instanceof AccountNumber)) {
            throw new Error("Invalid account.");
        }

        if(!(newPublicKey instanceof PublicKey)) {
            throw new Error("Invalid public key.");
        }

        if(!(fee instanceof PascalCurrency)) {
            throw new Error("Invalid fee.");
        }

        this._accountNumber = accountNumber;
        this._account = null;
        this._newPublicKey = newPublicKey;
        this._fee = fee;
    }

    /**
     * Gets the account number.
     *
     * @returns {AccountNumber}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the account if resolved.
     *
     * @returns {Account|null}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the new key.
     *
     * @returns {PublicKey}
     */
    get newPublicKey() {
        return this._newPublicKey;
    }

    /**
     * Gets the paid fee.
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
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }
    }

    /**
     * Gets the serialized version of this class.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            account_number: this.accountNumber.toString(),
            account: this.account !== null ? this.account.serialize() : null,
            new_public_key: this.newPublicKey.serialize(),
            fee: this.fee.toString(),
        }
    }
}

module.exports = ChangeKey;