"use strict";
let SSH = require('simple-ssh');
let _ = require('lodash');

let config = require('../loadConfig.js');

let ssh = new SSH({
    host: deployConfig.host,
    user: deployConfig.user,
    pass: deployConfig.pass
});

let remoteAppDir = deployConfig.remoteAppDir;

let commands = [
  'git clean -f -d',
  'git pull origin master',
  'npm install',
  'sudo forever stopall',
  'source scripts/build.sh',
  'cd build && sudo NODE_ENV=production forever start server.js'
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
  .exec(commands[5], handlers(commands[5])).start();

