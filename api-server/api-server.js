//
// Hi! My name is magnanimous load balancer. I'm written in ES6! Either install `babel-node`
// globally to run me or just use `npm start`!
//

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import axios from 'axios';

import logger from '../lib/logger';
import options from '../lib/options';
import FileStore from './store/filestore';
import {DomainModel, ServerModel} from './models';

logger.greet();

// const nginxManager = new NginxManager();
const store = new FileStore(options.file);
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/domains', new DomainModel(store));
app.use('/servers', new ServerModel(store));

app.listen(options.api_server_port);

// Webhook implementation. Listen for changes from the datastore and notify our clients
// appropriately.

store.on('changed', function(e) {
  // For now, one hardcoded listener, the nginxManager. Eventually this might be a dynamic thing
  // at /webhooks.
  axios.post(`http://localhost:${options.nginx_manager_port}/notify`, e).catch((err) => {
    console.log('Webhook notify failed.', err);
  });
});
