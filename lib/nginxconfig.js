/**
 * Hello! I'm a representation of an nginx config file.
 */

import ncp from 'nginx-config-parser';
import fs from 'fs';

export default class NginxConfig {
  constructor(defaultPath, configPath) {
    // Do everything sync on boot, async after we've started up.
    this.defaultConfig = fs.readFileSync(defaultPath, 'utf-8');
    this.configPath = configPath;
    let config = ncp.queryFromString(this.defaultConfig);
    fs.writeFileSync(this.configPath, config.stringify());
  }
}
