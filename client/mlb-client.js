
import {resolve} from 'url';
import axios from 'axios';

export default class MlbClient {

  constructor({url}) {
    this.domains = new Resource({url, name: 'domains'});
    this.servers = new Resource({url, name: 'servers'});
  }

}

let Resource = class {
  constructor({url, name}) {
    this.endpoint = resolve(url, name);
  }

  get(id) {
    let url = this.endpoint;
    if (typeof id === 'string') {
      url += '/' + id;
    }
    return axios.get(url)

    .then(function(res) {
      return res.data;
    })

    .catch(function(res) {
      throw res;
    });
  }

  insert(data) {
    return axios.post(this.endpoint, data)

    .then(function(res) {
      return res.data;
    })

    .catch(function(res) {
      throw res;
    });
  }

  update(id, data) {
    let url = this.endpoint + '/' + id;
    return axios.put(url, data)

    .then(function(res) {
      return res.data;
    })

    .catch(function(res) {
      throw res;
    });
  }

  remove(id) {
    let url = this.endpoint + '/' + id;
    return axios.delete(url)

    .then(function(res) {
      return res.data;
    })

    .catch(function(res) {
      throw res;
    });
  }
}
