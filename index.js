const Debug = require('debug');
const debug = Debug('sharedb');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const redis = require('redis');
const ShareDb = require('sharedb');
const RedisPubsub = require('sharedb-redis-pubsub');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const ShareDbMongo = require('sharedb-mongo');

const options = require('./options');
const oidc = require('@ezsso/express-client').oidc(options);

ShareDb.logger.setMethods({
	info: debug,
	warn: debug,
	error: debug
});

const app = express();
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({server, verifyClient, path: options.path});

const backend = new ShareDb();

webSocketServer.on('connection', async (webSocket, req, ...args) => {
	const stream = new WebSocketJSONStream(webSocket)
	stream.on('error', e => {
		console.log("Error", e);
	}); 
	backend.listen(stream, { req });
});

server.on('upgrade', async (req, ws, head) => {
	let args;

	// oidc.authorize(req, res,
/*
	try {
		args = await getDataAsync();
	} catch (e) {
		ws.destroy();
		return;
	}
*/

	webSocketServer.handleUpgrade(req, ws, head, ws => {
		webSocketServer.emit('connection', ws, req, ...args);
	});
});
server.listen(3000);
