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
     * Creates a new PublicKey instance with the given public key string.
     *
     * @param {String} hexaPublicKey
     * @returns {PublicKey}
     */
    static createFromRPCValue(hexaPublicKey)
    {
        const instance = new PublicKey();
        instance._hexaPublicKey = new HexaString(hexaPublicKey);
        return instance;
    }

    /**
     * Creates a new instance of the PublicKey class.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new PublicKey();
        instance._rpc = rpc;

        instance._name = rpc.name;
        instance._canUse = false;
        if(rpc.can_use !== undefined) {
            instance._canUse = rpc.can_use;
        }

        instance._hexaPublicKey = new HexaString(rpc.enc_pubkey);
        instance._base58PublicKey = rpc.b58_pubkey;
        instance._ecNid = rpc.ec_nid;
        instance._x = new HexaString(rpc.x);
        instance._y = new HexaString(rpc.y);

        return instance;
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
    get hexaPublicKey() {
        return this._hexaPublicKey;
    }

    /**
     * Encoded value of this public key in Base 58 format, also contains a
     * checksum. This is the same value that Application Wallet exports as a
     * public key.
     *
     * @returns {String}
     */
    get base58PublicKey() {
        return this._base58PublicKey;
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
     * @returns {Object}
     */
    serialize()
    {
        return {
            name: this.name,
            can_use: this.canUse,
            hexa_public_key: this.hexaPublicKey.toString(),
            base58_public_key: this.base58PublicKey.toString(),
            ec_nid: this.ecNid.toString(),
            x: this.x.toString(),
            y: this.y.toString(),
        }
    }
}

module.exports = PublicKey;