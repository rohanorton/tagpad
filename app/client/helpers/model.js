// The apps complete current state
var state = {};
var onStateChangeCallback;

// Make the given changes to the state and perform any required housekeeping.
exports.setState = function (changes) {
  Object.assign(state, changes);
  if (onStateChangeCallback) {
    onStateChangeCallback();
  }
};

exports.getState = function () {
  return Object.assign({}, state);
};

exports.onStateChange = function (callback) {
  onStateChangeCallback = callback;
};
