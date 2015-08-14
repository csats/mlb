//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import NginxManager from './lib/nginxmanager';
import logger from './lib/logger';
import options from './lib/options';
import FileStore from './lib/store/filestore';

logger.greet();

// const nginxManager = new NginxManager();
const store = new FileStore(options.file);
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

let doErr = function (res) {
  return function(err) {
    console.error(err);
    res.status(500);
    res.end();
  };
}

// Domains!

app.get('/domains', function(req, res) {
  store.domains.find().then(function(docs) {
    res.status(200);
    res.json(docs);
    res.end();
  }).catch(doErr(res));
});

app.post('/domains', function(req, res) {
  let domain = req.body;
  store.domains.insert(domain).then(function() {
    res.status(201);
    res.json(domain);
    res.end();
  }).catch(doErr(res));
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
