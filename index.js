'use strict';

const http = require('http')
const fs = require('fs')

const app = require('./app')
const server = http.createServer(app)

exports.handler = (event, context) => http.proxy(server, event, context);

server.listen(process.env.PORT || 3000)
