/**
 * Hello! I expose a simple API for managing an nginx process.
 */

import fsp from 'fs-promise';
import path from 'path';
import Handlebars from 'handlebars';
import _ from 'lodash';
import temp from 'temp';
import express from 'express';

import logger from '../lib/logger';
import options from '../lib/options';
import Nginx from './nginx';
import MlbClient from '../client/mlb-client.js';

const TEMPLATE_PATH = path.resolve(__dirname, 'nginx.conf.hbs');
const CERT_FILE_SUFFIX = '.crt';
const KEY_FILE_SUFFIX = '.key';

export default class NginxManager {
  constructor() {
    // Do everything sync on boot, async after we've started up.
    this.templateData = {};

    this.checkCerts();

    // Set up MLB client
    this.mlbClient = new MlbClient({
      url: `http://localhost:${options.api_server_port}`
    });

    // Set up temporary directory
    this.outputPath = temp.openSync().path;

    // Set up Handlebars nginx template
    const tmplString = fsp.readFileSync(TEMPLATE_PATH, 'utf8');
    this.template = Handlebars.compile(tmplString);

    // Write initial config file
    this.write = _.throttle(this._doWrite.bind(this), 5000);
    this.write().then(() => {
      this.nginx = new Nginx(this.outputPath);
    });

    // Set up server for notifications
    this.app = express();
    this.app.post('/notify', (req, res) => {
      res.sendStatus(200).end();
      this.write();
    });
    this.app.listen(options.nginx_manager_port);
  }

  /**
   * Check the cert directory provided to us in optionsl Currently we only support a single cert.
   * We expect two files to be present in `MLB_CERT_DIR` -- domain.whatever.example.com.crt and
   * domain.whatever.example.com.key. If the directory is not present, we'll assume HTTP mode.
   * Otherwise we expect those things to be true and error if they are not.
   */
  checkCerts() {
    // Check for existence of SSL certs
    let certDirFiles;
    try {
      certDirFiles = fsp.readdirSync(options.cert_dir);
    }
    catch (e) {
      // If the directory doesn't exist, that's cool. If we get a different error, throw it.
      if (e.code !== 'ENOENT') {
        logger.fatal(e, 'Unexpected error when checking for SSL certs: ', e.message);
      }
    }

    if (!certDirFiles) {
      this.templateData.https = false;
      logger.log('nginx running in HTTP mode');
      return;
    }

    let certFiles = certDirFiles.filter((f) => {
      return f.endsWith(CERT_FILE_SUFFIX);
    });
    if (certFiles.length === 0) {
      logger.fatal('MLB_CERT_DIR provided, but no domain.crt file found.');
    }
    else if (certFiles.length > 1) {
      logger.fatal('More than one cert file in MLB_CERT_DIR, we can only handle one for now.');
    }
    let certFile = certFiles[0];
    let certFilePrefix = certFile.slice(0, -CERT_FILE_SUFFIX.length);

    let keyFile = certFilePrefix + KEY_FILE_SUFFIX;
    if (certDirFiles.indexOf(keyFile) === -1) {
      logger.fatal(`Found ${certFile} but no corresponding ${keyFile}`);
    }

    this.templateData.https = true;
    this.templateData.certPath = path.resolve(options.cert_dir, certFile);
    this.templateData.keyPath = path.resolve(options.cert_dir, keyFile);
    logger.log('nginx running in HTTPS mode, using certs for ' + certFilePrefix);

    console.log(this.templateData);
  }

  getData() {
    let currentDomains;

    return this.mlbClient.domains.get()

    .then((domains) => {
      currentDomains = domains;
      return this.mlbClient.servers.get();
    })

    .then((servers) => {
      const data = {
        domains: currentDomains,
        servers: servers,
      };
      logger.log('Got data from API server:', JSON.stringify(data, null, 4));
      return data;
    })

    .catch((err) => {
      logger.log('Error getting data from API server', err);
    });
  }

  /**
   * Munge this.data in such a way that it's useful for rendering our handlebars templates.
   */
  getTemplateData({domains, servers}) {
    // for human-readability, the name of the upstream will be hostname + id
    const nginxPort = options.nginx_port;

    domains = _.cloneDeep(domains).filter((domain) => {
      // Set up this upstream's name as HOSTNAME_UUID
      domain.name = domain.hostname + '_' + domain.id;

      // Only use upstreams that have servers
      return _(servers)
        .filter({domain: domain.id})
        .value()
        .length > 0;
    });

    const upstreams = domains.map((domain) => {
      return {
        name: domain.name,
        servers: _(servers)
          .filter({domain: domain.id})
          .value(),
      }
    });

    const ret = {};
    Object.assign(ret, this.templateData);
    Object.assign(ret, {upstreams, domains, nginxPort});

    return ret;
  }

  _doWrite() {
    return this.getData()

    .then(({domains, servers}) => {
      logger.log('Writing new config file.');
      const tmplData = this.getTemplateData({domains, servers});
      logger.log('Proceeding with template data:', JSON.stringify(tmplData, null, 4));
      const output = this.template(tmplData);
      return fsp.writeFile(this.outputPath, output);
    })

    .then(() => {
      this.nginx && this.nginx.reload();
    })

    .catch((err) => {
      logger.log('Error writing config file', err, err.stack);
    });
  }
}
