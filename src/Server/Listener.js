/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Block = require('../Types/Block');
const Operation = require('../Types/Operation');

const interval = require('interval-promise');

/**
 * The blockchain listener. It does nothing else than fetching pending
 * operations and new blocks and fires events which are fetched by the channels
 * and will react based on the channels subscriptions.
 */
class Listener {
  /**
     * Constructor
     *
     * @param {PascalRPCClient} pascalRPCClient
     * @param {BlockChain} blockChain
     */
  constructor(pascalRPCClient, blockChain) {
    this.pascalRPCClient = pascalRPCClient;
    this.blockChain = blockChain;
    this.working = false;
  }

  /**
     * Starts the listener.
     *
     * @param {Number} milliSeconds
     */
  listen(milliSeconds) {
    interval(async () => {
      await this.tick();
    }, milliSeconds);
  }

  /**
     * Changes the current interval. Might be useful to slow it down
     * dynamically.
     *
     * @param {Number} milliSeconds
     */
  changeInterval(milliSeconds) {
    clearInterval(this.interval);
    this.listen(milliSeconds);
  }

  /**
     * Tick methods that gets called repeatedly and will try to fetch all
     * changes.
     */
  async tick() {
    // take care we don't get overrun
    if (this.working) {
      return;
    }

    this.working = true;

    // helper.debug(this, 'tick');
    // we'll fetch the block count to see if the latest block in memory
    // is lower than the block at the node
    const lastMinedBlock = await this.pascalRPCClient.getBlockCount() - 1;

    // ok, a new block, we need to add it to the blockchain
    if (this.blockChain.latestBlock.blockNumber !== lastMinedBlock) {
      // now fetch all operations of the mined block
      const minedOps = await this.pascalRPCClient.getAllBlockOperations(lastMinedBlock);

      for (let o = 0; o < minedOps.length; o++) {
        minedOps[o] = Operation.createFromRPC(minedOps[o]);
      }

      const block = await this.pascalRPCClient.getBlock(lastMinedBlock);

      this.blockChain.addBlock(Block.createFromRPC(block), minedOps);
    }

    // now we fetch all pending transactions and add them to the chain
    // if they are not already there
    const pendingOperations = await this.pascalRPCClient.getPendings();

    for (let o = 0; o < pendingOperations.length; o++) {
      // workaround: https://github.com/PascalCoin/PascalCoin/issues/86
      if (pendingOperations[o] === null) {
        continue;
      }

      const pendingOp = Operation.createFromRPC(pendingOperations[o]);

      // check the chain with the ophash from the raw object before we
      // create a new operation instance
      if (this.blockChain.hasOperation(pendingOp.opHash)) {
        continue;
      }

      /* for (let [, account] of pendingOp.accounts.entries()) {
                this.blockChain.addAccount(await this.pascalRPCClient.getAccount(account));
            }*/

      await this.blockChain.addOperation(pendingOp);
    }

    this.working = false;
  }
}

module.exports = Listener;
