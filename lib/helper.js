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
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
 * Specialized serialize method that transforms an object to another custom
 * object ready for serialization.
 *
 * @param {Object} obj
 * @returns {{}}
 */
function serialize(obj)
{
    const inst = {};
    for (let [key, value] of Object.entries(obj)) {
        let newKey = key;
        if(newKey.substr(0,1) === '_') {
            newKey = newKey.substring(1);
        }

        inst[newKey] = value !== null && value !== undefined && value.toString && Object.prototype.toString.call(value) !== "[object Object]" ? value.toString() : value;
    }

    return inst;
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
    guid, send, serialize, debug
};