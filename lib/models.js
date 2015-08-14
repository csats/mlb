
import express from 'express';
import uuid from 'node-uuid';
import {log} from './logger';

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

  // Easy error processor that we can pass to .catch blocks of promises.
  err(req, res) {
    return function(err) {
      log(err);
      res.status(500).end();
    }
  }

  auth(req, res, next){
    // Something interesting should be here.
    return next();
  }

  index(req, res) {
    this.store.find(this.name).then(function(docs) {
      res.status(200).json(docs).end();
    })
    .catch(this.err(req, res));
  }

  get(req, res) {
    this.store.findOne(this.name, {id: req.params.id})
    .then(function(doc) {
      if (doc) {
        res.status(200).json(doc).end();
      }
      else {
        res.status(404).end();
      }
    })
    .catch(this.err(req, res));
  }

  post(req, res) {
    let obj = req.body;
    obj.id = uuid.v4();
    this.store.insert(this.name, obj).then(function() {
      res.status(201).json(obj).end();
    })
    .catch(this.err(req, res));
  }

  put(req, res) {

  }

  delete(req, res) {

  }

}

export class DomainModel extends BaseModel {
  constructor(store) {
    this.name = 'domains';
    return super(store);
  }
}

export class ServerModel extends BaseModel {
  constructor(store) {
    this.name = 'servers';
    return super(store);
  }
}
