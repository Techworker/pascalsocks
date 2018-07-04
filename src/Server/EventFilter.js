/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const Filter = require('../Filter');

/**
 * A simple class that can check whether an object applies to a list of
 * filters.
 */
class EventFilter {
  /**
     * Creates a new instance of the EventFilter class.
     *
     * @param {[Object]} filters
     */
  constructor(filters) {
    this._filters = filters.map(
      (f) => new Filter(f.property, f.type, f.value)
    );
  }

  /**
     * Gets a value indicating whether the given obj is valid when applied
     * against all filters.
     *
     * @param {Event} event
     * @returns {boolean}
     */
  isValid(event) {
    let isValid = true;

    this._filters.forEach((f) => {
      if (isValid && !f.isValid(EventFilter.getPropertyValue(event.serialized(), f.property))) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
     * Helper function to access an objects property through dot notation to make
     * it easier to fetch nested values.
     *
     * @param {Object} obj
     * @param {String} path
     * @returns {*}
     */
  static getPropertyValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  /**
     * Gets the serialized version of the event filter collection.
     *
     * @returns {Array}
     */
  serialize() {
    return this._filters.map(f => f.serialize());
  }
}

module.exports = EventFilter;
