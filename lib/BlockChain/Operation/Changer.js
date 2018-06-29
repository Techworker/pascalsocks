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
 * Represents a block.
 */
class Changer {
    /**
     * Creates a new instance of the Changer class.
     *
     * @param {Object} changerData
     * @param {Function} publicKeyResolver
     */
    constructor(changerData) {
        this.raw = changerData;
    }

    async init(publicKeyResolver)
    {
        this._account = new AccountNumber(this.raw.account);
        this._nOperation = parseInt(this.raw.n_operation, 10);

        if(this.raw.new_enc_pubkey === undefined) {
            this._newEncPubkey = null;
        } else {
            this._newEncPubkey = await publicKeyResolver(this.raw.new_enc_pubkey);
        }

        this._newName = this.raw.new_name;
        if(this.raw.new_name === undefined) {
            this._newName = null;
        }

        this._newType = this.raw.new_type;
        if(this.raw.new_type === undefined) {
            this._newType = null;
        }

        if(this.raw.seller_account !== undefined) {
            this._sellerAccount = new AccountNumber(this.raw.seller_account);
        } else {
            this._sellerAccount = null;
        }

        if(this.raw.account_price === undefined) {
            this._accountPrice = new PascalCurrency(0);
        } else {
            this._accountPrice = new PascalCurrency(this.raw.account_price);
        }

        if(this.raw.locked_until_block === undefined) {
            this._lockedUntilBlock = null;
        } else {
            this._lockedUntilBlock = parseInt(this.raw.locked_until_block, 10);
        }

        if(this.raw.fee === undefined) {
            this._fee = new PascalCurrency(0);
        } else {
            this._fee = new PascalCurrency(this.raw.fee);
        }

        return this;
    }

    /**
     * Gets the changed account.
     *
     * @returns {AccountNumber}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the n op of the account.
     *
     * @returns {Number}
     */
    get nOperation() {
        return this._nOperation;
    }

    /**
     * Gets the new public key.
     *
     * @returns {HexaString}
     */
    get newEncPubkey() {
        return this._newEncPubkey;
    }

    /**
     * Gets the new name.
     *
     * @returns {string}
     */
    get newName() {
        return this._newName;
    }

    /**
     * Gets the new type.
     *
     * @returns {Number}
     */
    get newType() {
        return this._newType;
    }

    /**
     * Gets the seller account.
     *
     * @returns {AccountNumber}
     */
    get sellerAccount() {
        return this._sellerAccount;
    }

    /**
     * Gets the sales price of the account.
     *
     * @returns {PascalCurrency}
     */
    get accountPrice() {
        return this._accountPrice;
    }

    /**
     * Gets the block number until the account is blocked.
     *
     * @returns {Number}
     */
    get lockedUntilBlock() {
        return this._lockedUntilBlock;
    }

    /**
     * Gets the fee for the change operation.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }
}

module.exports = Changer;