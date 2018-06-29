/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Written by Benjamin Ansbach <benjaminansbach@gmail.com>
 */

'use strict';

const HexaString = require('../../../lib/BlockChain/Type/HexaString');

const assert = require('assert');

describe('HexaString', function()
{
    it(`should be able to parse a simple hexa string`, function () {
        new HexaString('abcdefABCDEF1234567890');
        assert.ok(true);
    });

    it(`should throw an error with invalid strings`, function () {
        try
        {
            new HexaString('g');
            assert.ok(false);
        }
        catch(ex) {
            assert.ok(true);
        }
    });
});