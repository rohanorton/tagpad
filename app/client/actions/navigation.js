var model = require('./model.js');

exports.getLocation = function () {
  // Removes the `#`, and any leading/final `/` characters
  return window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
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
