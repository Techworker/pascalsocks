/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const AbstractEvent = require('../Event');

/**
 * The event gets fired when an account is bought on the chain.
 */
class AccountAdded extends AbstractEvent {
  /**
     * Gets the name of the event.
     *
     * @return {String}
     */
  static name() {
    return 'account.added';
  }

  /**
     * Creates a new instance of the Added class.
     *
     * @param {Account} account
     */
  constructor(account) {
    super(`Added account ${account.accountNumber}`);
    this._account = account;
  }

  /**
     * Gets the added account.
     *
     * @return {Account}
     */
  get account() {
    return this._account;
  }

  /**
     * Gets the serialized version of this event.
     *
     * @param {BlockChain} chain
     * @returns {Object}
     */
  async serializeEvent(chain) {
    return {
      account: await this.account.serialize(chain)
    };
  }
}

module.exports = AccountAdded;
