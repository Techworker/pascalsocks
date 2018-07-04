/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The event that contains info about a ChangeNameAndType event (optype = 7)
 */
class AccountChangeName extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'account_change_name';
  }

  /**
     * Creates a new instance of the BlockFinished class.
     *
     * @param {Operation} operation
     * @param {ChangeName} operationInfo
     */
  constructor(operation, operationInfo) {
    super(`Account ${operationInfo.accountNumber} changed name to ${operationInfo.newName}`);

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

module.exports = AccountChangeName;
