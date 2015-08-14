
// I'm a file store! I'm the only storage system MLB has right now, but I implement an interface
// that could be easily ported to a Mongo database, like Meteor people would likely already have
// up and running!

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {log} from '../logger';

const DEFAULT_DATA = {
  domains: [],
  servers: [],
};

export default class FileStore {

  constructor(storePath) {
    if (typeof storePath !== 'string') {
      throw new Error(`Missing path for FileStore JSON. Try running with --file [path]?`)
    }
    storePath = path.resolve(storePath);
    log(`Initializing FileStore with database at ${storePath}`);

    // Load it up!
    let data;
    try {
      data = fs.readFileSync(storePath, 'utf8');
      log(`Loading existing data from ${storePath}.`);
    }
    catch (e) {
      if (e.code === 'ENOENT') {
        // Cool, new database.
        log(`Initializing new database at ${storePath}.`);
        data = JSON.stringify(DEFAULT_DATA);
      }
      else {
        log(`Unexpected error loading database file.`);
        throw e;
      }
    }

    // Parse it!
    try {
      data = JSON.parse(data);
    }
    catch (e) {
      log(`Uh oh! Error parsing file data! Is there something there that's not JSON?`);
      throw e;
    }

    // All right, got our initial state. Let's try a write quick so we're sure everything's kosher.
    this.path = storePath;
    this.data = data;

    try {
      this._write(true);
    }
    catch (e) {
      log(`Error writing database file. Is it writable?`);
      throw e;
    }

    log(`FileStore initialized sucessfully.`);
  }

  find(name, selector) {
    return new Promise((resolve, reject) => {
      let docs = _(this.data[name])
        .filter(selector)
        .value();
      resolve(docs);
    });
  }

  findOne(name, selector) {
    return new Promise((resolve, reject) => {
      let docs = _(this.data[name])
        .filter(selector)
        .value();
      resolve(docs[0]);
    });
  }

  insert(name, doc) {
    return new Promise((resolve, reject) => {
      this.data[name].push(doc);
      this._write();
      resolve();
    });
  }

  update(name, selector, newDoc) {
    return this._find(name, selector).then((docs) => {
      return new Promise((resolve, reject) => {
        docs.forEach(function(doc) {
          _.merge(doc, newDoc);
        });
        resolve();
        this._write();
      });
    });
  }

  remove(name, selector) {
    return new Promise((resolve, reject) => {
      _.remove(this.data[name], selector);
      this._write();
      resolve();
    });
  }

  _write(sync = false) {
    let stringified = JSON.stringify(this.data, null, 4);
    if (sync === true) {
      return fs.writeFileSync(this.path, stringified, 'utf8');
    }
    else {
      return new Promise((resolve, reject) => {
        fs.writeFile(this.path, stringified, 'utf8', function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }
  }

}

