/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Block = require('./BlockChain/Block');

const helper = require('./helper');

// events
const Event = require('./Event');

// "Block" channel events
const EventBlockMined = require('./Events/Block/Mined');

// "Operation" channel events
const EventOperationMatured = require('./Events/Operation/Matured');
const EventOperationPending = require('./Events/Operation/Pending');
const EventOperationIncluded = require('./Events/Operation/Included');
const EventOperationNotIncluded = require('./Events/Operation/NotIncluded');

// "Account" channel events
const EventAccountBuy = require('./Events/Account/Buy');
const EventAccountChangeKey = require('./Events/Account/ChangeKey');
const EventAccountChangeName = require('./Events/Account/ChangeName');
const EventAccountChangeType = require('./Events/Account/ChangeType');
const EventAccountDelist = require('./Events/Account/Delist');
const EventAccountForSale = require('./Events/Account/ForSale');
const EventAccountTransaction = require('./Events/Account/Transaction');

// internal events
const EventInternalSeal = require('./Events/Internal/Seal');

// additional information for operations
const OperationInfoTransaction = require('./BlockChain/OperationInfo/Transaction');
const OperationInfoBuy = require('./BlockChain/OperationInfo/Buy');
const OperationInfoChangeKey = require('./BlockChain/OperationInfo/ChangeKey');
const OperationInfoChangeName = require('./BlockChain/OperationInfo/ChangeName');
const OperationInfoChangeType = require('./BlockChain/OperationInfo/ChangeType');
const OperationInfoDelist = require('./BlockChain/OperationInfo/Delist');
const OperationInfoForSale = require('./BlockChain/OperationInfo/ForSale');

// types
const Operation = require('./BlockChain/Operation');
const PublicKey = require('./BlockChain/PublicKey');
const Account = require('./BlockChain/Account');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

/**
 * This memory database class will hold the chain in its own data structure
 * and will emit events on changes / new operations / new blocks.
 */
class BlockChain
{
    /**
     * Creates a new instance of the BlockChain class.
     *
     * @param {EventManager} eventMgr
     * @param {PascalRPCClient} rpcClient
     */
    constructor(eventMgr, rpcClient)
    {
        this.eventMgr = eventMgr;
        this.rpcClient = rpcClient;

        // initialize parts of the chain
        this.blocks = new Map;
        this.operations = new Map;
        this.accounts = new Map;
        this.publicKeys = new Map;
        this.latestBlock = null;
    }

    /**
     * Adds a single block to the chain together with all its operations. All
     * pending operations will be removed and all existing operations will
     * mature.
     *
     * @param {Block} block
     * @param {Operation[]} operations
     * @return BlockChain
     */
    async addBlock(block, operations)
    {
        // add new block and save it as latest block
        this.blocks.set(block.blockNumber, block);
        this.latestBlock = block;

        // trigger the block.mined event
        this.eventMgr.emit(new EventBlockMined(await block.serialize(this)));

        // we will save the pending as well as the included operations to see
        // if any pending operation was not included.
        const pendingOps = new Map;
        const includedOps = new Map;

        // loop through all operations, remove the pendings and mature all
        // operations.
        for (let [opHash, operation] of this.operations) {

            // remove the pending operation
            if(operation.isPending()) {
                // remove the first 8 chars of the hash, this identifies the
                // block - which does not exist for pending transactions
                pendingOps.set(opHash.toString().substring(8), operation);
                this.operations.delete(opHash.toString());
                continue;
            }

            // mature all other operations
            operation.mature(block.blockNumber);

            // fire event if the operation is older than 0 blocks.
            // TODO: config value
            if(operation.maturation > 0 && operation.maturation < 3) {
                this.eventMgr.emit(new EventOperationMatured(await operation.serialize(this)));
            }
        }

        // now loop all operations of the new block and add them to the list of
        // operations.
        for(let o = 0; o < operations.length; o++)
        {
            await this.addOperation(operations[o]);
            // remove the first 8 chars of the hash, this identifies the
            // block - otherwise we cannot simply compare the operations to
            // find out if one was not included.
            includedOps.set(operations[o].opHash.toString().substring(8), operations[o]);
        }

        // now lets find out if a pending operation was not included
        const notIncluded = Array.from(pendingOps.keys())
            .filter(opHash => !includedOps.has(opHash));

        // loop the unincluded ops and fire events
        for(let ni = 0; ni < notIncluded.length; ni++) {
            const op = pendingOps.get(notIncluded[ni]);
            this.eventMgr.emit(
                new EventOperationNotIncluded(await op.serialize(this))
            );
        }

        // now seal all occured events
        this.eventMgr.emit(new EventInternalSeal(await block.serialize(this)));

        return this;
    }

