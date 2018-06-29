/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('./Type/AccountNumber');
const HexaString = require('./Type/HexaString');
const PascalCurrency = require('./Type/PascalCurrency');

/**
 * Represents a pubic key.
 */
class PublicKey
{
    /**
     * Creates a new instance of the PublicKey class.
     *
     * @param {Object} raw
     */
    constructor(raw)
    {
        this._name = raw.name;

        this._canUse = false;
        if(raw.can_use !== undefined) {
            this._canUse = raw.can_use;
        }

        this._encPubkey = new HexaString(raw.enc_pubkey);
        this._b58PubKey = new HexaString(raw.b58_pubkey);
        this._ecNid = raw.ec_nid;
        this._x = new HexaString(raw.x);
        this._y = new HexaString(raw.y);
        this._raw = raw;
    }

    /**
     * Gets the raw object used to initialize this object.
     *
     * @returns {Object}
     */
    get raw() {
        return this._raw;
    }

    /**
     * Human readable name stored at the Wallet for this key.
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * If false then the wallet doesn't have Private key for this public key.
     * The wallet cannot execute operations with this key.
     *
     * @returns {boolean}
     */
    get canUse() {
        return this._canUse;
    }

    /**
     * Encoded value of this public key. This HEXASTRING has no checksum, so,
     * if using it always must be sure that value is correct.
     *
     * @returns {HexaString}
     */
    get encPubkey() {
        return this._encPubkey;
    }

    /**
     * Encoded value of this public key in Base 58 format, also contains a
     * checksum. This is the same value that Application Wallet exports as a
     * public key.
     *
     * @returns {HexaString}
     */
    get b58PubKey() {
        return this._b58PubKey;
    }

    /**
     * Indicates which EC type is used.
     *
     * @returns {String}
     */
    get ecNid() {
        return this._ecNid;
    }

    /**
     * X value of public key.
     *
     * @returns {HexaString}
     */
    get x() {
        return this._x;
    }

    /**
     * Y value of the public key.
     *
     * @returns {HexaString}
     */
    get y() {
        return this._y;
    }

    /**
     * Gets a serialized version of the object.
     *
     * @returns {{name: String, can_use: boolean, enc_pubkey: string, b58_pubkey: string, ec_nid: string, x: string, y: string}}
     */
    serialize()
    {
        return {
            name: this.name,
            can_use: this.canUse,
            enc_pubkey: this.encPubkey.toString(),
            b58_pubkey: this.b58PubKey.toString(),
            ec_nid: this.ecNid.toString(),
            x: this.x.toString(),
            y: this.y.toString(),
        }
    }
}

module.exports = PublicKey;