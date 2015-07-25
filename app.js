//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import path from 'path';
import Nginx from './lib/nginx';
import NginxConfig from './lib/nginxConfig';
import mkdirp from 'mkdirp';

// Resolve file paths, set up some directories
const defaultConfigPath = path.resolve(__dirname, 'conf', 'default.conf');

// I don't really want to use system temp dirs.. we're only writing a few files, and I don't want
// our nginx confs to accidentally get cleaned.
const tmpDir = path.resolve(__dirname, 'tmp');
mkdirp.sync(tmpDir);
const configPath = path.resolve(tmpDir, 'nginx.conf');

const nginxConfig = new NginxConfig(defaultConfigPath, configPath);
const nginx = new Nginx(configPath);
const app = express();

app.get('/', function(req, res){
  res.send('i am a node application');
});

app.listen(8090);
