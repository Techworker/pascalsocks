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
     * Creates a new Account instance.
     *
     * @param {Object} raw
     */
    constructor(raw)
    {
        this._accountNumber = new AccountNumber(raw.account);
        this._pubkey = PublicKey.fromLocal(raw.enc_pubkey);
        this._balance = new PascalCurrency(raw.balance);
        this._numberOfOperations = parseInt(raw.n_operation, 10);
        this._lastUpdatedInBlock = parseInt(raw.updated_b, 10);

        if(raw.state !== 'normal' && raw.state !== 'listed') {
            throw new Error('Invalid account state.');
        }
        this._state = raw.state;

        this._lockedUntilBlock = parseInt(raw.locked_until_block, 10);

        this._newPubKey = null;
        this._price = new PascalCurrency(0);
        this._sellerAccountNumber = null;
        this._privateSale = false;

        if(raw.state === 'listed')
        {
            this._price = new PascalCurrency(raw.price / 10000);
            this._sellerAccountNumber = new AccountNumber(raw.seller_account);
            this._privateSale = !!raw.private_sale;
            if(this._privateSale === true) {
                this._newPubKey = PublicKey.fromLocal(raw.new_enc_pubkey);
            }
        }

        this._name = raw._name;
        this._type = parseInt(raw._type, 10);
    }

    /**
     * Gets the number of the account.
     *
     * @returns {AccountNumber}
     */
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the encoded public key value.
     *
     * @returns {PublicKey}
     */
    get pubkey() {
        return this._pubkey;
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
     * Gets the number of operations made by this account (Note: When an
     * account receives a transaction, numberOfOperations is not changed).
     *
     * @returns {Number}
     */
    get numberOfOperations() {
        return this._numberOfOperations;
    }

    /**
     * Last block that updated this account. If equal to blockchain blocks count
     * it means that it has pending operations to be included to the blockchain.
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
     * Gets a flag indicating whether the account is for sale.
     *
     * @returns {boolean}
     */
    get isForSale() {
        return this.state === 'listed';
    }

    /**
     * Gets the block number until this account is locked. Only set if state
     * is listed.
     *
     * @returns {Number}
     */
    get lockedUntilBlock() {
        return this._lockedUntilBlock;
    }

    /**
     * Gets the price of the account if it is for sale. Otherwise zero.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._price;
    }

    /**
     * Gets the account of the seller or null if the account is not for sale.
     *
     * @returns {AccountNumber|null}
     */
    get sellerAccountNumber() {
        return this._sellerAccountNumber;
    }

    /**
     * Gets a value indicating whether the account is only for sale in private.
     *
     * @returns {Boolean}
     */
    get isPrivateSale() {
        return this._privateSale;
    }

    /**
     * Private buyers public key. Only set if state is listed and its a private
     * sale.
     *
     * @returns {HexaString|null}
     */
    get newPubKey() {
        return this._newPubKey;
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
}

module.exports = Account;