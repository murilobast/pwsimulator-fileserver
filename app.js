"use strict";

let wget = require('wget');
let http = require('http');
let requestIp = require('request-ip');
let url = require('url');
let finalhandler = require('finalhandler');
let serveStatic = require('serve-static');

const PORT = {
	rest: 8080,
	file: 8181	
}

const serve = serveStatic('img');

// REST SERVER
http.createServer(function (req, res) {
	let file = url.parse(req.url, true).query;

	if (isLocal(req.connection.remoteAddress)) {
		if (typeof file.url !== 'undefined') {
			console.log('Inserting ' + file.id + '.png!');
			getFile(file);
		}
	}

	res.end(JSON.stringify(file));
}).listen(PORT.rest);
console.log("Rest server listening on: http://localhost:%s", PORT.rest);

// FILE SERVER
http.createServer(function (req, res) {
  let done = finalhandler(req, res)
  serve(req, res, done)
}).listen(PORT.file)
console.log("File server listening on: http://localhost:%s", PORT.file);

// FUNCTIONS
function isLocal(address) {
	return address === '::1' || address === '::ffff:127.0.0.1' || address === '127.0.0.1' || address === '::ffff:104.236.201.180' || address === '104.236.201.180';
}

function getFile(file) {
	wget.download(file.url, 'img/' + file.id + '.png');
}