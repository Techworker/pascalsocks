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
 * Represents a block.
 */
class Block
{
    /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} raw
     */
    constructor(raw, payloadResolver)
    {
        this._block = parseInt(raw.block, 10);
        this._encPubkey = new HexaString(raw.enc_pubkey);
        this._reward = new PascalCurrency(raw.reward);
        this._fee = new PascalCurrency(raw.fee);
        this._ver = raw.ver;
        this._verA = raw.ver_a;
        this._timestamp = parseInt(raw.timestamp, 10);
        this._target = raw.target;
        this._nonce = raw.nonce;
        this._payload = raw.payload;
        this._sbh = new HexaString(raw.sbh);
        this._oph = new HexaString(raw.oph);
        this._pow = new HexaString(raw.pow);
        this._numberOfOperations = parseInt(raw.operations, 10);
        this._hashRateKhs = raw.hashratekhs;
        this._maturation = parseInt(raw.maturation);
        this._raw = raw;
    }

    /**
     * The raw block data.
     *
     * @returns {Object}
     */
    get raw() {
        return this._raw;
    }

    /**
     * The number of the block.
     *
     * @returns {Number}
     */
    get block() {
        return this._block;
    }

    /**
     * Encoded public key value used to init 5 created accounts of this block.
     *
     * @returns {PublicKey}
     */
    get encPubkey() {
        return this._encPubkey;
    }

    /**
     * Reward of first account's block
     *
     * @returns {PascalCurrency}
     */
    get reward() {
        return this._reward;
    }

    /**
     * Gets the fee obtained by operations.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Gets the Pascal Coin protocol used
     *
     * @returns {Number}
     */
    get ver() {
        return this._ver;
    }

    /**
     * Pascal Coin protocol available by the miner.
     *
     * @returns {Number}
     */
    get verA() {
        return this._verA;
    }

    /**
     * Unix timestamp of the block.
     *
     * @returns {Number}
     */
    get timestamp() {
        return this._timestamp;
    }

    /**
     * The target used.
     *
     * @returns {Number}
     */
    get target() {
        return this._target;
    }

    /**
     * Gets the nonce used.
     *
     * @returns {Number}
     */
    get nonce() {
        return this._nonce;
    }

    /**
     * Miner's payload
     *
     * @returns {String}
     */
    get payload() {
        return this._payload;
    }

    /**
     * SafeBox Hash
     * @returns {HexaString}
     */
    get sbh() {
        return this._sbh;
    }

    /**
     * Operations hash
     *
     * @returns {HexaString}
     */
    get oph() {
        return this._oph;
    }

    /**
     * Proof of work
     *
     * @returns {HexaString}
     */
    get pow() {
        return this._pow;
    }

    /**
     * Number of operations included in this block
     *
     * @returns {Number}
     */
    get numberOfOperations() {
        return this._numberOfOperations;
    }

    /**
     * Estimated network hashrate calculated by previous 50 blocks average.
     *
     * @returns {Number}
     */
    get hashRateKhs() {
        return this._hashRateKhs;
    }

    /**
     * Number of blocks in the blockchain higher than the recent block.
     *
     * @returns {Number}
     */
    get maturation() {
        return this._maturation;
    }

    serialize() {

    }
}

module.exports = Block;