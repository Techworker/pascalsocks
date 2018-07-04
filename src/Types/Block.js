/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const HexaString = require('./HexaString');
const PascalCurrency = require('./PascalCurrency');

/**
 * Represents a block.
 */
class Block {
  /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} rpc
     */
  static createFromRPC(rpc) {
    const instance = new Block();

    instance._rpc = rpc;

    instance._blockNumber = parseInt(rpc.block, 10);
    instance._publicKeyHex = new HexaString(rpc.enc_pubkey);
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
    instance._maturation = parseInt(rpc.maturation, 10);

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
     * Returns the public key as a hexa string.
     *
     * @returns {HexaString}
     */
  get publicKeyHex() {
    return this._publicKeyHex;
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
     * Gets the serialized version of the block.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serialize(chain) {
    const publicKey = await chain.getPublicKey(this.publicKeyHex);

    return {
      blockNumber: this.blockNumber,
      publicKeyHex: this.publicKeyHex.toString(),
      publicKey: publicKey !== null ? await publicKey.serialize(chain) : null,
      reward: this.reward.toMolina(),
      fee: this.fee.toMolina(),
      protocolVersion: this.protocolVersion,
      protocolVersionMiner: this.protocolVersionMiner,
      timestamp: this.timestamp,
      target: this.target,
      nonce: this.nonce,
      payload: this.payload,
      safeBoxHash: this.safeBoxHash.toString(),
      opHash: this.opHash.toString(),
      proofOfWork: this.proofOfWork.toString(),
      numberOfOperations: this.numberOfOperations,
      hashRateKhs: this.hashRateKhs,
      maturation: this.maturation
    };
  }
}

module.exports = Block;
