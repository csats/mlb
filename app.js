//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import path from 'path';
import Nginx from './lib/nginx';
import NginxManager from './lib/nginxmanager';
import mkdirp from 'mkdirp';
import logger from './lib/logger';

const nginxManager = new NginxManager();

// Rando test config
nginxManager.addService({
  name: "test-service",
  address: "test-server.local",
  port: 8080,
});

nginxManager.addServer({
  name: "test01",
  service: "test-service",
  host: "localhost",
  port: 7080,
});

nginxManager.addServer({
  name: "test01",
  service: "test-service",
  host: "localhost",
  port: 7070,
});

const app = express();

logger.greet();

app.get('/services', function(req, res){

});

app.listen(8888);
