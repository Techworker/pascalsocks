/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const BigNumber = require('bignumber.js');

/**
 * A simple type wrapper around bignumber for the pascal currency.
 */
class PascalCurrency
{
    /**
     * Creates a new PascalCurrency instance.
     *
     * @param {Number|String|BigNumber} value
     */
    constructor(value)
    {
        if(typeof value === 'string') {
            value = value.split(',').join('')
        }

        this._value = new BigNumber(value.toString());
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
        return this._value.toFixed(4);
    }

    add(addValue) {
        return new PascalCurrency(this.value.plus(addValue.value).toFixed(4));
    }

    sub(subValue) {
        return new PascalCurrency(this.value.minus(subValue.value).toFixed(4));
    }

    toPositive()
    {
        if(!this._value.isPositive()) {
            return new PascalCurrency(this._value.multipliedBy(-1).toFixed(4));
        }

        return this;
    }
}

module.exports = PascalCurrency;