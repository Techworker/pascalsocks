/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * A simple type wrapper around bignumber for the pascal currency.
 */
class HexaString
{
    /**
     * Creates a new HexaString instance.
     *
     * @param {String} value
     */
    constructor(value)
    {
        if(value !== '' && !(/[0-9A-Fa-f]/g.test(value))) {
            throw new Error('Invalid hexadecimal string');
        }

        this._value = value;
    }

    /**
     * Gets the BigNumber instance.
     *
     * @returns {BigNumber}
     */
    get value() {
        return this._value;
    }

    /**
     * Gets the pascal value as a string.
     *
     * @returns {string}
     */
    toString() {
        return this._value;
    }

    /**
     * Gets the pascal value converted to ascii.
     *
     * @returns {string}
     */
    toAscii() {
        let ascii = '';
        for (let n = 0; n < this.value.length; n += 2) {
            ascii += String.fromCharCode(parseInt(this.value.substr(n, 2), 16));
        }
        return ascii;
    }
}

module.exports = HexaString;