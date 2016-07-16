import zxcvbn from 'zxcvbn';
import bcrypt from 'bcrypt';

const saltRounds = 10;

exports.assertIsStrongEnough = function (plainTextPassword) {
  var result = zxcvbn(plainTextPassword);
  if (result.score < 3) {
    throw new Error(result.warning);
  }
};

exports.hash = function (plainTextPassword, callback) {
  bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
    callback(err, hash);
  });
};

exports.matchesHash = function (plainTextPassword, hash, callback) {
  bcrypt.compare(plainTextPassword, hash, function(err, res) {
    callback(err, res);
  });
};
