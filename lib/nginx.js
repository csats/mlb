
import {spawn} from 'child_process';

/**
 * Hello! I am a wrapper class around nginx.
 */
export default class Nginx {
  constructor(configPath) {
    this.configPath = configPath;
  }

  start() {
    if (this.child) {
      throw new Error('Tried to start() nginx, but it already started.');
    }
    this.child = spawn('nginx', ['-c', this.configPath]);
    this.child.stdout.on('data', this._stdout.bind(this));
    this.child.stderr.on('data', this._stderr.bind(this));
  }

  /**
   * Callback fired upon stdout from nginx
   */
  _stdout(message) {
    process.stdout.write('stdout: ' + message);
  }

  /**
   * Callback fired upon stderr from nginx
   */
  _stderr(message) {
    process.stdout.write('stderr: ' + message);
  }
}
