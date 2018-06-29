/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const PascalCurrency = require('./Type/PascalCurrency');
const AccountNumber = require('./Type/AccountNumber');

const ForSale = require('./OperationInfo/ForSale');
const Delist = require('./OperationInfo/Delist');
const BuyAccount = require('./OperationInfo/BuyAccount');
const ChangeKey = require('./OperationInfo/ChangeKey');
const ChangeAccountKey = require('./OperationInfo/ChangeKeyByAccount');
const ChangeAccountInfo = require('./OperationInfo/ChangeAccountInfo');
const Transaction = require('./OperationInfo/Transaction');

// regex helper
const ACC = '\\d+\\-\\d+';
const PR = '\\b[\\.,\\d][^\\s]*\\b';

/**
 * A simple parser that tries to get the most out of the operation text
 * depending on the op type.
 *
 * This is not necessarily reliable. The text is created by the recent
 * implementation, but can be dropped any time or might not be used in another
 * implementation of the node software.
 */
class OperationParser
{
    /**
     * Universal method that tries to parse the given op txt and returns either
     * a valid OperationInfo.* instance or null.
     *
     * @param {Number} opType
     * @param {String} opTxt
     * @returns {BuyAccount|ChangeKey|ChangeAccountInfo|Delist|ForSale|Array|null}
     */
    parse(opType, opTxt)
    {
        switch (opType) {
            case 1:
                return this.parseTransaction(opTxt);
                break;
            case 2:
                return this.parseChangeKey(opTxt);
                break;
            case 4:
                return this.parseForSale(opTxt);
                break;
            case 5:
                return this.parseDelist(opTxt);
                break;

            case 6:
                return this.parseBuyAccount(opTxt);
                break;
            case 7:
                return this.parseChangeAccountKey(opTxt);
                break;
            case 8:
                return this.parseChangeAccountInfo(opTxt);
                break;
            default:
                let a = "b";
                break;
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a list account
     * operation.
     *
     * @param {String} opTxt
     * @returns {ForSale|null}
     */
    parseForSale(opTxt)
    {
        let matches;
        // simple account for sale
        let regex = `List account (${ACC}) for sale price (${PR}) PASC pay to (${ACC})`;
        if ((matches = this.getMatch(regex, opTxt, 3)) !== false) {
            return new ForSale(
                new AccountNumber(matches[0]),
                new PascalCurrency(matches[1]),
                new AccountNumber(matches[2])
            );
        }

        // private sale of account
        regex = `List account (${ACC}) for private sale price (${PR}) PASC pay to (${ACC})`;
        if ((matches = this.getMatch(regex, opTxt, 3)) !== false) {
            return new ForSale(
                new AccountNumber(matches[0]),
                new PascalCurrency(matches[1]),
                new AccountNumber(matches[2]),
                true
            );
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a transactional
     * operation.
     *
     * @param {String} opTxt
     * @returns {Transaction|null}
     */
    parseTransaction(opTxt)
    {
        let matches;
        // simple account for sale
        // Tx-Out 100.0182 PASC from 986620-47 to 285630-91
        let regex = `"Tx-Out ${PR} PASC from ${ACC} to ${ACC}`;
        if ((matches = this.getMatch(regex, opTxt, 3)) !== false) {
            return new Transaction(
                new AccountNumber(matches[1]),
                new AccountNumber(matches[2]),
                new PascalCurrency(matches[0])
            );
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a list account
     * operation.
     *
     * @param {String} opTxt
     * @returns {Delist|null}
     */
    parseDelist(opTxt)
    {
        let matches;
        let regex = `Delist account (${ACC}) for sale`;
        if ((matches = this.getMatch(regex, opTxt, 1)) !== false) {
            return new Delist(new AccountNumber(matches[0]));
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a Buy account
     * operation.
     *
     * @param {String} opTxt
     * @returns {BuyAccount|null}
     */
    parseBuyAccount(opTxt)
    {
        let matches;
        let regex = `Buy account (${ACC}) for (${PR}) PASC`;
        if ((matches = this.getMatch(regex, opTxt, 2)) !== false) {
            return new BuyAccount(new AccountNumber(matches[0]), new PascalCurrency(matches[1]));
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a change key
     * operation.
     *
     * @param {String} opTxt
     * @returns {ChangeKey|null}
     */
    parseChangeAccountKey(opTxt)
    {
        let matches;
        let regex = `Change (${ACC}) account key to (.*)`;
        if ((matches = this.getMatch(regex, opTxt, 2)) !== false) {
            return new ChangeAccountKey(new AccountNumber(matches[0]), matches[1]);
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a change key
     * operation.
     *
     * @param {String} opTxt
     * @returns {ChangeKey|null}
     */
    parseChangeKey(opTxt)
    {
        let matches;
        let regex = `Change Key to (.*)`;
        if ((matches = this.getMatch(regex, opTxt, 1)) !== false) {
            return new ChangeKey(matches[0]);
        }

        return null;
    }

    /**
     * Tries to parse the info embedded in the operation text of a change key
     * operation.
     *
     * @param {String} opTxt
     * @returns {ChangeAccountInfo|null}
     */
    parseChangeAccountInfo(opTxt)
    {
        let matches;
        let regex = `Changed type of account (${ACC})`;
        if ((matches = this.getMatch(regex, opTxt, 1)) !== false) {
            return new ChangeAccountInfo(new AccountNumber(matches[0]), true, false);
        }

        regex = `Changed name of account (${ACC})`;
        if ((matches = this.getMatch(regex, opTxt, 1)) !== false) {
            return new ChangeAccountInfo(new AccountNumber(matches[0]), false, true);
        }

        regex = `Changed name,type of account (${ACC})`;
        if ((matches = this.getMatch(regex, opTxt, 1)) !== false) {
            return new ChangeAccountInfo(new AccountNumber(matches[0]), true, true);
        }

        return null;
    }

    /**
     * Small helper function that tries to match the given regex to the given
     * target and returns the results.
     *
     * @param {String} regex
     * @param {String} target
     * @param {Number} numExpected
     */
    getMatch(regex, target, numExpected) {
        const expr = new RegExp(regex);
        let m;
        if ((m = expr.exec(target)) !== null && m.length === numExpected + 1) {
            m.shift();
            return m;
        }

        return false;
    }
}

module.exports = new OperationParser();