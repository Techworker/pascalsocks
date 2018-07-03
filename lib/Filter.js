/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * A simple filter to filter fields on the given object.
 */
class Filter
{
    constructor(field, filter, value)
    {
        this._field = field;
        this._filter = filter;
        this._value = value;
    }

    isValid(obj)
    {
        switch(this._filter) {
            case 'eq':
                return obj[this._field] === value;
                break;
            case 'lt':
                return obj[this._field] < value;
                break;
            case 'lteq':
                return obj[this._field] <= value;
                break;
            case 'gt':
                return obj[this._field] < value;
                break;
            case 'gteq':
                return obj[this._field] >= value;
                break;
            default:
                return true;
        }
    }

    serialize()
    {
        return {
            field: this._field,
            filter: this._filter,
            value: this._value
        };
    }
}

module.exports = Filter;