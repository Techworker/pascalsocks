/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const blockChain = require('../BlockChain');

const AccountNumber = require('./Type/AccountNumber');
const HexaString = require('./Type/HexaString');
const PascalCurrency = require('./Type/PascalCurrency');

const PublicKey = require('./PublicKey');

const BuyAccount = require('./OperationInfo/BuyAccount');
const ChangeKey = require('./OperationInfo/ChangeKey');
const ChangeKeyByAccount = require('./OperationInfo/ChangeKeyByAccount');
const ChangeAccountInfo = require('./OperationInfo/ChangeAccountInfo');
const Delist = require('./OperationInfo/Delist');
const ForSale = require('./OperationInfo/ForSale');
const Transaction = require('./OperationInfo/Transaction');

const Sender = require('./Operation/Sender');
const Receiver = require('./Operation/Receiver');
const Changer = require('./Operation/Changer');

const opParser = require('./OperationParser');

const OPTYPE_BLOCKCHAIN_REWARD = 0;
const OPTYPE_TRANSACTION = 1;
const OPTYPE_CHANGE_KEY = 2;
const OPTYPE_RECOVER_FUNDS = 3;
const OPTYPE_LIST_FOR_SALE = 4;
const OPTYPE_DELIST = 5;
const OPTYPE_BUY = 6;
const OPTYPE_CHANGE_KEY_ACCOUNT = 7;
const OPTYPE_CHANGE_ACCOUNT_INFO = 8;
const OPTYPE_MULTI_OPERATION = 9;

Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
}

/**
 * A class to hold the information about an operation.
 */
class Operation
{
    static get OPTYPE_BLOCKCHAIN_REWARD() { return OPTYPE_BLOCKCHAIN_REWARD; };
    static get OPTYPE_TRANSACTION() { return OPTYPE_TRANSACTION; };
    static get OPTYPE_CHANGE_KEY() { return OPTYPE_CHANGE_KEY; };
    static get OPTYPE_RECOVER_FUNDS() { return OPTYPE_RECOVER_FUNDS; };
    static get OPTYPE_LIST_FOR_SALE() { return OPTYPE_LIST_FOR_SALE; };
    static get OPTYPE_DELIST() { return OPTYPE_DELIST; };
    static get OPTYPE_BUY() { return OPTYPE_BUY; };
    static get OPTYPE_CHANGE_KEY_ACCOUNT() { return OPTYPE_CHANGE_KEY_ACCOUNT; };
    static get OPTYPE_CHANGE_ACCOUNT_INFO() { return OPTYPE_CHANGE_ACCOUNT_INFO; };
    static get OPTYPE_MULTI_OPERATION() { return OPTYPE_MULTI_OPERATION; };

    /**
     * Gets the block number the operation is included.
     *
     * @returns {Number}
     */
    get block() {
        return this._block;
    }

    /**
     * Creates a new Operation instance.
     *
     * @param {Object} operationData
     */
    constructor(operationData)
    {
        this.raw = operationData;
    }

