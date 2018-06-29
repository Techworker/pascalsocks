/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';


const ChangeKeyOpInfo = require('../../../lib/BlockChain/OperationInfo/ChangeKey');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');

const assert = require('assert');

describe('ChangeKey', function()
{
    it(`should work as expected..`, function () {
        const changeKey = new ChangeKeyOpInfo(new AccountNumber('12345-54'), 'secp256k1');
        assert.strictEqual('12345-54', changeKey.account.toString());
        assert.strictEqual('secp256k1', changeKey.keyType);
    });

    it(`should throw an exception if the account number is not an instance of AccountNumber`, function () {
        try{
            new ChangeKeyOpInfo('12345-54', 'secp256k1');
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the keytype is not a string`, function () {
        try{
            new ChangeKeyOpInfo(new AccountNumber('12345-54'), 100);
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });

    it(`should throw an exception if the keytype is not valid`, function () {
        try{
            new ChangeKeyOpInfo(new AccountNumber('12345-54'), 'abc');
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });
});