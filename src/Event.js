/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * An abstract event class that provides basic methods for events.
 */
class Event {
  /**
     * Initializes a new event object.
     *
     * @param {String} message
     */
  constructor(message) {
    if (this.constructor.name !== 'Included' && this.constructor.name !== 'Matured') {
      // TODO: dafuq?
      // console.log(message);
    }

    if (new.target === Event) {
      throw new TypeError('Cannot construct Event instance directly');
    }

    this._message = message;
    this._blockNumber = null;
  }

  /**
     * Returns the serialized version of this object.
     */
  async serialize(chain) {
    // serialization caching
    if (this.__serialized !== undefined) {
      return;
    }

    let obj = {
      event: this.constructor.name(),
      message: this.message
    };

    if (this.associated !== null) {
      obj.snapshot = true;
      obj.associated = this.associated;
    }

    this.__serialized = Object.assign(obj, await this.serializeEvent(chain));
  }

  /**
     * Returns the serialized version of this object.
     */
  async serialize(chain) {
    // serialization caching
    if (this.__serialized !== undefined) {
      return;
    }

    let obj = {
      event: this.constructor.name(),
      message: this.message
    };

    if (this.associated !== null) {
      obj.snapshot = true;
      obj.associated = this.associated;
    }

    this.__serialized = Object.assign(obj, await this.serializeEvent(chain));
  }

  serialized() {
    return this.__serialized;
  }

  /**
     * Gets the event message.
     *
     * @returns {String}
     */
  get message() {
    return this._message;
  }

  /**
     * Sets the event message.
     *
     * @param {String} message
     */
  set message(message) {
    this._message = message;
  }

  /**
     * Sets the associated block of the event.
     *
     * @param {Number} associated
     */
  set associated(associated) {
    this._blockNumber = parseInt(associated, 10);
  }

  /**
     * Gets the block number associated with the event.
     *
     * @returns {Number}
     */
  get associated() {
    return this._blockNumber;
  }

  /**
     * Abstract method that serializes event data.
     *
     * @param {BlockChain} chain
     * @return {Object}
     */
  async serializeEvent(chain) {
    throw new Error('Implement `serializeEvent` method in your event.');
  }
}

module.exports = Event;
