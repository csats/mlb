//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import path from 'path';
import Nginx from './lib/nginx';

let configPath = path.resolve(__dirname, 'dumb_config.conf');
const nginx = new Nginx(configPath);
nginx.start()

// app.get('/', function(req, res){
//   res.send('hello world');
// });

// app.listen(3000);
