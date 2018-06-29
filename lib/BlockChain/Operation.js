/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AccountNumber = require('./Type/AccountNumber');
const HexaString = require('./Type/HexaString');
const PascalCurrency = require('./Type/PascalCurrency');

const PublicKey = require('./PublicKey');
const Payload = require('./Type/Payload');

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

    static createFromSerialized(data)
    {
        const op = new Operation();
    }

    /**
     * Creates a new Operation instance.
     *
     * @param {Object} operationData
     */
    static createFromRPC(operationData)
    {
        const op = new Operation();
        op._rpc = operationData;
        op._block = parseInt(operationData.block, 10) || 0;
        op._time = parseInt(operationData.time, 10) || 0;
        op._opBlock = parseInt(operationData.opblock, 10);
        op._maturation = 0;

        // pending
        if(operationData.maturation !== null) {
            op._maturation = parseInt(operationData.maturation, 10);
        }

        op._opType = parseInt(operationData.optype, 10);
        op._subType = parseInt(operationData.subtype, 10);
        op._accountNumber = new AccountNumber(operationData.account);
        op._account = null;
        op._signerAccountNumber = operationData.signer_account ? new AccountNumber(operationData.signer_account) : null;
        op._signerAccount = null;

        op._nOperation = parseInt(operationData.n_operation, 10);

        op._opTxt = operationData.optxt;
        op._fee = new PascalCurrency(operationData.fee);
        op._amount = new PascalCurrency(operationData.amount);
        //this._balance = new PascalCurrency(0);
        //if(operationData.balance !== undefined) {
        //    this._balance = new PascalCurrency(operationData.balance);
        //}

        op._payload = new Payload(operationData.payload);
        op._opHash = new HexaString(operationData.ophash);
        op._infos = [];

        // save transaction data
        op._senders =[];
        op._receivers = [];
        op._changers = [];

        operationData.senders.forEach((s) => op._senders.push(new Sender(s)));
        operationData.receivers.forEach((r) => op._receivers.push(new Receiver(r)));
        operationData.changers.forEach((c) => op._changers.push(new Changer(c)));

        switch(op.opType)
        {
            case Operation.OPTYPE_BLOCKCHAIN_REWARD:
                //let a = "B";
                break;
            case Operation.OPTYPE_TRANSACTION:
                op._senders.forEach((sender, idx) => {
                    /** @var sender Sender */
                    const info = new Transaction(
                        sender.accountNumber,
                        op._receivers[idx].accountNumber,
                        op._receivers[idx].amount,
                        sender.amount.toPositive().sub(op._receivers[idx].amount),
                        sender.payload
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_KEY:
                op._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new ChangeKey(
                        changer.accountNumber,
                        changer.newPubkey,
                        changer.fee
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_LIST_FOR_SALE:
                op._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new ForSale(
                        changer.accountNumber,
                        changer.accountPrice,
                        changer.sellerAccountNumber,
                        changer.lockedUntilBlock !== null,
                        changer.lockedUntilBlock,
                        changer.fee,
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_DELIST:
                op._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new Delist(
                        changer.accountNumber,
                        changer.accountPrice,
                        changer.fee,
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_BUY:
                op._senders.forEach((sender, idx) => {
                    /** @var sender Sender */
                    const info = new BuyAccount(
                        op._receivers[0].accountNumber,
                        op._receivers[1].accountNumber,
                        sender.accountNumber,
                        op._receivers[1].amount,
                        sender.amount.toPositive().sub(op._receivers[1].amount),
                        sender.payload
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_KEY_ACCOUNT:
                op._changers.forEach((changer) => {
                    /** @var sender Sender */
                    const info = new ChangeKeyByAccount(
                        changer.accountNumber,
                        changer.newPubkey,
                        changer.fee
                    );
                    op.infos.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_ACCOUNT_INFO:
                op._changers.forEach((changer) => {
                    /** @var sender Sender */
                    const info = new ChangeAccountInfo(
                        changer.accountNumber,
                        changer.newName,
                        changer.newType,
                        changer.fee
                    );
                    op.infos.push(info);
                });
                break;
            default:
                let a = "B";
                break;
        }

        return op;
    }

    /**
     *
     * @returns {Object}
     */
    get rpc() {
        return this._rpc;
    }
    /**
     * Gets the block number the operation is included.
     *
     * @returns {Number}
     */
    get block() {
        return this._block;
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
    get accountNumber() {
        return this._accountNumber;
    }

    /**
     * Gets the account affected by this operation. Note: A transaction has
     * 2 affected accounts.
     *
     * @returns {Account}
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
     * Operation hash used to find this operation in the blockchain
     *
     * @returns {HexaString}
     */
    get opHash() {
        return this._opHash;
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
    get signerAccountNumber() {
        return this._signerAccountNumber;
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
    get pubKey() {
        return this._pubkey;
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
    get infos() {
        return this._infos;
    }

    /**
     * This will return a Map of all accounts which are somehow related to this
     * operation.
     *
     * @returns {Map}
     */
    get involvedAccountNumbers()
    {
        const accounts = new Map();
        accounts.set(this.accountNumber.toString(), this.accountNumber);
        if(this.signerAccountNumber !== null) {
            accounts.set(this.signerAccountNumber.toString(), this.signerAccountNumber);
        }
        this.senders.forEach((s) => accounts.set(s.accountNumber.toString(), s.accountNumber));
        this.receivers.forEach((r) => accounts.set(r.accountNumber.toString(), r.accountNumber));
        this.changers.forEach((c) => {
            accounts.set(c.accountNumber.toString(), c.accountNumber);
            if(c.sellerAccountNumber !== null) {
                accounts.set(c.sellerAccountNumber.toString(), c.sellerAccountNumber);
            }
        });

        return accounts;
    }

    resolveInvolvedAccount(account) {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }

        if(account.accountNumber.equals(this.signerAccountNumber)) {
            this._signerAccount = account;
        }

        this.senders.forEach((s) => s.resolveInvolvedAccount(account));
        this.receivers.forEach((r) => r.resolveInvolvedAccount(account));
        this.changers.forEach((c) => c.resolveInvolvedAccount(account));
        this.infos.forEach((i) => i.resolveInvolvedAccount(account));
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

    nOperation() {
        return this._nOperation;
    }

    serialize()
    {
        const senders = this.senders.map((s) => s.serialize());
        const receivers = this.receivers.map((r) => r.serialize());
        const changers = this.changers.map((c) => c.serialize());
        const infos = this.infos.map((i) => i.serialize());

        return {
            block: this.block,
            time: this.time,
            op_block: this.opBlock,
            maturation: this.maturation,
            op_type: this.opType,
            sub_type: this.subType,
            accountNumber: this.accountNumber.toString(),
            signerAccountNumber: this.signerAccountNumber.toString(),
            n_operation: this.nOperation,
            op_txt: this.opTxt,
            fee: this.fee.toString(),
            amount: this.amount.toString(),
            payload: this.payload !== null ? this.payload.serialize() : null,
            op_hash: this.opHash.toString(),
            senders, receivers, changers, infos
        }
    }
}

module.exports = Operation;