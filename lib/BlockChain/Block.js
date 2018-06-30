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
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Block();
        instance._rpc = rpc;

        instance._blockNumber = parseInt(rpc.block, 10);
        instance._publicKey = PublicKey.createFromRPCValue(rpc.enc_pubkey);
        instance._reward = new PascalCurrency(rpc.reward);
        instance._fee = new PascalCurrency(rpc.fee);
        instance._protocolVersion = parseInt(rpc.ver, 10);
        instance._protocolVersionMiner = parseInt(rpc.ver_a, 10);
        instance._timestamp = parseInt(rpc.timestamp, 10);
        instance._target = parseInt(rpc.target, 10);
        instance._nonce = parseInt(rpc.nonce, 10);
        instance._payload = rpc.payload;
        instance._safeBoxHash = new HexaString(rpc.sbh);
        instance._opHash = new HexaString(rpc.oph);
        instance._proofOfWork = new HexaString(rpc.pow);
        instance._numberOfOperations = parseInt(rpc.operations, 10);
        instance._hashRateKhs = rpc.hashratekhs;
        instance._maturation = parseInt(rpc.maturation);

        return instance;
    }

    /**
     * The number of the block.
     *
     * @returns {Number}
     */
    get blockNumber() {
        return this._blockNumber;
    }

    /**
     * Public key value used to init 4 created accounts
     * of this block.
     *
     * @returns {PublicKey}
     */
    get publicKey() {
        return this._publicKey;
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
    get protocolVersion() {
        return this._protocolVersion;
    }

    /**
     * Pascal Coin protocol available by the miner.
     *
     * @returns {Number}
     */
    get protocolVersionMiner() {
        return this._protocolVersionMiner;
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
    get safeBoxHash() {
        return this._safeBoxHash;
    }

    /**
     * Operations hash
     *
     * @returns {HexaString}
     */
    get opHash() {
        return this._opHash;
    }

    /**
     * Proof of work
     *
     * @returns {HexaString}
     */
    get proofOfWork() {
        return this._proofOfWork;
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

    /**
     * Overwrites the public key instance.
     *
     * @param publicKey
     */
    overwritePublicKey(publicKey) {
        this._publicKey = publicKey;
    }

    /**
     * Gets the serialized version of the block.
     *
     * @returns {Object}
     */
    serialize() {
        return {
            block_number: this.blockNumber,
            publicKey: this.publicKey.serialize(),
            reward: this.reward.serialize(),
            fee: this.fee.serialize(),
            protocolVersion: this.protocolVersion,
            protocolVersionMiner: this.protocolVersionMiner,
            timestamp: this.timestamp,
            target: this.target,
            nonce: this.nonce,
            payload: this.payload,
            safe_box_hash: this.safeBoxHash.toString(),
            op_hash: this.opHash.toString(),
            proof_of_work: this.proofOfWork.toString(),
            number_of_operations: this.numberOfOperations,
            hash_rate_khs: this.hashRateKhs,
            maturation: this.maturation
        }
    }
}

module.exports = Block;