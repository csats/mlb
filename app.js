//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import path from 'path';
import Nginx from './lib/nginx';
import NginxConfig from './lib/nginxconfig';
import mkdirp from 'mkdirp';
import logger from './lib/logger';

// Resolve file paths, set up some directories
const defaultConfigPath = path.resolve(__dirname, 'conf', 'default.conf');

// I don't really want to use system temp dirs.. we're only writing a few files, and I don't want
// our nginx confs to accidentally get cleaned.
const tmpDir = path.resolve(__dirname, 'tmp');
mkdirp.sync(tmpDir);
const outputPath = path.resolve(tmpDir, 'nginx.conf');

// Get test config.

const nginxConfig = new NginxConfig({outputPath});

// Rando test config
nginxConfig.addService({
  name: "test-service",
  address: "test-server.local",
  port: 8080,
});

nginxConfig.addServer({
  name: "test01",
  service: "test-service",
  host: "localhost",
  port: 9090,
});

nginxConfig.addServer({
  name: "test01",
  service: "test-service",
  host: "localhost",
  port: 9091,
});

const nginx = new Nginx(outputPath);
const app = express();

logger.greet();

app.get('/', function(req, res){
  res.send('i am a node application');
});

app.listen(8888);
