/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * A simple filter to filter fields on the given object.
 */
class Filter {
  /**
     * Creates a new instance of the Filter class.
     *
     * @param {String} property
     * @param {String} type
     * @param {*} value
     */
  constructor(property, type, value) {
    this._property = property;
    this._type = type;
    this._value = value;
  }

  /**
     * Gets the name of the property.
     *
     * @returns {String}
     */
  get property() {
    return this._property;
  }

  /**
     * Gets the type of the filter.
     *
     * @returns {String}
     */
  get type() {
    return this._type;
  }

  /**
     * Gets the value of the filter.
     *
     * @returns {*}
     */
  get value() {
    return this._value;
  }

  /**
     * Gets a value indicating whether the given value passes the current
     * filter.
     *
     * @param {*} value
     * @returns {boolean}
     */
  isValid(value) {
    switch (this._type) {
      case 'eqns':
        return this.value == value;
      case 'eq':
        return this.value === value;
      case 'lt':
        return this.value < value;
      case 'lteq':
        return this.value <= value;
      case 'gt':
        return this.value < value;
      case 'gteq':
        return this.value >= value;
      default:
        return true;
    }
  }

  /**
     * Gets the serialized version of the filter.
     *
     * @returns {Object}
     */
  serialize() {
    return {
      property: this.property,
      type: this.type,
      value: this.value
    };
  }
}

module.exports = Filter;
