var model = require('./model.js');
import queryString from 'query-string';

exports.getLocation = function () {
  let hash = window.location.hash;
  // remove query string
  if (hash.indexOf('?')) {
    hash = hash.split('?')[0];
  }
  // Removes the `#`, and any leading/final `/` characters
  return hash.replace(/^#\/?|\/$/g, '').split('/');
};


exports.getQuery = function () {
  // Removes the `#`, and any leading/final `/` characters
  let hash = window.location.hash;
  if (hash.indexOf('?')) {
    return queryString.parse(hash.split('?')[1]);
  }
  return {};
};

exports.startNavigating = function (newHash) {
  var curHash = window.location.hash.substr(1);
  if (curHash !== newHash) {
    model.setState({transitioning: true});
    window.location.replace(
      window.location.pathname + window.location.search + '#/' + newHash
    );
  }
};

exports.navigated = function () {
  // Removes the `#`, and any leading/final `/` characters
  var normalizedHash = window.location.hash.replace(/^#\/?|\/$/g, '');
  if (normalizedHash === '') {
    // redirect for default route
    exports.startNavigating('browse'); 
  } else {
    model.setState({
      location : exports.getLocation(),
      transitioning: false
    });
  }
};
