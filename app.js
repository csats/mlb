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
import {DomainModel, ServerModel} from './lib/models';

logger.greet();

// const nginxManager = new NginxManager();
const store = new FileStore(options.file);
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/domains', new DomainModel(store));
app.use('/servers', new ServerModel(store));

app.listen(8888);
