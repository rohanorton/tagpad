import React from 'react';

export default function (props) {
  let style = {};
  if (!props.message) {
    style = { visibility: 'hidden' };
  }
  return (
    <div style={style} id="notification-container" className="ui center aligned container">
      <div className="ui compact message">
        <p>{props.message}</p>
      </div>
    </div>
  );
}
