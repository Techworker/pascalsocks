/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

/**
 * Creates a new uuid v4.
 *
 * @returns {string}
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Sends the given event to the given socket.
 *
 * @param {WebSocket} socket
 * @param {Event} event
 * @param {Function} callback
 */
function send(socket, event, callback) {
    socket.send(event.serialize(), callback);
}

/**
 * Outputs messages to the console.
 *
 * @param {Object} origin
 * @param {String} message
 */
function debug(origin, message) {
    console.log(`[DEBUG] ${new Date().toISOString()} | ${origin.constructor.name}`);
    console.log(`${message}\n`);
}

module.exports = {
    guid, send, debug
};