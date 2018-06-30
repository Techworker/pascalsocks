const WebSocket = require('ws');
var socket = new WebSocket('ws://127.0.0.1:8080');

socket.on('open', function () {
    console.log('open..');

    socket.send(JSON.stringify({
        'action': 'subscribe',
        'channel': 'account'
    }));
});

socket.on('message', function (data) {
    console.log(JSON.parse(data));
});
