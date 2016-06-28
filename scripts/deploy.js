"use strict";
let SSH = require('simple-ssh');
let _ = require('lodash');
let ssh = new SSH({
    host: process.env.TAGPAD_HOST,
    user: process.env.TAGPAD_USER,
    pass: process.env.TAGPAD_PASS
});
let handlers = {
  out: function (stdout) { console.log('stdout', stdout); },
  err: function (stderr) { console.log('stderr', stderr); },
  exit: function(code) {
    console.log('exit code :', code); 
  }
};
ssh.exec('cd /home/tagpad/tagpad && bash scripts/server_side_deploy.sh', handlers).start();
