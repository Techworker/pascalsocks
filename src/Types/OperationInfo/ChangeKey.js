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
 * The info about a "Change Key" (optype = 2,7) operation.
 */
class ChangeKey {
  /**
     * Creates a new instance of the ChangeKey class.
     *
     * @param {AccountNumber} accountNumber
     * @param {HexaString} publicKeyNewHex
     * @param {PascalCurrency} fee
     */
  constructor(accountNumber, publicKeyNewHex, fee) {
    if (!(accountNumber instanceof AccountNumber)) {
      throw new Error('Invalid account.');
    }

    if (!(publicKeyNewHex instanceof HexaString)) {
      throw new Error('Invalid public key.');
    }

    if (!(fee instanceof PascalCurrency)) {
      throw new Error('Invalid fee.');
    }

    this._accountNumber = accountNumber;
    this._account = null;
    this._publicKeyNewHex = publicKeyNewHex;
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
     * Gets the new key.
     *
     * @returns {PublicKey}
     */
  get publicKeyNewHex() {
    return this._publicKeyNewHex;
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
     * Gets the serialized version of this class.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const account = await chain.getAccount(this.accountNumber);
    const publicKeyNew = await chain.getPublicKey(this.publicKeyNewHex);

    return {
      type: 'operation_info.change_key',
      accountNumber: this.accountNumber.toString(),
      account: account !== null ? await account.serialize(chain) : null,
      publicKeyNewHex: this.publicKeyNewHex.toString(),
      publicKeyNew: publicKeyNew !== null ? await publicKeyNew.serialize(chain) : null,
      fee: this.fee.toMolina()
    };
  }
}

module.exports = ChangeKey;
