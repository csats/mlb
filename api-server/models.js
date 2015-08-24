
import express from 'express';
import uuid from 'node-uuid';
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
    let doc = req.body;
    doc.id = uuid.v4();
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
    return app;
  }
}
