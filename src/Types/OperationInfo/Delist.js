/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../AccountNumber');
const PascalCurrency = require('../PascalCurrency');

/**
 * The info about a "Delist account" (optype = 5) operation.
 */
class Delist {
  /**
     * Creates a new instance of the Delist operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {PascalCurrency} price
     * @param {PascalCurrency} fee
     */
  constructor(accountNumber, price, fee) {
    if (!(accountNumber instanceof AccountNumber)) {
      throw new Error('Invalid account.');
    }

    if (!(price instanceof PascalCurrency)) {
      throw new Error('Invalid account price.');
    }

    if (!(fee instanceof PascalCurrency)) {
      throw new Error('Invalid fee.');
    }

    this._accountNumber = accountNumber;
    this._account = null;
    this._price = price;
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
     * Gets the price the account was listed for.
     *
     * @returns {PascalCurrency}
     */
  get price() {
    return this._price;
  }

  /**
     * Gets the fee paid for the operation.
     *
     * @returns {PascalCurrency}
     */
  get fee() {
    return this._fee;
  }

  /**
     * Gets the serialized version of this info.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const account = await chain.getAccount(this.accountNumber);

    return {
      type: 'operation_info.delist',
      accountNumber: this.accountNumber.toString(),
      account: account !== null ? await account.serialize(chain) : null,
      price: this.price.serialize(),
      fee: this.fee.toMolina()
    };
  }
}

module.exports = Delist;
