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
const HexaString = require('../Type/HexaString');

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

        instance._publicKeyNewHex = null;
        if(rpc.new_enc_pubkey !== undefined) {
            instance._publicKeyNewHex = new HexaString(rpc.new_enc_pubkey);
        }

        instance._nameNew = rpc.new_name;
        if(rpc.new_name === undefined) {
            instance._nameNew = null;
        }

        instance._typeNew = rpc.new_type;
        if(rpc.new_type === undefined) {
            instance._typeNew = null;
        }

        instance._accountNumberSeller = null;
        if(rpc.seller_account !== undefined) {
            instance._accountNumberSeller = new AccountNumber(rpc.seller_account);
        }

        if(rpc.account_price === undefined) {
            instance._price = new PascalCurrency(0);
        } else {
            instance._price = new PascalCurrency(rpc.account_price);
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
    get publicKeyNewHex() {
        return this._publicKeyNewHex;
    }

    /**
     * Gets the new name.
     *
     * @returns {string}
     */
    get nameNew() {
        return this._nameNew;
    }

    /**
     * Gets the new type.
     *
     * @returns {Number}
     */
    get typeNew() {
        return this._typeNew;
    }

    /**
     * Gets the seller account.
     *
     * @returns {AccountNumber}
     */
    get accountNumberSeller() {
        return this._accountNumberSeller;
    }

    /**
     * Gets the sales price of the account.
     *
     * @returns {PascalCurrency}
     */
    get price() {
        return this._price;
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
     * Gets a list of all primitive values that should be resolved.
     *
     * @param {Object} refs
     * @returns {Object}
     */
    references(refs)
    {
        refs.accounts.set(this.accountNumber.toString(), this.accountNumber);
        if(this.accountNumberSeller !== null) {
            refs.accounts.set(this.accountNumberSeller.toString(), this.accountNumberSeller);
        }

        refs.publicKeys.set(this.publicKeyNewHex.toString(), this.publicKeyNew);
        return refs;
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
        if(account.accountNumber.equals(this.accountNumberSeller)) {
            this._accountSeller = account;
        }
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain)
    {
        const account = await chain.getAccount(this.accountNumber);
        const accountSeller = await chain.getAccount(this.accountNumber);
        const publicKeyNew = await chain.getPublicKey(this.publicKeyNewHex);

        return {
            account_number: this.accountNumber.toString(),
            account: account !== null ? await account.serialize(chain) : null,
            n_operation: this.nOperation,
            public_key_new_hex: this.publicKeyNewHex !== null ? this.publicKeyNewHex.toString() : null,
            public_key_new: publicKeyNew !== null ? await publicKeyNew.serialize(chain) : null,
            name_new: this.nameNew,
            type_new: this.typeNew,
            account_number_seller: this.accountNumberSeller !== null ? this.accountNumberSeller.toString() : null,
            account_seller: accountSeller !== null ? await accountSeller.serialize(chain) : null,
            price: this.price.toMolina(),
            locked_until_block: this.lockedUntilBlock,
            fee: this.fee.toMolina()
        }
    }
}

module.exports = Changer;