/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('./Type/AccountNumber');
const HexaString = require('./Type/HexaString');
const PascalCurrency = require('./Type/PascalCurrency');
const PublicKey = require('./PublicKey');

/**
 * Represents an account.
 */
class Account
{
    /**
     * The state of an account when it is listed for sale.
     *
     * @returns {string}
     */
    static get STATE_LISTED() {
        return 'listed';
    }

    /**
     * The state of an account when it is not listed.
     *
     * @returns {string}
     */
    static get STATE_NORMAL() {
        return 'normal';
    }

    /**
     * Creates a new Account instance.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Account();

        instance._rpc = rpc;

        instance._accountNumber = new AccountNumber(rpc.account);
        instance._publicKey = PublicKey.createFromRPCValue(rpc.enc_pubkey);
        instance._balance = new PascalCurrency(rpc.balance.toString());
        instance._nOperations = parseInt(rpc.n_operation, 10);
        instance._lastUpdatedInBlock = parseInt(rpc.updated_b, 10);

        if(rpc.state !== Account.STATE_NORMAL && rpc.state !== Account.STATE_LISTED) {
            // hmm..
            throw new Error('Invalid account state.');
        }

        instance._state = rpc.state;
        instance._lockedUntilBlock = parseInt(rpc.locked_until_block, 10);
        instance._buyerPublicKey = null;
        instance._price = new PascalCurrency(0);
        instance._sellerAccountNumber = null;
        instance._sellerAccount = null;
        instance._isPrivateSale = false;

        if(rpc.state === Account.STATE_LISTED)
        {
            instance._price = new PascalCurrency(rpc.price / 10000);
            instance._sellerAccountNumber = new AccountNumber(rpc.seller_account);
            instance._isPrivateSale = !!rpc.private_sale;
            if(instance._isPrivateSale === true) {
                instance._buyerPublicKey = PublicKey.createFromRPCValue(rpc.new_enc_pubkey);
            }
        }

        instance._name = rpc._name;
        instance._type = parseInt(rpc._type, 10);

        return instance;
    }

    /**
     * Gets the number of the account.
     *
     * @returns {AccountNumber}*/
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the public key value.
     *
     * @returns {PublicKey}
     */
    get publicKey() {
        return this._publicKey;
    }

    /**
     * Gets the balance of the account.
     *
     * @returns {PascalCurrency}
     */
    get balance() {
        return this._balance;
    }

    /**
     * Gets the number of operations made by this account.
     *
     * @returns {Number}
     */
    get nOperations() {
        return this._nOperations;
    }

    /**
     * Last block that updated this account.
     *
     * @returns {Number}
     */
    get lastUpdatedInBlock() {
        return this._lastUpdatedInBlock;
    }

    /**
     * Gets an string identifier of the state of the account.
     *
     * @returns {String}
     */
    get state() {
        return this._state;
    }

    /**
     * Gets the block number until this account is locked. Only
     * set if state is listed.
     *
     * @returns {Number}
     */
    get lockedUntilBlock() {
        return this._lockedUntilBlock;
    }

    /**
     * Gets the price of the account if it is for sale.
     * Otherwise zero.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._price;
    }

    /**
     * Gets the account of the seller or null if the account is not
     * for sale.
     *
     * @returns {AccountNumber|null}
     */
    get sellerAccountNumber() {
        return this._sellerAccountNumber;
    }

    /**
     * Gets the account instance of the seller (if resolved)
     *
     * @returns {Account|null}
     */
    get sellerAccount() {
        return this._sellerAccount;
    }

    /**
     * Gets a value indicating whether the account is only for sale in private.
     *
     * @returns {Boolean}
     */
    get isPrivateSale() {
        return this._isPrivateSale;
    }

    /**
     * Private buyers public key. Only set if state is listed and its a private
     * sale.
     *
     * @returns {PublicKey|null}
     */
    get buyerPublicKey() {
        return this._buyerPublicKey;
    }

    /**
     * Gets the name of the account.
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets the name type of the account.
     *
     * @returns {String}
     */
    get type() {
        return this._type;
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
            public_key: this.publicKey.serialize(),
            balance: this.balance.toString(),
            n_operations: this.nOperations,
            last_updated_in_block: this.lastUpdatedInBlock,
            state: this.state,
            locked_until_block: this.lockedUntilBlock,
            buyer_public_key: this.buyerPublicKey !== null ? this.buyerPublicKey.serialize() : null,
            price: this.price.serialize(),
            seller_account_number: this.sellerAccountNumber !== null ? this.sellerAccountNumber.toString() : null,
            seller_account: this.sellerAccount !== null ? this.sellerAccount.serialize() : null,
            is_private_sale: this.isPrivateSale,
            name: this.name,
            type: this.type
        }
    }
}

module.exports = Account;