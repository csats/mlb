
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
      url = resolve(url, id);
    }
    return axios.get(url).then(function(res) {
      return res.data;
    });
  }

  create(data) {
    return axios.post(this.endpoint, data).then(function(res) {
      return res.data;
    });
  }

  update() {

  }

  delete() {

  }
}
