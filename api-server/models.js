
import express from 'express';
import uuid from 'node-uuid';
import _ from 'lodash';

import {log} from '../lib/logger';

/**
 * MLB Resources are individual express() apps that are mounted to various endpoints by the
 * router. So the DomainModel is mounted at /domains and the ServiceModel is mounted at /services.
 */
export class BaseModel {
  constructor(store) {
    this.store = store;

    let app = express();

    app.all(this.auth.bind(this));

    app.get('/', this.index.bind(this));
    app.post('/', this.post.bind(this));
    app.get('/:id', this.get.bind(this));
    app.put('/:id', this.put.bind(this));
    app.delete('/:id', this.delete.bind(this));

    // We don't actually return ourselves -- return some express middleware that makes use of this
    // instantiated model instead.
    return app;
  }

  /**
   * Simple error middleware that we can put in `.catch()` blocks to respond coherently to clients.
   * @return {Function} Function that will give uers a 500
   */
  _err(req, res) {
    return function(err) {
      log(err);
      log(err.stack);
      res.status(500).end();
    }
  }

  /**
   * Auth middleware function. Doesn't do much yet.
   */
  auth(req, res, next){
    // Something interesting should be here.
    return next();
  }

  /**
   * Validate incoming data against our keys
   */
  _validate(doc) {
    // Basic check to make sure there are no unknown keys in the doc
    Object.keys(doc).forEach((key) => {
      if (this.fields.indexOf(key) === -1) {
        throw new Error('Unknown field: ' + key);
      }
      if (typeof doc[key] !== 'string') {
        throw new Error('All fields must be strings');
      }
    });
  }

  /**
   * Respond to GET /resource requests. Lists resources.
   */
  index(req, res) {
    this.store.find(this.name)

    .then(function(docs) {
      res.status(200).json(docs).end();
    })

    .catch(this._err(req, res));
  }

  /**
   * Responds to GET /resource/:id requests.
   */
  get(req, res) {
    this.store.findOne(this.name, {id: req.params.id})

    .then((doc) => {
      if (doc) {
        res.status(200).json(doc).end();
      }
      else {
        res.status(404).end();
      }
    })

    .catch(this._err(req, res));
  }

  /**
   * Responds to POST /resource requests.
   */
  post(req, res) {
    const doc = req.body;
    doc.id = uuid.v4();
    const keys = Object.keys(doc);
    this._validate(doc);
    if (keys.length < this.fields.length) {
      const missing = _(this.fields)
        .without(...keys)
        .value();
      return res
        .status(422)
        .end('Missing required fields: ' + missing.join(', '));
    }
    this.store.insert(this.name, doc)

    .then(() => {
      res.status(201).json(doc).end();
    })

    .catch(this._err(req, res));
  }

  /**
   * Responds to PUT /resource/:id requests.
   */
  put(req, res) {
    this.store.findOne(this.name, {id: req.params.id})

    .then((doc) => {
      if (!doc) {
        res.status(404).end();
        return;
      }
      else {
        this._validate(req.body);
        return this.store.update(this.name, {id: req.params.id}, req.body);
      }
    })

    .then((doc) => {
      res.status(200).json(doc).end();
    })

    .catch(this._err(req, res));
  }


  /**
   * Responds to DELETE /resource/:id requests.
   */
  delete(req, res) {
    this.store.findOne(this.name, {id: req.params.id})

    .then((doc) => {
      if (!doc) {
        res.status(404).end();
        return;
      }
      else {
        return this.store.remove(this.name, {id: req.params.id}, req.body);
      }
    })

    .then(() => {
      res.status(204).end();
    })

    .catch(this._err(req, res));
  }
}

/**
 * Domain model.
 */
export class DomainModel extends BaseModel {
  constructor(store) {
    const app = super(store);
    this.name = 'domains';
    this.fields = ['id', 'hostname'];
    return app;
  }
}

/**
 * Sserver model.
 */
export class ServerModel extends BaseModel {
  constructor(store) {
    const app = super(store);
    this.name = 'servers';
    this.fields = ['id', 'address', 'domain'];
    return app;
  }
}
