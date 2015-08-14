
import express from 'express';
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
      res.status(500);
      res.end();
    }
  }

  auth(req, res, next){
    // Something interesting should be here.
    return next();
  }

  index(req, res) {
    this.store.find(this.name).then(function(docs) {
      res.status(200);
      res.json(docs);
      res.end();
    })
    .catch(this.err(req, res));
  }

  get(req, res) {

  }

  post(req, res) {
    let domain = req.body;
    this.store.insert(this.name, domain).then(function() {
      res.status(201);
      res.json(domain);
      res.end();
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
