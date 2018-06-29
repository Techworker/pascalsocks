/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const ForSaleOpInfo = require('../../../lib/BlockChain/OperationInfo/ForSale');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');
const PascalCurrency = require('../../../lib/BlockChain/Type/PascalCurrency');

const assert = require('assert');

describe('ForSale', function()
{
    it(`should work as expected..`, function () {
        let forSale = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'), true);
        assert.strictEqual('12345-54', forSale.accountForSale.toString());
        assert.strictEqual('5678-61', forSale.accountSeller.toString());
        assert.strictEqual(100, forSale.amount.value.toNumber());
        assert.ok(forSale.isPrivate);

        forSale = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'), false);
        assert.strictEqual(false, forSale.isPrivate);

        // default false
        forSale = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'));
        assert.strictEqual(false, forSale.isPrivate);
    });

    it(`should throw an exception if the for sale account number is not an instance of AccountNumber`, function () {
        try{
            new ForSaleOpInfo('12345-54', new PascalCurrency(100), new AccountNumber('5678-61'));
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the seller account number is not an instance of AccountNumber`, function () {
        try{
            new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), '5678-61');
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the amount is not an instance of BigNumber`, function () {
        try{
            new ForSaleOpInfo(new AccountNumber('12345-54'), 100, new AccountNumber('5678-61'));
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should handle invalid isPrivate values as bool`, function () {
        let forSaleOp = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'), '1');
        assert.ok(forSaleOp.isPrivate);
        forSaleOp = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'), 'A');
        assert.strictEqual(true, forSaleOp.isPrivate);
        forSaleOp = new ForSaleOpInfo(new AccountNumber('12345-54'), new PascalCurrency(100), new AccountNumber('5678-61'), undefined);
        assert.strictEqual(false, forSaleOp.isPrivate);
    });
});