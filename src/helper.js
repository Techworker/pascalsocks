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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

    return v.toString(16);
  });
}

/**
 * Sends the given event to the given socket.
 *
 * @param {WebSocket} socket
 * @param {String} ident
 * @param {Event} event
 * @param {Function} callback
 */
async function send(socket, ident, event, callback) {
  const s = await event.serialized();

  if (ident !== null) {
    s.ident = ident;
  }

  socket.send(JSON.stringify(s), callback);
}

/**
 * Outputs messages to the console.
 *
 * @param {Object} origin
 * @param {String} message
 */
function debug(origin, message) {
  console.log(`[DEBUG] ${new Date().toISOString()} | ${origin.constructor.name} ${message}`);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  guid, send, debug, asyncForEach
};
