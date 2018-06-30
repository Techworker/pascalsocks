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
        // lets fill up all unresolved references of the block
        if(!this.hasPublicKey(block.publicKey.hexaPublicKey))
        {
            const publicKey = PublicKey.createFromRPC(
                await this.rpcClient.decodePublicKey(block.publicKey.hexaPublicKey.toString())
            );
            this.addPublicKey(publicKey);
            block.overwritePublicKey(publicKey);
        } else {
            block.overwritePublicKey(
                this.getPublicKey(block.publicKey.hexaPublicKey)
            );
        }

        // add new block and save it as latest block
        this.blocks.set(block.blockNumber, block);
        this.latestBlock = block;

        // trigger the block.mined event
        this.eventMgr.emit(new EventBlockMined(block));

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
            if(operation.maturation > 0) {
                this.eventMgr.emit(new EventOperationMatured(operation));
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
                new EventOperationNotIncluded(op)
            );
        }

        // now seal all occured events
        this.eventMgr.emit(new EventInternalSeal(block));

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

        // enrich operation with missing references (accounts, public keys, payloads)

        // 1. Accounts
        for (let [, accountNumber] of operation.involvedAccountNumbers)
        {
            if(!this.hasAccount(accountNumber))
            {
                const accountData = await this.rpcClient.getAccount(accountNumber);
                const account = Account.createFromRPC(accountData);
                this.addAccount(account);
                operation.resolveInvolvedAccount(account);

                if(!this.hasPublicKey(account.publicKey.hexaPublicKey)) {
                    const pubKeyData = await this.rpcClient.decodePublicKey(account.publicKey.hexaPublicKey.toString());
                    this.addPublicKey(PublicKey.createFromRPC(pubKeyData));
                }
            } else {
                operation.resolveInvolvedAccount(this.getAccount(accountNumber));
            }
        }

        // add to list
        this.operations.set(operation.opHash.toString(), operation);

        // if its a pending operation we will fire the pending event
        if(operation.isPending()) {
            this.eventMgr.emit(new EventOperationPending(operation));
        }

        // this operation was just recently included, we will trigger the "included" event
        if(!operation.isPending()) {
            this.eventMgr.emit(new EventOperationIncluded(operation));
        }

        // now check the operations infos and send an event for each info
        if(operation.infos !== null)
        {
            operation.infos.forEach((info) => {
                let infoEvent = null;

                // check the type of the info and decide upon it
                switch (info.constructor) {
                    case OperationInfoTransaction:
                        infoEvent = new EventAccountTransaction(operation, info);
                        break;
                    case OperationInfoBuy:
                        infoEvent = new EventAccountBuy(operation, info);
                        break;
                    case OperationInfoChangeKey:
                        infoEvent = new EventAccountChangeKey(operation, info);
                        break;
                    case OperationInfoChangeName:
                        infoEvent = new EventAccountChangeName(operation, info);
                        break;
                    case OperationInfoChangeType:
                        infoEvent = new EventAccountChangeType(operation, info);
                        break;
                    case OperationInfoDelist:
                        infoEvent = new EventAccountDelist(operation, info);
                        break;
                    case OperationInfoForSale:
                        infoEvent = new EventAccountForSale(operation, info);
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
     * @returns {Account}
     */
    getAccount(accountNumber)
    {
        return this.accounts.get(accountNumber.toString());
    }


    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {PublicKey} publicKey
     * @return {BlockChain}
     */
    addPublicKey(publicKey)
    {
        this.publicKeys.set(publicKey.hexaPublicKey.toString(), publicKey);
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
    getPublicKey(hexaPublicKey)
    {
        return this.publicKeys.get(hexaPublicKey.toString());
    }
}

module.exports = BlockChain;