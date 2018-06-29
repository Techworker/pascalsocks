const assert = require('assert');
const sinon = require('sinon');
const EventEmitter = require('events');
const PendingsChannel = require('../../lib/Channels/Pendings');
const SubscriptionManager = require('../../lib/SubscriptionManager');

let emitter;
let channel;
let spy;

describe('PendingsChannel', function()
{
    beforeEach(() => {
        spy = sinon.spy();
        emitter = new EventEmitter();
        channel = new PendingsChannel(emitter, new SubscriptionManager);
    });

    it(`Should notify if an operation with block = 0`, function () {
        emitter.on('notify', spy);
        channel.react('operation', {block: 0});
        assert.ok(spy.called);
        assert.equal('pending_operation', spy.args[0][0].name);
    });

    it(`Should NOT notify if an operation with block > 0`, function () {
        emitter.on('notify', spy);
        channel.react('operation', {block:1});
        assert.ok(!spy.called);
    });
});