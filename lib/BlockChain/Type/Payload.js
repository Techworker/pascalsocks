/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * Represents a payload.
 */
class Payload
{
    /**
     *
     * @param {HexaString} encrypted
     * @param {String|null} decrypted
     */
    constructor(encrypted, decrypted)
    {
        this._encrypted = encrypted;
        this._decrypted = decrypted;
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
        }
    }
}

module.exports = Payload;