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
 * Represents a Changer in an operation.
 *
 * @alias Changer2
 */
class Changer
{
    /**
     * Creates a new instance of the Changer class.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Changer();

        instance._rpc = rpc;
        instance._accountNumber = new AccountNumber(rpc.account);
        instance._account = null;
        instance._nOperation = parseInt(rpc.n_operation, 10);

        if(rpc.new_enc_pubkey === undefined) {
            instance._newPublicKey = null;
        } else {
            instance._newPublicKey = PublicKey.createFromRPCValue(rpc.new_enc_pubkey);
        }

        instance._newName = rpc.new_name;
        if(rpc.new_name === undefined) {
            instance._newName = null;
        }

        instance._newType = rpc.new_type;
        if(rpc.new_type === undefined) {
            instance._newType = null;
        }

        instance._sellerAccount = null;
        if(rpc.seller_account !== undefined) {
            instance._sellerAccountNumber = new AccountNumber(rpc.seller_account);
        } else {
            instance._sellerAccountNumber = null;
        }

        if(rpc.account_price === undefined) {
            instance._accountPrice = new PascalCurrency(0);
        } else {
            instance._accountPrice = new PascalCurrency(rpc.account_price);
        }

        if(rpc.locked_until_block === undefined) {
            instance._lockedUntilBlock = null;
        } else {
            instance._lockedUntilBlock = parseInt(rpc.locked_until_block, 10);
        }

        if(rpc.fee === undefined) {
            instance._fee = new PascalCurrency(0);
        } else {
            instance._fee = new PascalCurrency(rpc.fee);
        }

        return instance;
    }

    /**
     * Gets the changed account.
     *
     * @returns {AccountNumber}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the account instance (if resolved).
     *
     * @returns {Account|null}
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
     * @returns {PublicKey}
     */
    get newPublicKey() {
        return this._newPublicKey;
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
     * Gets the seller account (if resolved).
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
     * Resolved the account objects if any match is found.
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

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize()
    {
        return {
            account_number: this.accountNumber.toString(),
            account: this.account !== null ? this.account.serialize() : null,
            n_operation: this.nOperation,
            new_public_key: this.newPublicKey !== null ? this.newPublicKey.serialize() : null,
            new_name: this.newName,
            new_type: this.newType,
            seller_account_number: this.sellerAccountNumber !== null ? this.sellerAccountNumber.toString() : null,
            seller_account: this.sellerAccount !== null ? this.sellerAccount.serialize() : null,
            account_price: this.accountPrice.serialize(),
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toString()
        }
    }
}

module.exports = Changer;