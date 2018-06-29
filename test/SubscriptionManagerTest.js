const assert = require('assert');
const SubscriptionManager = require('../lib/SubscriptionManager');
const Subscription = require('../lib/Subscription');
const Hashids = require('hashids');

describe('SubscriptionManager', function()
{
    it(`Should be instantiatable`, function () {
        const mgr = new SubscriptionManager(new Hashids('test123'));
    });

    it(`should be possible to add a subscription`, function() {
        const mgr = new SubscriptionManager(new Hashids('test123'));
        const subscription = mgr.subscribe('client', 'channel', {a:1, b:2});
        assert.ok(subscription.constructor === Subscription);
    });

    it(`should be possible to unsubscribe all subscriptions of a client`, function() {
        const mgr = new SubscriptionManager(new Hashids('test123'));
        mgr.subscribe('client', 'channel', {a:1, b:2});
        mgr.subscribe('client', 'channel2', {a:1, b:2});
        mgr.subscribe('client2', 'channel2', {a:1, b:2});
        assert.strictEqual(2, mgr.getSubscriptionsOfClientId('client').length);
        mgr.unsubscribeClientId('client');
        assert.strictEqual(1, mgr.getSubscriptionsOfClientId('client2').length);
        assert.strictEqual(0, mgr.getSubscriptionsOfClientId('client').length);
    });

    it(`should be possible to unsubscribe all subscriptions of a client from a channel`, function() {
        const mgr = new SubscriptionManager(new Hashids('test123'));
        const subscription1 = mgr.subscribe('client1', 'channel', {a:1, b:2});
        const subscription2 = mgr.subscribe('client2', 'channel', {a:1, b:2});
        assert.strictEqual(2, mgr.getSubscriptionsOfChannel('channel').length);
        mgr.unsubscribeChannel('client5', 'channel');
        assert.strictEqual(2, mgr.getSubscriptionsOfChannel('channel').length);
        mgr.unsubscribeChannel('client2', 'channel');
        assert.strictEqual(1, mgr.getSubscriptionsOfChannel('channel').length);
    });

    it(`should be possible to unsubscribe all subscriptions of a client from a channel + id`, function() {
        const mgr = new SubscriptionManager(new Hashids('test123'));
        const subscription1 = mgr.subscribe('client1', 'channel', {a:1, b:2});
        const subscription2 = mgr.subscribe('client1', 'channel', {a:1, b:2});
        assert.strictEqual(1, mgr.getSubscriptionsOfChannelId(subscription1.channelId).length);
        assert.strictEqual(1, mgr.getSubscriptionsOfChannelId(subscription2.channelId).length);

        mgr.unsubscribeChannelId('client1', 'channel', subscription1.channelId);
        assert.strictEqual(1, mgr.getSubscriptionsOfChannel('channel').length);
        mgr.unsubscribeChannelId('client1', 'channel', subscription2.channelId);
        assert.strictEqual(0, mgr.getSubscriptionsOfChannel('channel').length);
    });
});