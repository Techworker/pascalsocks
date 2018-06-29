/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * A simple type that holds an account number in a reliable way.
 */
class AccountNumber
{
    /**
     * Creates a new AccountNumber instance, either from an account string
     * without checksum (which can be a number), an account string with checksum
     * or another account instance.
     *
     * @param {String|Number|AccountNumber} account
     */
    constructor(account)
    {
        if(account.constructor === AccountNumber) {
            this._account = account.account;
            this._checksum = account.checksum;
        }
        else if(typeof account === 'string')
        {
            const splitted = account.split('-');
            if(splitted.length === 2) {
                this._account = parseInt(splitted[0], 10);
                this._checksum = parseInt(splitted[1], 10);
                if(this._checksum !== AccountNumber.calculateChecksum(this._account)) {
                    throw new Error(`Invalid checksum for account ${this._account}`);
                }
            } else {
                this._account = parseInt(account, 10);
                this._checksum = AccountNumber.calculateChecksum(this._account);
            }
        } else if(typeof account === 'number') {
            this._account = account;
            this._checksum = AccountNumber.calculateChecksum(this._account);
        } else {
            throw new Error(`Unable to parse Account: ${account.toString()}`);
        }
    }

    /**
     * Gets the account number.
     *
     * @returns {Number}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the checksum of the account.
     *
     * @returns {Number}
     */
    get checksum() {
        return this._checksum;
    }

    /**
     * Gets the account string.
     *
     * @returns {string}
     */
    toString() {
        return `${this.account}-${this.checksum}`;
    }

    equals(accountNumber) {
        return (accountNumber !== null &&
            this.toString() === accountNumber.toString());
    }

    /**
     * Calculates the checksum for the given account number.
     *
     * @param {Number} account
     * @returns {Number}
     */
    static calculateChecksum(account) {
        return ((account * 101) % 89) + 10;
    }
}

module.exports = AccountNumber;