
// I'm just a little programatic deal that stores the default options and then allows them to be
// overridden by either command line parameters or environment variables (for easy Docker support).

// Inheritence order: environment variables override defaults. Command-line arguments overwrite
// environment variables.

import parseArgs from 'minimist';

let OPTION_DEFINITIONS = [{
  name: 'store',
  default: 'file',
  allowed: ['file']
}, {
  name: 'file'
}, {
  name: 'api_server_port',
  default: 8888,
}, {
  name: 'nginx_manager_port',
  default: 8889,
}, {
  name: 'nginx_port',
  default: 8080,
}];

let argv = parseArgs(process.argv.slice(2));

let options = {};

OPTION_DEFINITIONS.forEach(function(opt) {

  // Start with the default. It can be undefined. That's okay.
  options[opt.name] = opt.default;

  // Check to see if an environment variable exists of format "MLB_NAME".
  let environmentKey = 'MLB_' + opt.name.toUpperCase();
  if (process.env[environmentKey]) {
    options[opt.name] = process.env[environmentKey];
  }

  // Check to see if a command line parameter exists.
  if (argv[opt.name]) {
    options[opt.name] = argv[opt.name];
  }

  // Make sure we're allowed.
  if (opt.allowed && opt.allowed.indexOf(options[opt.name]) === -1) {
    throw new Error(`Unknown value for ${opt.name}: ${options[opt.name]}`);
  }
});

export default options;
