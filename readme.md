# PascalSocks

A websocket application server that serves events of the PascalCoin blockchain in a realtime stream of events.

## Introduction

This application was developed to take away the burden of polling and evaluating data from the PascalCoin Blockchain and to help developing realtime services on top of the PascalCoin Blockchain - so called monetized APIs.

It uses the WebSockets protocol to deliver a stream of events that occur on the BlockChain to a variable number of connected clients. WebSockets are an accepted global standard and have implementations in nearly all programming languages. So while the server is written in nodejs, you can use whatever language you like to connect to the server.

### Examples / ideas

1. You can subscribe to the `Transaction` event with a filter set to your account number, so every time someone sends PASC to your account, you will receive a message with all informations related to the transaction. This example would for instance allow you to create instant payment solutions for shop systems or to automatically send out invoices etc.
2. You can subscribe to the `BlockMined` event, to create a load balancing solution in case you never want to pay any fee. Imagine you have a queue of say 10 transactions you want to perform and you have 1 account. Each account has 1 free transaction / block, so if you would send all transactions in 1 block, you would have to pay at least 0,0009 PASC (which is not much but can add up). If you listen for mined blocks, you can automate the process of using your account only once in each block, so your 10 transactions can be distributed over the course of 10 blocks without paying any fee.

There are more ideas to come, but these 2 simple ones should help to understand the concept. Please have a look at the examples inside of the `examples` directory for more inspiration.

## Installation

### Prerequisites

This application requires at least nodejs 7.6 and a running PascalCoin node with JSON-RPC enabled. It is recommended to disable the logs as the application uses the JSON-RPC interface extensively and each request to the JSON RPC API is logged.

### Installation

Clone the repository and install all dependencies.

````shell
git clone https://todo
cd todo
npm install
npm run todo
````

## Client - Server - Client communication

The communication between clients and the server is made as simple as possible. Each message sent within the WebSocket protocol is encoded in JSON. The client application will send so called *actions* to the server while the server application will respond asynchronously with so called *events*.

Clients send `subscribe` actions for `events` to the server and the server will either send a success or error event with infos about the subscription to the client. In case the subscription was successful, the server will continuously sent all matching events to the client.

There is a client library for Javascript available, that will help to create your first clients in the browser or server side in nodejs. It will take away some of the complexity of the communication, however the inner protocol is rather simple, so it shouldn't be too complicated to implement a small client library by itself.

### Establishing a connection client-server

When a client establishes a connection to the server, the server will send a `welcome` event to the client. The welcome event contains an `id` property that will uniquely identify you on the server. You should save this value locally, as it will help you to assign events to an established connection. All subsequent events sent through this connection will also contain the id.

You are free to make as many connections as you want, and this value can help you differentiate the received events in case your local WebSocket implementation does not provide such a feature.

#### Welcome Event

Here is an example for a welcome event.

```json
{
    "event": "welcome",
    "message": "Welcome user ddc5015d-8626-480f-a1db-15aca34596a3",
    "id": "ddc5015d-8626-480f-a1db-15aca34596a3"
}
```

Explanation:

- **event** The name of the event
- **message** A human readable description of the event
- **id** Your client identifier.

From here on, you are free to subscribe to events.

### Subscribing to events

When the connection is established and you received the welcome event, you can start to subscribe to events happening on the PascalCoin BlockChain. 

To subscribe, you'll need to send a `subscribe` action, together with the name of the event you want to subscribe to and some additional parameters that will be explained right after the example:

```json
{
    "action": "subscribe",
    "event": "block.mined",
    "snapshot": 10,
    "filters": [...]
}
```

- **action** The `action` key to subscribe to an event is always `subscribe`
- **event** The `event` key describes the event you want to subscribe to.
- **snapshot** Describes the number of blocks you want to go back in history and want to receive the events for.
- **filters** A list of filters that will be applied on the data of a potential event.

#### Snapshots

Snapshots are a powerful feature, but you'll have to decide on it's usefulness for your use-case.

The PascalSocks server holds a database of all events that occured on the BlockChain up to a certain block (called `depth`). The `depth` of the database is defined in blocks and can be set by the PascalSocks administrator. 

When PascalSocks is started, it will re-read all blocks and operations until the configured max-depth is arrived (say current block at startup is `210100`, it will read all blocks between `210000` and `210100`) and creates all the events it would have generated as if the server was alive all the time (excluding pending operations).

This has 2 advantages:

- If a client looses the connection for whatever reason, it could simply reconnect and fetch every event it might have missed (defined by the last recorded block number). It might be a good idea to always subscribe to the `block.mined` event and save the block number, so your client knows, where the last event took place in case of a failure.
- If a server goes down for whatever reason at block 210055 and goes up again at block 210100, it can catch up with everything that happened at downtime and can also send all missed events to newly connected clients that suffered from the downtime.

What you got to think of is that PascalSocks does not care, if your client gets an event twice - so your listeners on events need to be idempotent. How one solves this problem is up to the client, but each event in PascalSocks gets an unique identifier that is a hash of the event and will always be the same (even on reconnect). So you can, if there is no other possibility, use this hash to make listeners idempotent.

#### Filters

If you subscribe to events without filters, you'll get everything that matches your subscribed event. But since events in PascalSocks are wide-ranged, you might get too much information that you'll have to filter out manually.

Imagine you want to be informed when a transaction occurs, but not every transaction, only the transactions to a special account. This is where filters step in.

Filters represent an additional layer between the recording of an event and the delivery to clients. Each subscription can contain filters that will make sure that you'll only get what you subscribed for. 

You can define zero or more filters where each filter is combined via **AND**. If you need **OR** filters, you'll need to add another subscription for now. 

*An extension to filters is planned, but is not realized by now.*

The `filters` array in the subscription requests is built up from a list of objects or can be left empty.

Each array item in the `filters` array needs to consists of 3 items, where the first item defines the `field` name, the second the `filter method` that should be applied and the 3rd the `value` of the filter. 

*Filters are kept simple right now, so only basic comparisms are available.*

**name** The name of the field. To access deeper object structures, you can divide the fields by a `.`(dot). So if you want to filter the sending account number of a transaction, you can use `operation.sender_account_number` to access the fields value.

**type** The comparism type. It can be one of these values

- gt - greater than
- lt - lower than
- gteq - greater or equal
- lteq - lower or equal
- eq - equals

**value** The value applied from the value derived by the `name` with the comparator derived from `type`