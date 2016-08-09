import config from '../loadConfig';
import userPrompt from 'prompt';
const db = require('../data/' + config.database + '.js');


// user confirmation required!
userPrompt.start();
// disable prefix message & colors
userPrompt.message = '';
userPrompt.delimiter = '';
userPrompt.colors = false;
// wait for user confirmation
userPrompt.get({
  properties: {
    // setup the dialog
    confirm: {
      // allow yes, no, y, n, YES, NO, Y, N as answer
      pattern: /^(yes|no|y|n)$/gi,
      description: 'Do you really want to sync the db and delete all data?',
      message: 'Type yes/no',
      required: true,
      default: 'no'
    }
  }
}, function (err, result){
    // transform to lower case
    var c = result.confirm.toLowerCase();
    // yes or y typed ? otherwise abort
    if (c!='y' && c!='yes'){
        console.log('ABORT');
        return;
    }
    console.log('Syncing db'); 

    db.connect(config[config.database]);
    db.sync(function (err) {
      if (err) {
        throw err;
      }
      console.log('Sync successful');
    });   
});
