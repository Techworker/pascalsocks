/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The welcome event that is sent to a new client.
 */
class Error extends AbstractEvent {

  /**
   * Gets the name of the event.
   *
   * @return {String}
   */
  static name() {
    return 'error';
  }

  /**
   * Creates a new instance of the the Error class.
   *
   * @param {String} error
   */
  constructor(error) {
    super('An error occured');
    this._error = error;
  }

  /**
   * Gets the message.
   *
   * @returns {String}
   */
  get error() {
    return this._error;
  }

  /**
   * Gets the serialized version of this event.
   *
   * @param {BlockChain} chain
   * @returns {Object}
   */
  async serializeEvent(chain) {
    return { error: this.error };
  }
}

module.exports = Error;
