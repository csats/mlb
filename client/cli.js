
import parseArgs from 'minimist';
import MlbClient from './mlb-client';

const argv = parseArgs(process.argv.slice(2));

const RESOURCES = ['domains', 'servers'];
const COMMANDS  = ['list', 'create', 'modify', 'remove'];

const usage = function() {
  console.log('Usage: mlb --server [server] [resource] [command]');
  console.log('Resources: ' + RESOURCES.join(', '));
  console.log('Commands: ' + COMMANDS.join(', '));
  process.exit(1);
};

if (argv._.length === 0 || !argv.server) {
  usage();
}

const resource = argv._.shift();
let command;

if (argv._.length === 0) {
  command = 'list';
}
else {
  command = argv._.shift();
}

if (COMMANDS.indexOf(command) === -1) {
  usage();
}

const mlbClient = new MlbClient({
  url: argv.server
});

const prettyPrint = (data) => {
  console.log(JSON.stringify(data, null, 4));
};

const doErr = (res) => {
  console.log('Error!');
  prettyPrint(res);
}

// Gets the remaining argv arguments as parameters.
const getParams = () => {
  const ret = {};
  while (argv._.length > 0) {
    const arg = argv._.shift();
    if (arg.indexOf('=') === -1) {
      console.log('Create and modify take arugments of the form key=value');
    }
    const [key, value] = arg.split('=');
    ret[key] = value;
  }
  return ret;
};

if (command === 'list') {
  mlbClient[resource].get()
    .then(prettyPrint)
    .catch(doErr);
}

else if (command === 'create') {
  const params = getParams();
  mlbClient[resource].create(params)
    .then(prettyPrint)
    .catch(doErr);
}

else if (command === 'update') {
  const id = argv._.shift();
  const params = getParams();
  mlbClient[resource].update(id, params)
    .then(prettyPrint)
    .catch(doErr);
}

else if (command === 'remove') {
  const id = argv._.shift();
  mlbClient[resource].remove(id)
    .then(() => {
      console.log('Removed.');
    })
    .catch(doErr);
}
