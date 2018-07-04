/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../AccountNumber');
const PascalCurrency = require('../PascalCurrency');
const HexaString = require('../HexaString');

/**
 * Represents a Changer in an operation.
 *
 * @alias Changer2
 */
class Changer {
  /**
     * Creates a new instance of the Changer class.
     *
     * @param {Object} rpc
     */
  static createFromRPC(rpc) {
    const instance = new Changer();

    instance._rpc = rpc;
    instance._accountNumber = new AccountNumber(rpc.account);
    instance._account = null;
    instance._nOperation = parseInt(rpc.n_operation, 10);

    instance._publicKeyNewHex = null;
    if (rpc.new_enc_pubkey !== undefined) {
      instance._publicKeyNewHex = new HexaString(rpc.new_enc_pubkey);
    }

    instance._nameNew = rpc.new_name;
    if (rpc.new_name === undefined) {
      instance._nameNew = null;
    }

    instance._typeNew = rpc.new_type;
    if (rpc.new_type === undefined) {
      instance._typeNew = null;
    }

    instance._accountNumberSeller = null;
    if (rpc.seller_account !== undefined) {
      instance._accountNumberSeller = new AccountNumber(rpc.seller_account);
    }

    if (rpc.account_price === undefined) {
      instance._price = new PascalCurrency(0);
    } else {
      instance._price = new PascalCurrency(rpc.account_price);
    }

    if (rpc.locked_until_block === undefined) {
      instance._lockedUntilBlock = null;
    } else {
      instance._lockedUntilBlock = parseInt(rpc.locked_until_block, 10);
    }

    if (rpc.fee === undefined) {
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
     * Gets the serialized version of this instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const account = await chain.getAccount(this.accountNumber);
    const accountSeller = await chain.getAccount(this.accountNumber);
    const publicKeyNew = await chain.getPublicKey(this.publicKeyNewHex);

    return {
      accountNumber: this.accountNumber.toString(),
      account: account !== null ? await account.serialize(chain) : null,
      nOperation: this.nOperation,
      publicKeyNewHex: this.publicKeyNewHex !== null ? this.publicKeyNewHex.toString() : null,
      publicKeyNew: publicKeyNew !== null ? await publicKeyNew.serialize(chain) : null,
      nameNew: this.nameNew,
      typeNew: this.typeNew,
      accountSellerNumber: this.accountNumberSeller !== null ? this.accountNumberSeller.toString() : null,
      accountSeller: accountSeller !== null ? await accountSeller.serialize(chain) : null,
      price: this.price.toMolina(),
      lockedUntilBlock: this.lockedUntilBlock,
      fee: this.fee.toMolina()
    };
  }
}

module.exports = Changer;
