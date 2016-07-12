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


exports.setQuery = function (newQuery) {
  var oldHash = window.location.hash,
    newHash;
  if (oldHash.indexOf('?')) {
    newHash = oldHash.split('?')[0];
  } else {
    newHash = oldHash;
  }
  newHash += '?' + queryString.stringify(newQuery); 
  window.location.hash = newHash;
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

function isLoggedIn() {
  var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)tagpadlogin\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return (cookieValue === 'true');
}

exports.navigated = function () {
  // Removes the `#`, and any leading/final `/` characters
  var normalizedHash = window.location.hash.replace(/^#\/?|\/$/g, '');
  var loggedIn = isLoggedIn();
  console.log('loggedIn = ', loggedIn);
  if (!loggedIn && normalizedHash !== 'login') {
    console.log('navigate to login page');
    // redirect to login if they are not logged in and trying to access somsething which isn't the login page.
    exports.startNavigating('login'); 
  } else if (normalizedHash === '') {
    // redirect for default route
    exports.startNavigating('browse'); 
  } else {
    model.setState({
      location : exports.getLocation(),
      query: exports.getQuery(),
      transitioning: false
    });
  }
};
