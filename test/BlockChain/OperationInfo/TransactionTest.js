/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const TransactionOpInfo = require('../../../lib/BlockChain/OperationInfo/Transaction');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');
const PascalCurrency = require('../../../lib/BlockChain/Type/PascalCurrency');

const assert = require('assert');

describe('Transaction', function()
{
    it(`should work as expected..`, function () {
        let ta = new TransactionOpInfo(new AccountNumber('12345-54'), new AccountNumber('5678-61'), new PascalCurrency(100));
        assert.strictEqual('12345-54', ta.senderAccount.toString());
        assert.strictEqual('5678-61', ta.destinationAccount.toString());
        assert.strictEqual(100, ta.amount.value.toNumber());
    });

    it(`should throw an exception if the for sender account number is not an instance of AccountNumber`, function () {
        try{
            new TransactionOpInfo('12345-54', new AccountNumber('5678-61'), new PascalCurrency(100));
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the destination account number is not an instance of AccountNumber`, function () {
        try{
            new TransactionOpInfo(new AccountNumber('12345-54'), '5678-61', new PascalCurrency(100));
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the amount is not an instance of PascalCurrency`, function () {
        try{
            new TransactionOpInfo(new AccountNumber('12345-54'), new AccountNumber('5678-61'), 100);
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });
});