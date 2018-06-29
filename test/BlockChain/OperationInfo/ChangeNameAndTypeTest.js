/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const ChangeNameAndTypeTypeOpInfo = require('../../../lib/BlockChain/OperationInfo/ChangeAccountInfo');
const AccountNumber = require('../../../lib/BlockChain/Type/AccountNumber');

const assert = require('assert');

describe('ChangeNameAndType', function()
{
    it(`should work as expected..`, function () {
        const changeType = new ChangeNameAndTypeTypeOpInfo(new AccountNumber('12345-54'), true, true);
        assert.strictEqual('12345-54', changeType.account.toString());
        assert.ok(changeType.isNameChange);
        assert.ok(changeType.isTypeChange);
    });

    it(`should throw an exception if the account number is not an instance of AccountNumber`, function () {
        try{
            new ChangeNameAndTypeTypeOpInfo('12345-54');
            assert.ok(false, 'No Exception thrown!');
        } catch(ex) {
            assert.ok(true);
        }
    });
});