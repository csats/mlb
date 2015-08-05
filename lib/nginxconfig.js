/**
 * Hello! I'm a representation of an nginx config file.
 */

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const TEMPLATE_PATH = path.resolve(__dirname, '..', 'templates', 'nginx.conf.hbs');

export default class NginxConfig {
  constructor(outputPath) {
    // Do everything sync on boot, async after we've started up.
    this.outputPath = outputPath;
    let tmplString = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    this.template = Handlebars.compile(tmplString);
    this.write({message: 'victory!'}, true);
  }

  write(data, sync = false) {
    let output = this.template(data);
    if (sync === true) {
      return fs.writeFileSync(this.outputPath, output, 'utf8');
    }
    else {
      return new Promise((resolve, reject) => {
        fs.writeFile(this.outputPath, output, () => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }
  }
}
