const WebSocket = require('ws');
var socket = new WebSocket('ws://127.0.0.1:8080');

socket.on('open', function () {
    console.log('open..');

    socket.send(JSON.stringify({
        'action': 'subscribe',
        'channel': 'operation',
        snapshot: 100,
        'filters': [
            {
                field: 'message',
                type: 'startsWith',
                value: 'welcome'
            }
        ]


    }));
});

socket.on('message', function (data) {
    let d = JSON.parse(data);
    console.log(d.event);
    console.log(d.message);
});