    async init(payloadResolver, publicKeyResolver)
    {
        // TODO: The resolver stuff must go!
        this._block = parseInt(this.raw.block, 10) || 0;
        this._time = parseInt(this.raw.time, 10) || 0;
        this._opBlock = parseInt(this.raw.opblock, 10);
        this._maturation = -1;

        // pending
        if(this.raw.maturation !== null) {
            this._maturation = parseInt(this.raw.maturation, 10);
        }

        this._opType = parseInt(this.raw.optype, 10);
        this._subType = parseInt(this.raw.subtype, 10);
        this._account = new AccountNumber(this.raw.account);
        this._signerAccount = this.raw.signer_account ? new AccountNumber(this.raw.signer_account) : null;

        this._nOperation = parseInt(this.raw.n_operation, 10);

        this._opTxt = this.raw.optxt;
        this._fee = new PascalCurrency(this.raw.fee);
        this._amount = new PascalCurrency(this.raw.amount);
        //this._balance = new PascalCurrency(0);
        //if(operationData.balance !== undefined) {
        //    this._balance = new PascalCurrency(operationData.balance);
        //}

        this._payload = await payloadResolver(this.raw.payload);
        this._opHash = new HexaString(this.raw.ophash);
        this._info = [];

        // save transaction data
        this._senders =[];
        this._receivers = [];
        this._changers = [];


        for (let sender of this.raw.senders) {
            this._senders.push(await new Sender(sender).init(payloadResolver));
        }
        for (let receiver of this.raw.receivers) {
            this._receivers.push(await new Receiver(receiver).init(payloadResolver));
        }
        for (let changer of this.raw.changers) {
            this._changers.push(await new Changer(changer).init(publicKeyResolver));
        }

        switch(this.opType)
        {
            case Operation.OPTYPE_BLOCKCHAIN_REWARD:
                //let a = "B";
                break;
            case Operation.OPTYPE_TRANSACTION:
                this._senders.forEach(function(sender, idx) {
                    /** @var sender Sender */
                    const info = new Transaction(
                        sender.account,
                        this._receivers[idx].account,
                        this._receivers[idx].amount,
                        sender.amount.toPositive().sub(this._receivers[idx].amount),
                        sender.payload
                    );
                    this.info.push(info);
                }.bind(this));
                break;
            case Operation.OPTYPE_CHANGE_KEY:
                this._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new ChangeKey(
                        changer.account,
                        changer.newEncPubkey,
                        changer.fee
                    );
                    this.info.push(info);
                });
                break;
            case Operation.OPTYPE_LIST_FOR_SALE:
                this._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new ForSale(
                        changer.account,
                        changer.accountPrice,
                        changer.sellerAccount,
                        changer.lockedUntilBlock !== null,
                        changer.lockedUntilBlock,
                        changer.fee,
                    );
                    this.info.push(info);
                });
                break;
            case Operation.OPTYPE_DELIST:
                this._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new Delist(
                        changer.account,
                        changer.accountPrice,
                        changer.fee,
                    );
                    this.info.push(info);
                });
                break;
            case Operation.OPTYPE_BUY:
                this._senders.forEach((sender, idx) => {
                    /** @var sender Sender */
                    const info = new BuyAccount(
                        this._receivers[0].account,
                        this._receivers[1].account,
                        sender.account,
                        this._receivers[1].amount,
                        sender.amount.toPositive().sub(this._receivers[1].amount),
                        sender.payload
                    );
                    this.info.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_KEY_ACCOUNT:
                this._changers.forEach((changer) => {
                    /** @var sender Sender */
                    const info = new ChangeKeyByAccount(
                        changer.account,
                        changer.newEncPubkey,
                        changer.fee
                    );
                    this.info.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_ACCOUNT_INFO:
                this._changers.forEach((changer) => {
                    /** @var sender Sender */
                    const info = new ChangeAccountInfo(
                        changer.account,
                        changer.newName,
                        changer.newType,
                        changer.fee
                    );
                    this.info.push(info);
                });
                break;
            default:
                let a = "B";
                break;
        }
    }

    /**
     * Sets the block of the recent operation.
     *
     * @param {Number} block
     */
    set block(block) {
        this._block = block;
    }

    /**
     * Gets the timestamp of the operation.
     *
     * @returns {Number}
     */
    get time() {
        return this._time;
    }

    /**
     * Gets the position of the operation inside of the block.
     *
     * @returns {Number}
     */
    get opBlock() {
        return this._opBlock;
    }

    /**
     * Gets the maturation (age in blocks) of the operation.
     *
     * @returns {Number}
     */
    get maturation() {
        return this._maturation;
    }

    /**
     * Gets the type of operation.
     *
     * @returns {Number}
     */
    get opType() {
        return this._opType;
    }

    /**
     * Gets the account affected by this operation. Note: A transaction has
     * 2 affected accounts.
     *
     * @returns {AccountNumber}
     */
    get account() {
        return this._account;
    }

    /**
     * Gets the human readable operation type.
     *
     * @returns {String}
     */
    get opTxt() {
        return this._opTxt;
    }

    /**
     * Gets the amount of coins transferred from sender_account to dest_account.
     *
     * @returns {PascalCurrency}
     */
    get amount() {
        return this._amount;
    }

    /**
     * Gets the fee of this operation.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
    }

    /**
     * Gets the balance of the affected account after this block is introduced
     * in the Blockchain.
     *
     * @returns {PascalCurrency}
     */
    get balance() {
        return this._balance;
    }

    /**
     * Sender account in a transaction.
     *
     * @returns {AccountNumber|null}
     */
    get senderAccount() {
        return this._senderAccount;
    }

    /**
     * Destination account in a transaction.
     *
     * @returns {AccountNumber|null}
     */
    get destAccount() {
        return this._destAccount;
    }

    /**
     * Operation hash used to find this operation in the blockchain
     *
     * @returns {HexaString}
     */
    get opHash() {
        return this._opHash;
    }

    /**
     * Operation hash as calculated prior to V2. Will only be populated for
     * blocks prior to V2 activation.
     *
     * @returns {HexaString|null}
     */
    get oldOpHash() {
        return this._oldOpHash;
    }

    /**
     * Associated with optype param, can be used to discriminate from the point
     * of view of operation (sender/receiver/buyer/seller ...)
     *
     * @returns {String}
     */
    get subType() {
        return this._subType;
    }

    /**
     * Will return the account that signed (and payed fee) for this operation.
     *
     * @returns {AccountNumber}
     */
    get signerAccount() {
        return this._signerAccount;
    }

    /**
     * Encoded public key in a change key operation (optype = 2).
     *
     * @returns {null|HexaString}
     */
    get encPubKey() {
        return this._encPubkey;
    }

    get publicKey() {
        return this._publicKey;
    }

    get payload() {
        return this._payload;
    }

    /**
     * Gets the info parsed from the operations txt.
     *
     * @returns {BuyAccount|ChangeKey|ChangeAccountInfo|Delist|ForSale|Transaction|null}
     */
    get info() {
        return this._info;
    }

    /**
     * This will return a Map of all accounts which are somehow related to the
     * recent transaction.
     *
     * @returns {Map}
     */
    get accounts()
    {
        const accounts = new Map();
        accounts.set(this.account.toString(), this.account);
        if(this.signerAccount !== null) {
            accounts.set(this.signerAccount.toString(), this.signerAccount);
        }
        this._senders.forEach((sender) => {
            /** @var sender Sender */
            accounts.set(this.signerAccount.toString(), this.signerAccount);
        })
        if(this.info !== null)
        {
            switch(this.info.constructor) {
                case BuyAccount:
                    accounts.set(this.info.account.toString(), this.info.account);
                    break;
                case ChangeAccountInfo:
                    accounts.set(this.info.account.toString(), this.info.account);
                    break;
                case Delist:
                    accounts.set(this.info.account.toString(), this.info.account);
                    break;
                case ForSale:
                    accounts.set(this.info.accountForSale.toString(), this.info.accountForSale);
                    accounts.set(this.info.accountSeller.toString(), this.info.accountSeller);
                    break;
                case Transaction:
                    accounts.set(this.info.senderAccount.toString(), this.info.senderAccount);
                    accounts.set(this.info.destinationAccount.toString(), this.info.destinationAccount);
                    break;
            }
        }

        return accounts;
    }

    /**
     * Gets all senders entries.
     *
     * @returns {Object[]}
     */
    get senders()
    {
        return this._senders;
    }

    get receivers()
    {
        return this._receivers;
    }

    get changers()
    {
        return this._changers;
    }

    /**
     * Matures the recent operation for the given block number.
     *
     * @param {Number} currentBlock
     */
    mature(currentBlock) {
        this._maturation = currentBlock - this.block;
    }

    /**
     * Gets a value indicating whether the operation is pending.
     *
     * @returns {boolean}
     */
    isPending() {
        return this.block === 0;
    }
}

module.exports = Operation;