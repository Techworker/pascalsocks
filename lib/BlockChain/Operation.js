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

const OperationInfoTransaction = require('./OperationInfo/Transaction');
const OperationInfoBuy = require('./OperationInfo/Buy');
const OperationInfoChangeKey = require('./OperationInfo/ChangeKey');
const OperationInfoChangeName = require('./OperationInfo/ChangeName');
const OperationInfoChangeType = require('./OperationInfo/ChangeType');
const OperationInfoDelist = require('./OperationInfo/Delist');
const OperationInfoForSale = require('./OperationInfo/ForSale');

const OperationSender = require('./Operation/Sender');
const OperationReceiver = require('./Operation/Receiver');
const OperationChanger = require('./Operation/Changer');

/**
 * A class thats holds the information about an operation.
 */
class Operation
{
    // The available optypes
    static get OPTYPE_BLOCKCHAIN_REWARD() { return 0; };
    static get OPTYPE_TRANSACTION() { return 1; };
    static get OPTYPE_CHANGE_KEY() { return 2; };
    static get OPTYPE_RECOVER_FUNDS() { return 3; };
    static get OPTYPE_LIST_FOR_SALE() { return 4; };
    static get OPTYPE_DELIST() { return 5; };
    static get OPTYPE_BUY() { return 6; };
    static get OPTYPE_CHANGE_KEY_ACCOUNT() { return 7; };
    static get OPTYPE_CHANGE_ACCOUNT_INFO() { return 8; };
    static get OPTYPE_MULTI_OPERATION() { return 9; };

