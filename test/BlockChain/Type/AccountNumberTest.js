/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');

const assert = require('assert');

describe('AccountNumber', function()
{
    it(`should be able to parse an account number + checksum`, function () {
        const acc = new AccountNumber('12345-54');
        assert.strictEqual(12345, acc.account);
        assert.strictEqual(54, acc.checksum);
    });

    it(`should be able to calculate the checksum itself`, function () {
        const acc = new AccountNumber('5678');
        assert.strictEqual(5678, acc.account);
        assert.strictEqual(61, acc.checksum);
    });

    it(`should throw an exception if the checksum is wrong`, function () {
        try {
            const acc = new AccountNumber('5678-9');
            assert.ok(false);
        }
        catch(ex) {
            assert.ok(true);
        }
    });

    it(`should be able to instantiate from other instance`, function () {
        const acc1 = new AccountNumber('5678');
        const acc2 = new AccountNumber(acc1);
        assert.strictEqual(acc1.account, acc2.account);
        assert.strictEqual(acc1.checksum, acc2.checksum);
    });
});