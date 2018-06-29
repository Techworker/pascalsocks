const assert = require('assert');
const Subscription = require('../lib/Subscription');

describe('Subscription', function()
{
    it(`Should be instantiatable`, function () {
        const subscription = new Subscription('123', 'testchannel', 1, {a:1,b:2});
        assert.strictEqual('123', subscription.clientId);
        assert.strictEqual('testchannel', subscription.channel);
        assert.strictEqual(1, subscription.channelId);
        assert.strictEqual(1, subscription.params.a);
        assert.strictEqual(2, subscription.params.b);
    });

    it(`Should be able to check a channel`, function () {
        const subscription = new Subscription('123', 'testchannel', 1, {a:1,b:2});
        assert.ok(subscription.isChannel('testchannel'));
        assert.ok(!subscription.isChannel('abctestchannel'));
        assert.ok(!subscription.isNotChannel('testchannel'));
        assert.ok(subscription.isNotChannel('abctestchannel'));
    });

    it(`Should be able to check a channel id`, function () {
        const subscription = new Subscription('123', 'testchannel', 1, {a:1,b:2});
        assert.ok(subscription.isChannelId(1));
        assert.ok(!subscription.isChannelId(2));
        assert.ok(!subscription.isNotChannelId(1));
        assert.ok(subscription.isNotChannelId(2));
    });
    it(`Should be able to check a client id`, function () {
        const subscription = new Subscription('123', 'testchannel', 1, {a:1,b:2});
        assert.ok(subscription.isClientId('123'));
        assert.ok(!subscription.isClientId('321'));
        assert.ok(!subscription.isNotClientId('123'));
        assert.ok(subscription.isNotClientId('321'));
    });
});