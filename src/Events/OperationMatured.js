/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The event that contains a pending operation.
 */
class OperationMatured extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'operation_matured';
  }

  /**
     * Creates a new instance of the Included class.
     *
     * @param {Operation} operation
     */
  constructor(operation) {
    super(`Operation matured: ${operation.op_hash}`);

    this._operation = operation;
  }

  /**
     * Gets the operation.
     *
     * @returns {Operation}
     */
  get operation() {
    return this._operation;
  }

  /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serializeEvent(chain) {
    return {
      operation: await this.operation.serialize(chain)
    };
  }
}

module.exports = OperationMatured;