    /**
     * Gets a value indicating whether the given operation hash already exists
     * in the database.
     *
     * @param {HexaString} opHash
     * @returns {boolean}
     */
    hasOperation(opHash) {
        return this.operations.has(opHash.toString());
    }

    /**
     * Adds a single operation to the chain.
     *
     * @param {Operation} operation
     * @return {BlockChain}
     */
    async addOperation(operation)
    {
        // TODO: This needs some rework
        // TODO: fetch the account state at the blockchain point in time -
        //       so create an account history

        // add to list
        this.operations.set(operation.opHash.toString(), operation);

        // if its a pending operation we will fire the pending event
        if(operation.isPending()) {
            this.eventMgr.emit(
                new EventOperationPending(await operation.serialize(this))
            );
        }

        // this operation was just recently included, we will trigger the "included" event
        if(!operation.isPending()) {
            this.eventMgr.emit(
                new EventOperationIncluded(await operation.serialize(this))
            );
        }

        // now check the operations infos and send an event for each info
        if(operation.infos !== null)
        {
            await asyncForEach(operation.infos, async (info) => {
                let infoEvent = null;

                // check the type of the info and decide upon it
                switch (info.constructor) {
                    case OperationInfoTransaction:
                        infoEvent = new EventAccountTransaction(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoBuy:
                        infoEvent = new EventAccountBuy(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoChangeKey:
                        infoEvent = new EventAccountChangeKey(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoChangeName:
                        infoEvent = new EventAccountChangeName(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoChangeType:
                        infoEvent = new EventAccountChangeType(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoDelist:
                        infoEvent = new EventAccountDelist(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    case OperationInfoForSale:
                        infoEvent = new EventAccountForSale(
                            await operation.serialize(this),
                            await info.serialize(this)
                        );
                        break;
                    default:
                        // TODO: throw exception
                        const howCanThisHappen = "IDontKnowYet";
                        break;
                }

                // check if we have an event
                if (infoEvent !== null) {
                    this.eventMgr.emit(infoEvent);
                }
            });
        }

        return this;
    }

    emitEvent(event) {

    }

    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {Account} account
     * @return {BlockChain}
     */
    addAccount(account)
    {
        this.accounts.set(account.accountNumber.toString(), account);
        return this;
    }

    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {AccountNumber} accountNumber
     * @return {Boolean}
     */
    hasAccount(accountNumber)
    {
        return this.accounts.has(accountNumber.toString());
    }

    /**
     * Gets an account by the given account number.
     *
     * @param {AccountNumber} accountNumber
     * @returns {Account|null}
     */
    async getAccount(accountNumber)
    {
        if(accountNumber === null) {
            return null;
        }

        if(!this.hasAccount(accountNumber)) {
            const accountData = await this.rpcClient.getAccount(accountNumber);
            const account = Account.createFromRPC(accountData);
            account.publicKey = await this.getPublicKey(account.publicKeyHex);
            this.addAccount(account);
        }

        return this.accounts.get(accountNumber.toString());
    }

    /**
     * Gets an account by the given account number.
     *
     * @param {Number} blockNumberccountNumber
     * @returns {Account|null}
     */
    getBlock(blockNumber)
    {
        return this.blocks.get(blockNumber);
    }


    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {PublicKey} publicKey
     * @return {BlockChain}
     */
    addPublicKey(publicKey)
    {
        this.publicKeys.set(publicKey.hex.toString(), publicKey);
        return this;
    }

    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {HexaString} hexaPublicKey
     * @return {Boolean}
     */
    hasPublicKey(hexaPublicKey)
    {
        return this.publicKeys.has(hexaPublicKey.toString());
    }

    /**
     * Gets an public key
     *
     * @param {HexaString} hexaPublicKey
     * @returns {PublicKey}
     */
    async getPublicKey(hexaPublicKey)
    {
        if(hexaPublicKey === null) {
            return null;
        }

        if(!this.hasPublicKey(hexaPublicKey))
        {
            const publicKey = PublicKey.createFromRPC(
                await this.rpcClient.decodePublicKey(hexaPublicKey.toString())
            );
            this.addPublicKey(publicKey);
        }

        return this.publicKeys.get(hexaPublicKey.toString());
    }
}

module.exports = BlockChain;