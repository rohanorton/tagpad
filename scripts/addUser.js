var path = require('path');
import {hash, assertIsStrongEnough} from '../data/password';
const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('../data/' + config.database + '.js');

var argv = require('optimist')
    .usage('Usage: $0 --email [string] --password [string]')
    .demand(['email','password'])
    .argv;

function createUser(email, password, callback) {
	assertIsStrongEnough(password);
  console.log(email, password);
  hash(password, function (err, hash) {
    if (err) {
      return callback(err);
    }
    db.addUser({
      email: email,
      password: hash
    }).catch(callback).then(function (user) {
			callback(null, user);	
		});
  });
}

db.connect && db.connect(config[config.database]);

createUser(argv.email, argv.password, function (err) {
	if (err) {
		throw err;
	}
	console.log('User created');
});




