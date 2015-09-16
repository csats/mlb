
import parseArgs from 'minimist';
import MlbClient from './mlb-client';

const argv = parseArgs(process.argv.slice(2));

const RESOURCES = ['domains', 'servers'];
const RESOURCE_ALIAS = {
  'domain': 'domains',
  'server': 'servers',
};

const COMMANDS  = ['list', 'insert', 'update', 'remove'];
const COMMAND_ALIAS = {
  'get': 'list',
  'create': 'insert',
  'modify': 'update',
  'delete': 'remove',
};


//////////////////
// argv parsing //
//////////////////

const usage = function() {
  console.log('');
  console.log('Usage: mlb [--server (server)] [command] [resource]');
  console.log('');
  console.log('Commands: \n' + COMMANDS.map(c => '   ' + c).join('\n'));
  console.log('');
  console.log('Resources: \n' + RESOURCES.map(c => '   ' + c).join('\n'));
  console.log('');
  console.log('If you don\'t want to specify server every time, you can set the');
  console.log('MLB_SERVER environment variable.');
  process.exit(1);
};

if (argv._.length < 2) {
  usage();
}

const server = process.env.MLB_SERVER || argv.server;
if (!server) {
  usage();
}

let command = argv._.shift();
let resource = argv._.shift();

if (COMMAND_ALIAS[command]) {
  command = COMMAND_ALIAS[command];
}

if (RESOURCE_ALIAS[resource]) {
  resource = RESOURCE_ALIAS[resource];
}

if (COMMANDS.indexOf(command) === -1) {
  usage();
}


//////////////////////
// helper functions //
//////////////////////

const prettyPrint = (data) => {
  console.log(JSON.stringify(data, null, 4));
};

const doErr = (err) => {
  console.log('Error!');
  console.error(JSON.stringify(err, null, 4));
  process.exit(1);
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


//////////////////////////
// Actual commands here //
//////////////////////////

const mlbClient = new MlbClient({
  url: server
});

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
