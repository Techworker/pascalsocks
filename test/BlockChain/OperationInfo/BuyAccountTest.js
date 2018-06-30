/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const BuyAccountOpInfo = require('../../../lib/BlockChain/OperationInfo/Buy');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');
const PascalCurrency = require('../../../lib/BlockChain/Type/PascalCurrency');

const assert = require('assert');

describe('Buy', function()
{
    it(`should work as expected..`, function () {
        const buyAccount = new BuyAccountOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100));
        assert.strictEqual('12345-54', buyAccount.account.toString());
        assert.strictEqual(100, buyAccount.amount.value.toNumber());
    });

    it(`should throw an exception if the account number is not an instance of AccountNumber`, function () {
        try{
            new BuyAccountOpInfo('12345-54', new PascalCurrency(100));
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the amount is not an instance of BigNumber`, function () {
        try{
            new BuyAccountOpInfo(new AccountNumber('12345-54'), 100);
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });
});