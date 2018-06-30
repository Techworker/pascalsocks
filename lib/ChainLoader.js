/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Block = require('./BlockChain/Block');
const Operation = require('./BlockChain/Operation');
const Account = require('./BlockChain/Account');
const AccountNumber = require('./BlockChain/Type/AccountNumber');

const helper = require('./helper');

/**
 * A small helper class that loads the last X blocks into memory. This is used
 * at the startup and just replays the chain.
 */
class ChainLoader
{
    /**
     * Creates a new instance of the ChainDumper class.
     *
     * @param {PascalRPCClient} rpcClient
     * @param {BlockChain} chain
     */
    constructor(rpcClient, chain)
    {
        this.rpcClient = rpcClient;
        this.chain = chain;
    }

    /**
     * This will load the blockchain with the given number of blocks.
     *
     * @returns {Promise.<void>}
     */
    async load(numberOfBlocks)
    {
        helper.debug(this, `fetching last ${numberOfBlocks} blocks`);
        let lastBlocks = await this.rpcClient.getLastBlocks(numberOfBlocks);
        // loop each block
        for(let i = lastBlocks.length - 1; i >= 0; i--)
        {
            // extract it
            const block = Block.createFromRPC(lastBlocks[i]);

            // now fetch all operations of this block
            const allOps = await this.rpcClient.getAllBlockOperations(lastBlocks[i].block);
            await this.chain.addBlock(block, allOps.map((op) => Operation.createFromRPC(op)));
        }

        console.info('dumped!')
    }
}

module.exports = ChainLoader;