import React from 'react';

export default function (props) {
  if (!props.message) {
    return null;
  }
  return (
    <div id="notification-container" className="ui center aligned container">
      <div className="ui compact message">
        <p>{props.message}</p>
      </div>
    </div>
  );
}
