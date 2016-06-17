import model from "./../helpers/model.js";
import _ from "lodash";

function hide() {
  model.setState({notification: null});
}

let hideNotificationAfterDelay = _.debounce(hide, 2000);

exports.info = function (message) {
  model.setState({notification: message});
  hideNotificationAfterDelay();
};
