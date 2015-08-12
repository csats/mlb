//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';

import NginxManager from './lib/nginxmanager';
import logger from './lib/logger';
import options from './lib/options';

const nginxManager = new NginxManager();
const app = express();

logger.greet();

// Domains!

app.get('/domains', function(req, res){

});

app.post('/domains', function(req, res){

});

app.get('/domains/:domainId', function(req, res){

});

app.put('/domains/:domainId', function(req, res) {

});

app.delete('/domains/:domainId', function(req, res) {

});

// Servers!

app.get('/servers', function(req, res){

});

app.post('/servers', function(req, res){

});

app.get('/servers/:serverId', function(req, res){

});

app.put('/servers/:serverId', function(req, res) {

});

app.delete('/servers/:serverId', function(req, res) {

});

app.listen(8888);
