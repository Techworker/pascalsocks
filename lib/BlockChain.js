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
const BlockMinedEvent = require('./Events/Block/Mined');

// "Operation" channel events
const OperationMaturedEvent = require('./Events/Operation/Matured');
const OperationPendingEvent = require('./Events/Operation/Pending');
const OperationIncludedEvent = require('./Events/Operation/Included');
const OperationNotIncludedEvent = require('./Events/Operation/NotIncluded');

// "Account" channel events
const AccountBuyEvent = require('./Events/Account/BuyAccount');
const AccountChangeKeyEvent = require('./Events/Account/ChangeKey');
const AccountChangeAccountKeyEvent = require('./Events/Account/ChangeAccountKey');
const AccountChangeNameAndTypeEvent = require('./Events/Account/ChangeNameAndType');
const AccountDelistEvent = require('./Events/Account/Delist');
const AccountForSaleEvent = require('./Events/Account/ForSale');
const AccountTransactionEvent = require('./Events/Account/Transaction');

// internal events
const InternalSealEvent = require('./Events/Internal/Seal');

// additional information for operations
const OperationInfoTransaction = require('./BlockChain/OperationInfo/Transaction');
const OperationInfoBuy = require('./BlockChain/OperationInfo/BuyAccount');
const OperationInfoChangeAccountKey = require('./BlockChain/OperationInfo/ChangeKeyByAccount');
const OperationInfoChangeKey = require('./BlockChain/OperationInfo/ChangeKey');
const OperationInfoChangeNameAndType = require('./BlockChain/OperationInfo/ChangeAccountInfo');
const OperationInfoDelist = require('./BlockChain/OperationInfo/Delist');
const OperationInfoForSale = require('./BlockChain/OperationInfo/ForSale');

// types
const Operation = require('./BlockChain/Operation');
const PublicKey = require('./BlockChain/PublicKey');
const Account = require('./BlockChain/Account');

/**
 * This database class will hold the chain in its own data structure and will
 * emit events on changes.
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
        this.blocks.set(block.block, block);
        this.latestBlock = block;

        // trigger the block.mined event
        this.eventMgr.emit(new BlockMinedEvent(block));

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
            operation.mature(block.block);
            // fire event if the operation is older than 0 blocks.
            if(operation.maturation > 0) {
                this.eventMgr.emit(new OperationMaturedEvent(operation));
            }
        }

        // now loop all operations of the new block and add them to the list of
        // operations.
        for(let o = 0; o < operations.length; o++) {
            await this.addOperation(operations[o]);
            // remove the first 8 chars of the hash, this identifies the
            // block - otherwise we cannot simply compare the operations to
            // find out if one was not included.
            includedOps.set(operations[o].opHash.toString().substring(8), operations[o]);
        }

        // now lets find out if a operation was not included
        const notIncluded = Array.from(pendingOps.keys())
            .filter(opHash => !includedOps.has(opHash));

        // loop the ops and fire events
        for(let ni = 0; ni < notIncluded.length; ni++) {
            const op = pendingOps.get(notIncluded[ni]);
            this.eventMgr.emit(
                new OperationNotIncludedEvent(op)
            );
        }

        // seal all occured events
        this.eventMgr.emit(new InternalSealEvent(block));

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
        // we are sure we add the operation, so lets enrich it and fetch all
        // related data (accounts, public keys, payloads)

        for (let [, accountNumber] of operation.involvedAccountNumbers) {
            if(!this.hasAccount(accountNumber)) {
                const accountData = await this.rpcClient.getAccount(accountNumber);
                const account = new Account(accountData);
                this.addAccount(account);
                //operation.resolveInvolvedAccount(account);

                if(!this.hasPublicKey(account.pubkey.encPubkey)) {
                    const pubKeyData = await this.rpcClient.decodePublicKey(account.pubkey.encPubkey.toString());
                    this.addPublicKey(new PublicKey(pubKeyData));
                    //operation.resolveInvolvedPublicKey(account);
                }
            }
        }

        // add to list
        this.operations.set(operation.opHash.toString(), operation);

        // if its a pending operation we will fire the pending event
        if(operation.isPending()) {
            this.eventMgr.emit(new OperationPendingEvent(operation));
        }

        // this operation was just recently included, we will trigger the
        // "included" event
        if(!operation.isPending()) {
            this.eventMgr.emit(new OperationIncludedEvent(operation));
        }

        // now check the operations infos and send an event for each info
        if(operation.infos !== null)
        {
            operation.infos.forEach((info) => {
                let infoEvent = null;

                // check the type of the info and decide upon it
                switch (info.constructor) {
                    case OperationInfoTransaction:
                        infoEvent = new AccountTransactionEvent(operation, info, {
                            senderAccount: this.getAccount(info.senderAccountNumber),
                            destinationAccount: this.getAccount(info.destinationAccountNumber),
                        });
                        break;
                    case OperationInfoBuy:
                        infoEvent = new AccountBuyEvent(operation, info);
                        break;
                    case OperationInfoChangeAccountKey:
                        infoEvent = new AccountChangeAccountKeyEvent(operation, info);
                        break;
                    case OperationInfoChangeKey:
                        infoEvent = new AccountChangeKeyEvent(operation, info);
                        break;
                    case OperationInfoChangeNameAndType:
                        infoEvent = new AccountChangeNameAndTypeEvent(operation, info);
                        break;
                    case OperationInfoDelist:
                        infoEvent = new AccountDelistEvent(operation, info);
                        break;
                    case OperationInfoForSale:
                        infoEvent = new AccountForSaleEvent(operation, info);
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
        this.publicKeys.set(publicKey.encPubkey.toString(), publicKey);
        return this;
    }

    /**
     * Adds a single account to the list of accounts in the chain.
     *
     * @param {HexaString} encPubkey
     * @return {Boolean}
     */
    hasPublicKey(encPubkey)
    {
        return this.publicKeys.has(encPubkey.toString());
    }

    /**
     * Gets an public key
     *
     * @param {HexaString} encPubkey
     * @returns {Account}
     */
    getPublicKey(encPubkey)
    {
        return this.publicKeys.get(encPubkey.toString());
    }
}

module.exports = BlockChain;