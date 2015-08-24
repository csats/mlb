
import {spawn} from 'child_process';
import logger from './logger';

/**
 * Hello! I am a wrapper class around nginx.
 */
export default class Nginx {
  constructor(configPath) {
    this.configPath = configPath;

    this.child = spawn('nginx', ['-c', this.configPath]);

    this.child.on('error', this._onError.bind(this));
    this.child.on('close', this._onClose.bind(this));
    this.child.stdout.on('data', this._stdout.bind(this));
    this.child.stderr.on('data', this._stderr.bind(this));
  }

  _onError(err) {
    console.log('nginx failed to start');
    throw new Error(err);
  }

  _onClose(code, signal) {
    console.log(`nginx exited. code: ${code}`);
    throw new Error('nginx exited');
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

  /**
   * You have a new config file! Send SIGHUP and reload.
   */
  reload() {
    logger.log('Reloading nginx.');
    this.child.kill('SIGHUP');
  }
}
