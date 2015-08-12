/**
 * Hello! I expose a simple API for managing an nginx process.
 */

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import _ from 'lodash';
import temp from 'temp';

import logger from './logger';
import Nginx from './nginx';

const TEMPLATE_PATH = path.resolve(__dirname, '..', 'templates', 'nginx.conf.hbs');

export default class NginxManager {
  constructor() {
    // Do everything sync on boot, async after we've started up.
    this.outputPath = temp.openSync().path;
    this.data = {
      servers: [],
      services: [],
    };
    let tmplString = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    this.template = Handlebars.compile(tmplString);

    // TODO: make write interval configurable
    this.write = _.debounce(this._doWrite.bind(this), 5000);
    this._doWrite(true);
    this.nginx = new Nginx(this.outputPath);
  }

  addService(service) {
    this.data.services.push(service);
    this.write();
  }

  addServer(server) {
    this.data.servers.push(server);
    this.write();
  }

  /**
   * Munge this.data in such a way that it's useful for rendering our handlebars templates.
   */
  templateData() {
    return {
      upstreams: _(this.data.servers).groupBy('service').value(),
      services: this.data.services,
    };
  }

  _doWrite(sync = false) {
    logger.log('Writing new config file.');
    let output = this.template(this.templateData());
    if (sync === true) {
      return fs.writeFileSync(this.outputPath, output, 'utf8');
      this.nginx && this.nginx.reload();
    }
    else {
      return new Promise((resolve, reject) => {
        fs.writeFile(this.outputPath, output, (err) => {
          if (err) {
            return reject(err);
          }
          this.nginx && this.nginx.reload();
          resolve();
        });
      });
    }
  }
}
