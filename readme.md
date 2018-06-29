# PascalSox

A nodejs websocket application server to listen for changes in the PascalCoin blockchain.

## Installation

### Prerequisites

This application requires at least nodejs 7.6 and a running PascalCoin node with JSON-RPC enabled. It is recommended to disable the logs as the application uses the JSON-RPC interface extensively.

### Installation

Clone the repository and install all dependencies.

````shell
git clone https://todo
cd pascalsocks
npm install
npm run pascalsocks
````

## Introduction

Each message sent and received via the websocket is encoded in JSON format. You can use whatever language you like to create client applications, as long as they understand the websocket protocol.

The messages sent between the client and the server will always have the following format:

```json
{
    "event": "event_name",
    "message": "An optional message describing the event",
    "other_field": ...
}
```

The field `event` will hold a unique value that identifies the type of the message. All messages sent from the server to the client will also have `message` field that tries to describe the contents of the message in a short but human readable form.

In addition, an event message can contain additional fields, these are described in this documentation.

### Configuration

The application can be configured using the `.env` file that can be found in root of the checked out directory. 

**PASCAL_HOST**

This is the hostname of the PascalCoin JSON-RPC server you want to connect to  (default = localhost).

**PASCAL_PORT**

The port of the PascalCoin JSON-RPC server you want to connect to (default = 4003).

**WS_PORT**

The port on which the server is accessible (default = 8080).

### Connect to the server

####  `welcome` event

As soon as a client connects to the app, it will send a message to the client in the following format.

```json
{  
   "event": "welcome",
   "message": "Welcome user 3efb61a3-2314-4709-9dda-41e388d178a5",
   "id": "3efb61a3-2314-4709-9dda-41e388d178a5"
}
```

The `id` field will further identify you, so it might be important to save the value locally as long as the connection is active. When the connection is lost and you reconnect, you'll get a new `id`.

### Subscribe to channels

Each channel

### `subscribe` event

The

You can subscribe to different channels which all serve a custom purpose and 
will keep you as a client uptodate with the blockchain.

You can subscribe to a channel with the following message:

```json
{
  "event": "subscribe",
  "channel": "name_of_the_channel",
  "params": {
    "x": "y", 
    "z": 2
  }
}
```

The value of the `event` key identifies whether you want to subscribe to or
`unsubscribe` from a channel.

The `channel` key identifies the channel you want to subscribe to or unsubscribe
from.

The `params` key holds additional parameters that you want to make the 
channel aware of. E.g. if you want to listen to a channel that will give you
information about a certain account, you'll need to supply the account in the 
params key. You'll see the available parameters in the description of each 
channel.

With each subscription request the client will receive an acknowledge message
in the following form:

```json
{
  "event": "subscribed",
  "channel": "name_of_the_channel",
  "subscription_id": 1234
}
```

The `event` key tells the client, that he successfully subscribed to the channel
in the `channel` key.

The `subscription_id` value identifies the subscription itself. It is possible 
to subscribe to one channel multiple times, the `subscription_id` will help you 
differentiate the subscriptions.

You can either unsubscribe from a `channel` completely or just a single 
`subscription_id`.

```json
{
  "event": "unsubscribe",
  "channel": "name_of_channel"
}
```

This will unsubscribe you from the given channel completely, all previously 
created subscriptions on the channel will be removed.

```json
{
  "event": "unsubscribe",
  "channel": "name_of_channel",
  "subscription_id": 1234
}
```

This will unsubscribe you from the given `subscription_id` in the given 
`channel`.

The server will respond as follows:

```json
{
  "event": "unsubscribed",
  "channel": "name_of_channel",
  "subscription_ids": [1234]
}
```

## Channels

### Pending operations

**Name** `pendings`

This channel will inform the client of pending operations as soon as they 
arrive the underlying pascal node.

Example subscription:

```json
{
  "event": "subscribe",
  "channel": "pendings",
  "params": {
    "optype": [1],
    "subtype": [11],
    "account": [1233221],
    "signer_account": 1212121,
    "amount": ['lt', 1],
    "fee": ['eq', 0],
    "balance": ['gt' > 10],
    "payload": ['dhsskhfkfjfkjdsf', 'dsdsa'],
    "sender_account": [1,2,2,2],
    "dest_account": [1,2,3,4]
  }
}
```

Example message:

```json
{
  "event": "data",
  "channel": "pendings",
  "subscription_id": 1234,
  "data": {
    "block":0,
    "time":0,
    "opblock":149,
    "maturation":null,
    "optype":1,
    "subtype":11,
    "account":285630,
    "signer_account":285630,
    "n_operation":4009511,
    "optxt":PASCurrency,
    "amount":-0.0001,
    "fee":-0.0001,
    "balance":106663.03940000001,
    "payload":"",
    "sender_account":285630,
    "dest_account":572353,
    "ophash":"00000000BE5B0400272E3D00BC01EED0FE3ECA33DA8E3C47AF62178E350877DA",
    "old_ophash":"00000000BE5B0400272E3D004243443332433535443731304430453731423834"
  }
}
```

## block

Listeners to the `block` channel will get a message whenever a block is mined.
It will contain the information of the mined block as well as the block number
of the next block.

```json
{
  "finished": {
    "block":8888,
    "enc_pubkey":"CA0220000E60B6F76778CFE8678E30369BA7B2C38D0EC93FC3F39E61468E29FEC39F13BF2000572EDE3C44CF00FF86AFF651474D53CCBDF86B953F1ECE5FB8FC7BB6FA16F114",
    "reward":100,
    "fee":0,
    "ver":1,
    "ver_a":0,
    "timestamp":1473161258,
    "target":559519020,
    "nonce":131965022,
    "payload":"New Node 9/4/2016 10:10:13 PM - Pascal Coin Miner & Explorer Build:1.0.2.0",
    "sbh":"5B75D33D9EFBF560EF5DA9B4A603528808626FE6C1FCEC44F83AF2330C6607EF",
    "oph":"81BE87831F03A2FE272C89BC6D2406DD57614846D9CEF30096BF574AB4AB3EE9",
    "pow":"00000000213A39EBBAB6D1FAEAA1EE528E398A587848F81FF66F7DA6113FC754",
    "operations":1
  },
  "next": 123456,
}
```
## pending

This will send a message to each subscribed listener whenever a pending opertion
arrived at the node.

```json
{
  "block":0,
  "time":0,
  "opblock":149,
  "maturation":null,
  "optype":1,
  "subtype":11,
  "account":285630,
  "signer_account":285630,
  "n_operation":4009511,
  "optxt":PASCurrency,
  "amount":-0.0001,
  "fee":-0.0001,
  "balance":106663.03940000001,
  "payload":"",
  "sender_account":285630,
  "dest_account":572353,
  "ophash":"00000000BE5B0400272E3D00BC01EED0FE3ECA33DA8E3C47AF62178E350877DA",
  "old_ophash":"00000000BE5B0400272E3D004243443332433535443731304430453731423834"
}
```