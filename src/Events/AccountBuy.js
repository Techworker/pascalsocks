/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The event gets fired when an account is bought on the chain.
 */
class AccountBuy extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'account.buy';
  }

  /**
     * Creates a new instance of the AccountBuy class.
     *
     * @param {Operation} operation
     * @param {BuyOpInfo} operationInfo
     */
  constructor(operation, operationInfo) {
    super(`Account ${operationInfo.accountNumberBuyer} bought ` +
      `${operationInfo.accountNumber} for ${operationInfo.amount}`);
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
     * @return {BuyOpInfo}
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

module.exports = AccountBuy;
