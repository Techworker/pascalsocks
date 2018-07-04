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
 * The info about a "Change Name" (optype = 8) operation.
 */
class ChangeName {
  /**
     * Creates a new instance of the ChangeName operation info.
     *
     * @param {AccountNumber} accountNumber
     * @param {string} newName
     * @param {PascalCurrency} fee
     */
  constructor(accountNumber, newName, fee) {
    if (!(accountNumber instanceof AccountNumber)) {
      throw new Error('Invalid account.');
    }

    if (!(fee instanceof PascalCurrency)) {
      throw new Error('Invalid fee.');
    }

    this._accountNumber = accountNumber;
    this._account = null;
    this._newName = newName;
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
     * Gets the account.
     *
     * @returns {Account|*|null}
     */
  get account() {
    return this._account;
  }

  /**
     * Gets the new name of the account.
     *
     * @returns {Boolean}
     */
  get newName() {
    return this._newName;
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
     * Gets the serialized version of this instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const account = await chain.getAccount(this.accountNumber);

    return {
      type: 'operation_info.change_name',
      accountNumber: this.accountNumber.toString(),
      account: account !== null ? await account.serialize(chain) : null,
      newName: this.newName,
      fee: this.fee.toMolina()
    };
  }
}

module.exports = ChangeName;
