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
        instance._publicKeyHex = new HexaString(rpc.enc_pubkey);
        instance._balance = new PascalCurrency(rpc.balance.toString());
        instance._nOperations = parseInt(rpc.n_operation, 10);
        instance._lastUpdatedInBlock = parseInt(rpc.updated_b, 10);

        if(rpc.state !== Account.STATE_NORMAL && rpc.state !== Account.STATE_LISTED) {
            // hmm..
            throw new Error('Invalid account state.');
        }

        instance._state = rpc.state;
        instance._lockedUntilBlock = parseInt(rpc.locked_until_block, 10);
        instance._publicKeyBuyerHex = null;
        instance._price = new PascalCurrency(0);
        instance._accountNumberSeller = null;
        instance._isPrivateSale = false;

        if(rpc.state === Account.STATE_LISTED)
        {
            instance._price = new PascalCurrency(rpc.price / 10000);
            instance._accountNumberSeller = new AccountNumber(rpc.seller_account);
            instance._isPrivateSale = !!rpc.private_sale;
            if(instance._isPrivateSale === true) {
                instance._publicKeyBuyerHex = new HexaString(rpc.new_enc_pubkey);
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
     * @returns {HexaString}
     */
    get publicKeyHex() {
        return this._publicKeyHex;
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
    get accountNumberSeller() {
        return this._accountNumberSeller;
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
     * @returns {HexaString|null}
     */
    get publicKeyBuyerHex() {
        return this._publicKeyBuyerHex;
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
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain)
    {
        const publicKey = await chain.getPublicKey(this.publicKeyHex);
        const publicKeyBuyer = await chain.getPublicKey(this.publicKeyBuyerHex);
        const accountSeller = await chain.getAccount(this.accountNumberSeller);

        return {
            account_number: this.accountNumber.toString(),
            public_key_hex: this.publicKeyHex.toString(),
            public_key: publicKey !== null ? await publicKey.serialize(chain) : null,
            balance: this.balance.toMolina(),
            n_operations: this.nOperations,
            last_updated_in_block: this.lastUpdatedInBlock,
            state: this.state,
            locked_until_block: this.lockedUntilBlock,
            public_key_buyer_hex: this.publicKeyBuyerHex !== null ? this.publicKeyBuyerHex.toString() : null,
            public_key_buyer: publicKeyBuyer !== null ? await publicKeyBuyer.serialize(chain) : null,
            price: this.price.toMolina(),
            account_number_seller: this.accountNumberSeller !== null ? this.accountNumberSeller.toString() : null,
            account_seller: accountSeller !== null ? await accountSeller.serialize(chain) : null,
            is_private_sale: this.isPrivateSale,
            name: this.name,
            type: this.type
        }
    }
}

module.exports = Account;