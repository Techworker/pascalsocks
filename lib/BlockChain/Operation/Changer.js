/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../Type/AccountNumber');
const PublicKey = require('../PublicKey');
const PascalCurrency = require('../Type/PascalCurrency');

/**
 * Represents a block.
 */
class Changer {
    /**
     * Creates a new instance of the Changer class.
     *
     * @param {Object} changerData
     */
    constructor(changerData)
    {
        this._raw = changerData;
        this._account = null;
        this._accountNumber = new AccountNumber(changerData.account);
        this._nOperation = parseInt(changerData.n_operation, 10);

        if(changerData.new_enc_pubkey === undefined) {
            this._newPubkey = null;
        } else {
            this._newPubkey = PublicKey.fromLocal(changerData.new_enc_pubkey);
        }

        this._newName = changerData.new_name;
        if(changerData.new_name === undefined) {
            this._newName = null;
        }

        this._newType = changerData.new_type;
        if(changerData.new_type === undefined) {
            this._newType = null;
        }

        this._sellerAccount = null;
        if(changerData.seller_account !== undefined) {
            this._sellerAccountNumber = new AccountNumber(changerData.seller_account);
        } else {
            this._sellerAccountNumber = null;
        }

        if(changerData.account_price === undefined) {
            this._accountPrice = new PascalCurrency(0);
        } else {
            this._accountPrice = new PascalCurrency(changerData.account_price);
        }

        if(changerData.locked_until_block === undefined) {
            this._lockedUntilBlock = null;
        } else {
            this._lockedUntilBlock = parseInt(changerData.locked_until_block, 10);
        }

        if(changerData.fee === undefined) {
            this._fee = new PascalCurrency(0);
        } else {
            this._fee = new PascalCurrency(changerData.fee);
        }

        return this;
    }

    /**
     * Gets the changed account.
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
     * @returns {PublicKey}
     */
    get newPubkey() {
        return this._newPubkey;
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
    get sellerAccountNumber() {
        return this._sellerAccountNumber;
    }

    /**
     * Gets the seller account.
     *
     * @returns {Account}
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

    /**
     *
     * @param {Account} account
     */
    resolveInvolvedAccount(account)
    {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }
        if(account.accountNumber.equals(this.sellerAccountNumber)) {
            this._sellerAccount = account;
        }
    }

    serialize()
    {
        return {
            account: this.account !== null ? this.account.serialize() : null,
            account_number: this.accountNumber.toString(),
            n_operation: this.nOperation,
            new_pubkey: this.newPubkey !== null ? this.newPubkey.serialize() : null,
            new_name: this.newName,
            new_type: this.newType,
            seller_account: this.sellerAccount !== null ? this.sellerAccount.serialize() : null,
            seller_account_number: this.sellerAccountNumber !== null ? this.sellerAccountNumber.toString() : null,
            account_price: this.accountPrice.toString(),
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toString()
        }
    }
}

module.exports = Changer;