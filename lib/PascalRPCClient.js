/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const jayson = require('jayson/promise');

const Operation = require('./BlockChain/Operation');
const Block = require('./BlockChain/Block');
const Account = require('./BlockChain/Account');
const PublicKey = require('./BlockChain/PublicKey');
const helper = require('./helper');

/**
 * A simple class that can call JSON RPC methods on the node and returns the
 * raw objects.
 */
class PascalRPCClient
{
    /**
     * Creates a new instance of the PascalRPCClient class.
     *
     * @param {String} host
     * @param {Number} port
     */
    constructor(host = 'localhost', port = 4003)
    {
        this.client = jayson.client.http({host, port});
    }

    /**
     * Gets the current pending operations limited by the give start and max
     * parameters.
     *
     * @returns {Array<Object>}
     */
    async getPendings(start = 0, max = 100)
    {
        const response = await this.client.request('getpendings', {start, max});
        if(this.handleOnError(response)) {
            return [];
        }

        //https://github.com/PascalCoin/PascalCoin/issues/86
        return response.result.filter((op) => op !== null);
    }

    /**
     * Gets all currently pending operations.
     * TODO: fetch count and then select "from behind" - if just before a
     *       new block another pending op gets in we'll have a problem.
     *
     * @returns {Array<Object>}
     */
    async getAllPendings()
    {
        let start = 0;
        let ops = [];
        let allOps = [];
        do
        {
            ops = await this.getPendings(start, 100);
            allOps.push(...ops);
            start += 100;
        } while(ops.length > 0);

        return allOps;
    }

    /**
     * Gets the block count.
     *
     * @returns {Number}
     */
    async getBlockCount() {
        return (await this.client.request('getblockcount', [])).result;
    }

    /**
     * Gets the details of the given operation hash.
     *
     * @returns {null|Operation}
     */
    async findOperation(ophash) {
        const response = await this.client.request('fndoperation', {ophash});
        if(this.handleOnError(response)) {
            return null;
        }

        const operation = Operation.createFromRPC(response.result);
        return this.enrichOperation(operation);
    }

    /**
     * Gets the list of operations for the given block with the given limits.
     *
     * @param {Number} block
     * @param {Number} start
     * @param {Number} max
     * @returns {Operation[]}
     */
    async getBlockOperations(block, start = 0, max = 100)
    {
        const response = await this.client.request('getblockoperations', {block, start, max});
        if(this.handleOnError(response)) {
            return [];
        }

        return response.result;
    }

    /**
     * Gets all operations of a single block.
     *
     * @param {Number} block
     * @returns {Operation[]}
     */
    async getAllBlockOperations(block)
    {
        let start = 0;
        let ops = [];
        let allOps = [];
        do
        {
            ops = await this.getBlockOperations(block, start, 100);
            allOps.push(...ops);
            start += 100;
        } while(ops.length > 0);

        return allOps;
    }

    /**
     * Decrypts the given payload and returns either the decrypted payload or
     * null on error.
     *
     * @param {String} payload
     * @returns {String}
     */
    async payloadDecrypt(payload)
    {
        if(payload === '') {
            return null;
        }
        const response = await this.client.request('payloaddecrypt', {payload});
        if(this.handleOnError(response)) {
            return null;
        }

        if(response.result.result === true) {
            return response.result.unenc_payload;
        }

        return null;
    }

    /**
     * Gets the list of last blocks defined by the given num.
     *
     * @param {Number} num
     * @returns {Block[]}
     */
    async getLastBlocks(num)
    {
        const response = await this.client.request('getblocks', {last: num}).catch(function() {
            let a = "B";
        });
        if(this.handleOnError(response)) {
            return [];
        }

        return response.result;
    }

    /**
     *
     * @param {AccountNumber} accountNumber
     */
    async getAccount(accountNumber)
    {
        const response = await this.client.request('getaccount', {account: accountNumber.account});
        if(this.handleOnError(response)) {
            return [];
        }

        return response.result;
    }

    /**
     * Gets a single block.
     *
     * @param {Number} block
     * @returns {Block|null}
     */
    async getBlock(block)
    {
        const response = await this.client.request('getblock', {block});
        if(this.handleOnError(response)) {
            return null;
        }

        return response.result;
    }

    /**
     *
     * @param {String} encPubKey
     */
    async decodePublicKey(encPubKey)
    {
        const response = await this.client.request('decodepubkey', {enc_pubkey: encPubKey});
        if(this.handleOnError(response)) {
            return null;
        }

        return response.result;
    }

    /**
     * This method will take a raw operation object and
     *  - tries to decrypt the payload
     *  - ...
     *
     * @param {Object} operation
     * @returns {Object}
     */
    async enrichOperation(operation)
    {
        operation.payloadDecrypted = await this.payloadDecrypt(operation.payload);

        if(operation.optype === 2 || operation.optype === 7) {
            operation.publicKey = await this.decodePublicKey(operation.enc_pubkey);
        }

        return operation;
    }

    handleOnError(response) {
        if(response === undefined) {
            throw new Error('Unable to connect to node.');
        }

        if(response.error !== undefined) {
            helper.debug(this, `RPC Error: (${response.error.code}) ${response.error.message}`);
            return true;
        }

        return false;
    }
}


module.exports = PascalRPCClient;