/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const EventEmitter = require('events');
const InternalSealEvent = require('./Events/Internal/Seal');
const helper = require('./helper');

/**
 * The central event manager that is used to fire events and add listeners. It
 * will record all events so that there is the possibility to replay them.
 */
class EventManager
{
    /**
     * Creates a new instance of the EventManager class.
     */
    constructor()
    {
        // internal event emitter
        this.emitter = new EventEmitter();

        // a list of all sealed events, grouped by the block number
        this.history = new Map;

        // all events that are fired and not sealed
        this.recent = [];

        // the number of the latest block
        this.latestBlockNumber = 0;
    }

    /**
     * Emits the given event and records it in the list of recent events. If
     * the event is the internal seal event, the recent events will be
     * grouped by the given block of the event.
     *
     * @param {Event} event
     */
    emit(event)
    {
        // seal all recent events?
        if(event.constructor === InternalSealEvent)
        {
            helper.debug(this, `sealing block ${event.block.block_number} (${this.recent.length} event(s))`);

            // associate the block with the event
            this.recent.forEach(ev => ev.associated = event.block.block_number);

            // categorize the recent events
            this.history.set(event.block.block_number, this.recent);
            let all = 0;
            this.history.forEach((e) => { all += e.length;});
            helper.debug(this, `${all} event(s) in total`);

            this.recent = [];

            // save the latest block number
            this.latestBlockNumber = event.block.block_number;
            return;
        }

        // emit the event
        // helper.debug(this, `Emitting event ${event.name} - ${event.constructor.name}`);
        this.recent.push(event);
        this.emitter.emit(event.constructor.name(), event);
    }

    /**
     * Gets a list of all events matching the given events for the last blocks
     * defined by the lookBack.
     *
     * @param {String} eventName
     * @param {Number} lookBack
     */
    getEvents(eventName, lookBack = 10)
    {
        let events = [];

        // loop history
        for(let block = this.latestBlockNumber - lookBack; block <= this.latestBlockNumber; block++)
        {
            if(this.history.has(block)) {
                const histEvents = this.history.get(block);
                events.push(...histEvents.filter((ev) => {
                    return ev.constructor.name() === eventName;
                }));
            }
        }

        return events;
    }

    /**
     * Gets all recent events.
     *
     * @param eventTypes
     * @returns {Array.<*>}
     */
    getRecentEvents(eventTypes) {
        return this.recent.filter(ev => eventTypes.indexOf(ev.constructor) > -1);
    }

    /**
     * Sends the given event with the notify key as event identifier.
     *
     * @param {Event} event
     * @param {Array<Subscription>} subscriptions
     */
    notify(event, subscriptions) {
        this.emitter.emit('notify', event, subscriptions);
    }

    /**
     * Adds a listener to the given key.
     *
     * @param {String} key
     * @param {Function} callback
     */
    on(key, callback) {
        this.emitter.on(key, callback);
    }
}

module.exports = EventManager;