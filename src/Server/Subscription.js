/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const EventFilter = require('./EventFilter');

class Subscription {
  /**
     * Constructor.
     *
     * @param {String} clientId
     * @param {String} ident
     * @param {String} event
     * @param {String} snapshot
     * @param {Array} filters
     */
  constructor(clientId, ident, event, snapshot, filters = []) {
    this._clientId = clientId;
    this._ident = ident;
    this._event = event;
    this._snapshot = snapshot;
    this._filters = new EventFilter(filters);
    this._active = false;
  }

  /**
     * Gets the clientId.
     *
     * @returns {String|*}
     */
  get clientId() {
    return this._clientId;
  }

  /**
     * Gets the ident the subscriber defined.
     *
     * @returns {String}
     */
  get ident() {
    return this._ident;
  }

  /**
     * Gets the name of the event one will listen to.
     *
     * @returns {String}
     */
  get event() {
    return this._event;
  }

  /**
     * Gets the clientIsnapshot depth.
     *
     * @returns {Number}
     */
  get snapshot() {
    return this._snapshot;
  }

  /**
     * Gets the list of filters.
     *
     * @returns {EventFilter}
     */
  get filters() {
    return this._filters;
  }

  /**
     * Gets a value indicating whether the subscription is active.
     *
     * @returns {boolean}
     */
  isActive() {
    return this._active;
  }

  /**
     * Activates the subscription.
     */
  activate() {
    this._active = true;
  }

  /**
     * De-Activates the subscription.
     */
  deactivate() {
    this._active = false;
  }

  /**
     * Gets a value indicating whether the given event applies to the
     * subscriptions filter.
     *
     * @param {Event} event
     * @returns {boolean}
     */
  eventApplies(event) {
    return this.filters.isValid(event);
  }

  /**
     * Gets the serialized version of the subscription.
     *
     * @returns {Object}
     */
  serialize() {
    return {
      clientId: this.clientId,
      ident: this.ident,
      event: this.event,
      snapshot: this.snapshot,
      filters: this.filters.serialize()
    };
  }
}

module.exports = Subscription;
