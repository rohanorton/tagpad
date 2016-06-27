"use strict";
let SSH = require('simple-ssh');
let _ = require('lodash');

let ssh = new SSH({
    host: process.env.TAGPAD_HOST,
    user: process.env.TAGPAD_USER,
    pass: process.env.TAGPAD_PASS
});

let remoteAppDir = '/home/tagpad/tagpad';

let commands = [
  'sudo git clean -f -d',
  'sudo git pull origin master',
  'sudo rm -r build',
  'sudo mkdir build',
  'sudo npm install',
  'sudo forever stopall',
  'sudo npm run build',
  'sudo NODE_ENV=production forever start ' + remoteAppDir + '/build/server.js'
];

// need to go to proper dir first.
commands = _.map(commands, function (cmd) {
  return 'cd ' + remoteAppDir + ' && ' + cmd;
});


function handlers (cmd)  {
  return {
    out: function (stdout) { console.log(cmd + ' stdout', stdout); },
    err: function (stderr) { console.log(cmd + ' stderr', stderr); },
    exit: function(code) {
      console.log(cmd + ' exit code :', code); 
    }
  }
};


ssh.exec(commands[0], handlers(commands[0]))
  .exec(commands[1], handlers(commands[1]))
  .exec(commands[2], handlers(commands[2]))
  .exec(commands[3], handlers(commands[3]))
  .exec(commands[4], handlers(commands[4]))
  .exec(commands[5], handlers(commands[5]))
  .exec(commands[6], handlers(commands[6]))
  .exec(commands[7], handlers(commands[7])).start();
