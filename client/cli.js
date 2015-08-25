
import parseArgs from 'minimist';
import MlbClient from './mlb-client';

const argv = parseArgs(process.argv.slice(2));

const RESOURCES = ['domains', 'servers'];
const COMMANDS  = ['list', 'insert', 'update', 'remove'];

const usage = function() {
  console.log('Usage: mlb --server [server] [resource] [command]');
  console.log('Resources: ' + RESOURCES.join(', '));
  console.log('Commands: ' + COMMANDS.join(', '));
  console.log('If you don\'t want to specify server every time, you can set the');
  console.log('MLB_SERVER environment variable.');
  process.exit(1);
};

if (argv._.length === 0) {
  usage();
}

const server = process.env.MLB_SERVER || argv.server;
if (!server) {
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
  url: server
});

const prettyPrint = (data) => {
  console.log(JSON.stringify(data, null, 4));
};

const doErr = (err) => {
  console.log('Error!');
  prettyPrint(err);
}

// Gets the remaining argv arguments as parameters.
const getParams = () => {
  const ret = {};
  while (argv._.length > 0) {
    const arg = argv._.shift();
    if (arg.indexOf('=') === -1) {
      console.log('insert and modify take arugments of the form key=value');
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

else if (command === 'insert') {
  const params = getParams();
  mlbClient[resource].insert(params)
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
