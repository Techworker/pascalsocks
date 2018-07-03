/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const BigNumber = require('bignumber.js');

/**
 * A simple wrapper around bignumber for the pascal currency and
 * basic math functions.
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

    /**
     * Gets the pascal value as a string.
     *
     * @returns {string}
     */
    toMolina() {
        return this._value.toString();
    }

    /**
     * Adds the given value to the current value and returns a **new**
     * value.
     *
     * @param {PascalCurrency} addValue
     * @returns {PascalCurrency}
     */
    add(addValue) {
        return new PascalCurrency(
            this.value.plus(addValue.value).toFixed(4)
        );
    }

    /**
     * Subtracts the given value from the current value and returns a
     * **new** value.
     *
     * @param {PascalCurrency} subValue
     * @returns {PascalCurrency}
     */
    sub(subValue) {
        return new PascalCurrency(
            this.value.minus(subValue.value).toFixed(4)
        );
    }

    /**
     * Gets a positive variant of the value. If the value is already
     * positive, the current instance will be returned, else a new
     * instance.
     *
     * @returns {PascalCurrency}
     */
    toPositive()
    {
        if(!this._value.isPositive()) {
            return new PascalCurrency(
                this._value.multipliedBy(-1).toFixed(4)
            );
        }

        return this;
    }

    /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
    serialize()
    {
        return {
            pascal: this.toString(),
            molina: this._value.toString()
        }
    }
}

module.exports = PascalCurrency;