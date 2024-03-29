/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The internal seal event that will seal the pending events.
 */
class InternalSeal extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'internal_seal';
  }

  /**
     * Creates a new instance of the the Seal class.
     *
     * @param {Block} block
     */
  constructor(block) {
    super(`Seal block ${block.blockNumber}`);

    this._block = block;
  }

  /**
     * Gets the block associated to the event.
     *
     * @return {Block}
     */
  get block() {
    return this._block;
  }

  /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serializeEvent(chain) {
    return {
      block: await this.block.serialize(chain)
    };
  }
}

module.exports = InternalSeal;
