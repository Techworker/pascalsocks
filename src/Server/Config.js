/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

// load .env
const DotEnv = require('dotenv');

/**
 * A simple class that holds the config.
 */
class Config {
  /**
     * Gets a new config configured from the .env.
     *
     * @returns {Config}
     */
  static fromEnv() {
    // load .env
    const dotEnvResult = DotEnv.config();

    if (dotEnvResult.error) {
      throw dotEnvResult.error;
    }

    return new Config(
      process.env.NODE_HOST,
      parseInt(process.env.NODE_PORT, 10),
      parseInt(process.env.BLOCK_HISTORY_LOOKBACK, 10),
      parseInt(process.env.LISTEN_INTERVAL, 10),
      parseInt(process.env.WS_PORT, 10),
      process.env.DEBUG === 'true'
    );
  }
  /**
     *
     * @param {String} host
     * @param {Number} port
     * @param {Number} blockLookBack
     * @param {Number} listenInterval
     * @param {Number} wsPort
     * @param {Boolean} debug
     */
  constructor(host, port, blockLookBack, listenInterval, wsPort, debug) {
    this._host = host;
    this._port = port;
    this._blockLookBack = blockLookBack;
    this._listenInterval = listenInterval;
    this._wsPort = wsPort;
    this._debug = debug;
  }

  /**
     * Gets the host of the node.
     *
     * @returns {String}
     */
  get host() {
    return this._host;
  }

  /**
     * Gets the port of the node.
     *
     * @returns {Number}
     */
  get port() {
    return this._port;
  }

  /**
     * Gets the number of blocks to look back.
     *
     * @returns {Number}
     */
  get blockLookBack() {
    return this._blockLookBack;
  }

  /**
     * Gets the ms-interval in which the pascal node will be checked for changes.
     *
     * @returns {Number}
     */
  get listenInterval() {
    return this._listenInterval;
  }

  /**
     * Gets the port of the websocket.
     *
     * @returns {Number}
     */
  get wsPort() {
    return this._wsPort;
  }

  /**
     * Gets a flag indicating whether to run the app in debug mode.
     *
     * @returns {Boolean}
     */
  get debug() {
    return this._debug;
  }
}

module.exports = Config;