    /**
     * Creates a new Operation instance from an rpc response.
     *
     * @param {Object} rpc
     */
    static createFromRPC(rpc)
    {
        const instance = new Operation();

        // save rpc data first
        instance._rpc = rpc;

        instance._blockNumber = parseInt(rpc.block, 10) || 0;
        instance._block = null;

        instance._timestamp = parseInt(rpc.time, 10) || 0;

        instance._positionInBlock = parseInt(rpc.opblock, 10);
        instance._maturation = 0;

        // pending
        if(rpc.maturation !== null) {
            instance._maturation = parseInt(rpc.maturation, 10);
        }

        instance._type = parseInt(rpc.optype, 10);
        instance._subType = parseInt(rpc.subtype, 10);
        instance._accountNumber = new AccountNumber(rpc.account);
        instance._account = null;
        instance._accountNumberSigner = rpc.signer_account ? new AccountNumber(rpc.signer_account) : null;
        instance._accountSigner = null;

        instance._opTxt = rpc.optxt;
        instance._fee = new PascalCurrency(rpc.fee);
        instance._amount = new PascalCurrency(rpc.amount);

        instance._payload = Payload.createFromRPCValue(rpc.payload);
        instance._opHash = new HexaString(rpc.ophash);

        // will hold all infos provided in the operation
        instance._infos = [];
        // holds all senders
        instance._senders =[];
        // holds all receivers
        instance._receivers = [];
        // holds all changers
        instance._changers = [];

        // loop given data and initialize objects
        rpc.senders.forEach(
            (s) => instance._senders.push(OperationSender.createFromRPC(s))
        );

        rpc.receivers.forEach(
            (r) => instance._receivers.push(OperationReceiver.createFromRPC(r))
        );

        rpc.changers.forEach(
            (c) => instance._changers.push(OperationChanger.createFromRPC(c))
        );

        // now check the optype and decide upon it what extended operation
        // info we want to collect to better represent an operation and make
        // it identifyable
        switch(instance.type)
        {
            case Operation.OPTYPE_BLOCKCHAIN_REWARD:
                // this never happens
                break;
            case Operation.OPTYPE_RECOVER_FUNDS:
                // this probably never happens
                break;
            case Operation.OPTYPE_MULTI_OPERATION:
                // TODO
                break;
            case Operation.OPTYPE_TRANSACTION:
                instance._senders.forEach((sender, idx) => {
                    const info = new OperationInfoTransaction(
                        sender.accountNumber,
                        instance._receivers[idx].accountNumber,
                        instance._receivers[idx].amount,
                        sender.amount.toPositive().sub(instance._receivers[idx].amount),
                        sender.payload
                    );
                    instance.infos.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_KEY:
            case Operation.OPTYPE_CHANGE_KEY_ACCOUNT:
                instance._changers.forEach((changer, idx) => {
                    const info = new OperationInfoChangeKey(
                        changer.accountNumber,
                        changer.publicKeyNewHex,
                        changer.fee
                    );
                    instance.infos.push(info);
                });
                break;
            case Operation.OPTYPE_LIST_FOR_SALE:
                instance._changers.forEach((changer, idx) => {
                    const info = new OperationInfoForSale(
                        changer.accountNumber,
                        changer.price,
                        changer.accountNumberSeller,
                        changer.lockedUntilBlock !== null,
                        changer.lockedUntilBlock,
                        changer.fee,
                    );
                    instance.infos.push(info);
                });
                break;
            case Operation.OPTYPE_DELIST:
                instance._changers.forEach((changer, idx) => {
                    /** @var sender Sender */
                    const info = new OperationInfoDelist(
                        changer.accountNumber,
                        changer.price,
                        changer.fee,
                    );
                    instance.infos.push(info);
                });
                break;
            case Operation.OPTYPE_BUY:
                instance._senders.forEach((sender, idx) => {
                    // TODO: check access to receiver and maybe use the idx
                    const info = new OperationInfoBuy(
                        instance._receivers[0].accountNumber,
                        instance._receivers[1].accountNumber,
                        sender.accountNumber,
                        instance._receivers[1].amount,
                        sender.amount.toPositive().sub(instance._receivers[1].amount),
                        sender.payload
                    );
                    instance.infos.push(info);
                });
                break;
            case Operation.OPTYPE_CHANGE_ACCOUNT_INFO:
                instance._changers.forEach((changer) => {
                    // TODO: for this to work correctly we need the account history
                    // currently we cannot distinct between the 2 types of changes
                    const infoName = new OperationInfoChangeName(
                        changer.accountNumber,
                        changer.newName,
                        changer.fee
                    );
                    instance.infos.push(infoName);
                    const infoType = new OperationInfoChangeType(
                        changer.accountNumber,
                        changer.newType,
                        changer.fee
                    );
                    instance.infos.push(infoType);
                });
                break;
            default:
                // TODO: handle new ops
                break;
        }

        return instance;
    }

    /**
     * Gets the number of the block.
     *
     * @returns {Number}
     */
    get blockNumber() {
        return this._blockNumber;
    }

    /**
     * Gets the block associated with the operation.
     *
     * @returns {Block|null}
     */
    get block() {
        return this._block;
    }

    /**
     * Gets the timestamp of the operation.
     *
     * @returns {Number}
     */
    get timestamp() {
        return this._timestamp;
    }

    /**
     * Gets the position of the operation inside of the block.
     *
     * @returns {Number}
     */
    get positionInBlock() {
        return this._positionInBlock;
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
    get type() {
        return this._type;
    }

    /**
     * Gets the sub-type of operation.
     *
     * @returns {Number}
     */
    get subType() {
        return this._subType;
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
     * @returns {Account|null}
     */
    get account() {
        return this._account;
    }

    /**
     * Will return the account that signed (and payed fee) for this operation.
     *
     * @returns {AccountNumber}
     */
    get accountNumberSigner() {
        return this._accountNumberSigner;
    }

    /**
     * Will return the account that signed (and payed fee) for this operation.
     *
     * @returns {Account}
     */
    get accountSigner() {
        return this._accountSigner;
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
     * Gets the fee of this operation.
     *
     * @returns {PascalCurrency}
     */
    get fee() {
        return this._fee;
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
     * Gets the balance of the account.
     *
     * @returns {PascalCurrency}
     */
    get balance() {
        return this._amount;
    }

    /**
     * Gets the payload of the operation.
     *
     * @returns {Payload}
     */
    get payload() {
        return this._payload;
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
     * Gets the info that gives a better look at an operation.
     *
     * @returns {Array}
     */
    get infos() {
        return this._infos;
    }

    /**
     * This will return a Map of data that needs to be referenced.
     *
     * @returns {Object}
     */
    get references()
    {
        let references = {
            accounts: new Map(),
            publicKeys: new Map(),
            block: null
        };

        references.block = this.blockNumber;
        references.accounts.set(this.accountNumber.toString(), this.accountNumber);
        if(this.accountNumberSigner !== null) {
            references.accounts.set(this.accountNumberSigner.toString(), this.accountNumberSigner);
        }

        // check other sources
        this.senders.forEach((s) => references = s.references(references));
        this.receivers.forEach((r) => references = r.references(references));
        this.changers.forEach((c) => references = c.references(references));

        return references;
    }

    /**
     * This will try to fillup the object with the given account instance in
     * case it makes sense.
     *
     * @param account
     */
    resolveInvolvedAccount(account) {
        if(account.accountNumber.equals(this.accountNumber)) {
            this._account = account;
        }

        if(account.accountNumber.equals(this.accountNumberSigner)) {
            this._accountSigner = account;
        }

        this.senders.forEach((s) => s.resolveInvolvedAccount(account));
        this.receivers.forEach((r) => r.resolveInvolvedAccount(account));
        this.changers.forEach((c) => c.resolveInvolvedAccount(account));
        this.infos.forEach((i) => i.resolveInvolvedAccount(account));
    }

    /**
     * Gets all senders entries.
     *
     * @returns {[OperationSender]}
     */
    get senders()
    {
        return this._senders;
    }

    /**
     * Gets all receivers entries.
     *
     * @returns {[OperationReceiver]}
     */
    get receivers()
    {
        return this._receivers;
    }

    /**
     * Gets all changers entries.
     *
     * @returns {[Changer2]}
     */
    get changers()
    {
        return this._changers;
    }

    /**
     * Matures the operation for the given block number.
     *
     * @param {Number} currentBlock
     */
    mature(currentBlock) {
        this._maturation = currentBlock - this.blockNumber;
    }

    /**
     * Gets a value indicating whether the operation is pending.
     *
     * @returns {boolean}
     */
    isPending() {
        return this.blockNumber === 0;
    }

    /**
     * Gets the serialized version of the instance.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
    async serialize(chain)
    {
        const senders = await Promise.all(
            this.senders.map(async (s) => await s.serialize(chain))
        );
        const receivers = await Promise.all(
            this.receivers.map(async (r) => await r.serialize(chain))
        );
        const changers = await Promise.all(
            this.changers.map(async (c) => await c.serialize(chain))
        );
        const infos = await Promise.all(
            this.infos.map(async (i) => await i.serialize(chain))
        );

        const account = await chain.getAccount(this.accountNumber);
        const accountSigner = await chain.getAccount(this.accountNumberSigner);
        const block = await chain.getBlock(this.blockNumber);
        return {
            block_number: this.blockNumber,
            block: this.block !== null ? this.block.serialize(chain) : null,
            timestamp: this.timestamp,
            position_in_block: this.positionInBlock,
            maturation: this.maturation,
            type: this.type,
            sub_type: this.subType,
            accountNumber: this.accountNumber.toString(),
            account: account !== null ? await account.serialize(chain) : null,
            accountNumberSigner: this.accountNumberSigner !== null ? this.accountNumberSigner.toString() : null,
            accountSigner: accountSigner !== null ? await accountSigner.serialize(chain) : null,
            op_txt: this.opTxt,
            fee: this.fee.toMolina(),
            amount: this.amount.toMolina(),
            balance: this.balance.toMolina(),
            payload: this.payload !== null ? this.payload.serialize() : null,
            op_hash: this.opHash.toString(),
            // already serialized..
            senders,
            receivers,
            changers,
            infos
        }
    }
}

module.exports = Operation;