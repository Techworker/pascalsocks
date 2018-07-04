/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const HexaString = require('./HexaString');

/**
 * Represents a payload.
 */
class Payload {
  static createFromRPCValue(payload) {
    const instance = new Payload();

    instance._encrypted = new HexaString(payload);
    return instance;
  }

  /**
     * The encrypted hexa string.
     *
     * @returns {HexaString}
     */
  get encrypted() {
    return this._encrypted;
  }

  /**
     * The decrypted value (if available)
     *
     * @returns {String|null}
     */
  get decrypted() {
    return this._decrypted;
  }

  /**
     * Gets a serialized version.
     *
     * @returns {{encrypted: string, decrypted: (String|null)}}
     */
  serialize() {
    return {
      encrypted: this.encrypted.toString(),
      decrypted: this.decrypted
    };
  }
}

module.exports = Payload;
