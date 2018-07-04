/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The event for when an account is for sale.
 */
class AccountForSale extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'account_for_sale';
  }

  /**
     * Creates a new instance of the ForSale event class.
     *
     * @param {Operation} operation
     * @param {ForSale} operationInfo
     */
  constructor(operation, operationInfo) {
    super(`${operationInfo.accountNumber} for sale${operationInfo.isPrivate ? ' (private sale)' : ''} ` +
            `by ${operationInfo.accountNumberSeller} for ${operationInfo.accountPrice}`);

    this._operation = operation;
    this._operationInfo = operationInfo;
  }

  /**
     * Gets the operation.
     *
     * @return {Operation}
     */
  get operation() {
    return this._operation;
  }

  /**
     * Gets the operation.
     *
     * @return {ChangeKeyOpInfo}
     */
  get operationInfo() {
    return this._operationInfo;
  }

  /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serializeEvent(chain) {
    return {
      operation: await this.operation.serialize(chain),
      operationInfo: await this.operationInfo.serialize(chain)
    };
  }
}

module.exports = AccountForSale;
