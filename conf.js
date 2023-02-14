var express = require('express');
const open = require('open');

var app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require("path");

module.exports = { express, open, app, io, server, path };