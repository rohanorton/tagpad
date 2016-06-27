import model from "./../helpers/model.js";
import _ from "lodash";

function hide() {
  model.setState({notification: null});
}

let hideNotificationAfterDelay = _.debounce(hide, 2000);

exports.loading = function (message) {
  model.setState({notification: {type: 'loading', message}});
  hideNotificationAfterDelay();
};

exports.success = function (message) {
  model.setState({notification: {type: 'success', message}});
  hideNotificationAfterDelay();
};

exports.error = function (header, message) {
  model.setState({notification: {type: 'error', header, message, close: function () {
    model.setState({notification: null}); 
  }}});
  // dont hide errors, user has to hide them
  hideNotificationAfterDelay.cancel();
};
