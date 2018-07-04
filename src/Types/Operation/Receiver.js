/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('../AccountNumber');
const Payload = require('../Payload');
const PascalCurrency = require('../PascalCurrency');

/**
 * Represents a receiver in an operation.
 */
class Receiver {
  /**
     * Creates a new instance of the Receiver class.
     *
     * @param {Object} rpc
     */
  static createFromRPC(rpc) {
    const instance = new Receiver();

    instance._rpc = rpc;
    instance._account = null;
    instance._accountNumber = new AccountNumber(rpc.account);
    instance._amount = new PascalCurrency(rpc.amount);
    instance._payload = Payload.createFromRPCValue(rpc.payload);

    return instance;
  }

  /**
     * Gets the account  of the sender.
     *
     * @returns {AccountNumber}
     */
  get accountNumber() {
    return this._accountNumber;
  }

  /**
     * Gets the account  of the sender.
     *
     * @returns {Account}
     */
  get account() {
    return this._account;
  }

  /**
     * Gets the amount.
     *
     * @returns {PascalCurrency}
     */
  get amount() {
    return this._amount;
  }

  /**
     * Gets the payload.
     *
     * @returns {Payload}
     */
  get payload() {
    return this._payload;
  }

  /**
     * Gets the serialized version of the instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const account = await chain.getAccount(this.accountNumber);

    return {
      accountNumber: this.accountNumber.toString(),
      account: account !== null ? await account.serialize(chain) : null,
      amount: this.amount.toMolina(),
      payload: this.payload !== null ? this.payload.serialize() : null
    };
  }
}

module.exports = Receiver;
