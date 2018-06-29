/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const HexaString = require('./Type/HexaString');
const PascalCurrency = require('./Type/PascalCurrency');
const PublicKey = require('./PublicKey');

/**
 * Represents a block.
 */
class Block
{
    /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} blockData
     */
    static createFromRPC(blockData)
    {
        const block = new Block();
        block._block = parseInt(blockData.block, 10);
        block._pubkey = PublicKey.fromLocal(blockData.enc_pubkey);
        block._reward = new PascalCurrency(blockData.reward);
        block._fee = new PascalCurrency(blockData.fee);
        block._ver = blockData.ver;
        block._verA = blockData.ver_a;
        block._timestamp = parseInt(blockData.timestamp, 10);
        block._target = blockData.target;
        block._nonce = blockData.nonce;
        block._payload = blockData.payload;
        block._sbh = new HexaString(blockData.sbh);
        block._oph = new HexaString(blockData.oph);
        block._pow = new HexaString(blockData.pow);
        block._numberOfOperations = parseInt(blockData.operations, 10);
        block._hashRateKhs = blockData.hashratekhs;
        block._maturation = parseInt(blockData.maturation);
        block._rpc = blockData;

        return block;
    }

    /**
     * The raw block data.
     *
     * @returns {Object}
     */
    get rpc() {
        return this._rpc;
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
    get pubkey() {
        return this._pubkey;
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