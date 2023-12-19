const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const ShareDb = require('sharedb');
ShareDb.logger.setMethods({
  info: console.log,
  warn: console.log,
  error: console.log
});

const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

const redis = require('redis');
const RedisPubsub = require('sharedb-redis-pubsub');

// const RedisPubsub = require('sharedb-redis-pubsub');

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({server: server});

const backend = new ShareDb();
const ShareDbMongo = require('sharedb-mongo');

webSocketServer.on('connection', (webSocket) => {
  const stream = new WebSocketJSONStream(webSocket)
  backend.listen(stream)
});

server.listen(3000);
