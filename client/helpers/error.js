import _ from 'lodash';
exports.isAuthError = function (error) {
  let message = _.get(error, 'source.errors[0].message');
  if (message.indexOf('Auth') !== -1) {
    return true; 
  }
  return false;
};
