/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const DelistOpInfo = require('../../../lib/BlockChain/OperationInfo/Delist');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');

const assert = require('assert');

describe('Delist', function()
{
    it(`should work as expected..`, function () {
        const delist = new DelistOpInfo(new AccountNumber('12345-54'));
        assert.strictEqual('12345-54', delist.account.toString());
    });

    it(`should throw an exception if the account number is not an instance of AccountNumber`, function () {
        try{
            new DelistOpInfo('12345-54');
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });
});