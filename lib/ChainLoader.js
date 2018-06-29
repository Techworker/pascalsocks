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
 * A small helper class that loads the last X blocks into memory.
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
            const block = lastBlocks[i];

            // now fetch all operations of this block
            const allOps = await this.rpcClient.getAllBlockOperations(lastBlocks[i].block);
            for(let j = 0; j < allOps.length; j++) {
                allOps[j] = new Operation(allOps[j]);
                await allOps[j].init(async (payload) => {
                    return await this.rpcClient.payloadDecrypt(payload);
                }, async (publicKey) => {
                    return await this.rpcClient.decodePublicKey(publicKey);
                });

                for (let [, account] of allOps[j].accounts.entries()) {
                    this.chain.addAccount(await this.rpcClient.getAccount(account));
                }
            }

            this.chain.addBlock(block, allOps);

            //console.log(accounts);

            /*
            // now loop the notifiable accounts and update them
            for (let [, accountNo] of accounts.entries()) {
                const updatedAccount = await this.rpcClient.getAccount(accountNo);
                //console.log('updating account: ' + accountNo)
                this.chain.addAccount(new Account(updatedAccount));
            }
            for(let z = 0; z < 5; z++) {
                const accountNumber = new AccountNumber(block.block * 5 + z);
                const newAccount = await this.rpcClient.getAccount(accountNumber);
                this.chain.addAccount(new Account(newAccount));
                //console.log('adding new account: ' + accountNumber)
            }*/
        }

        console.info('dumped!')
    }
}

module.exports = ChainLoader;