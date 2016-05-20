var React = require('react');

require('./style.css')

module.exports = function (props) {
  return (
    <form 
      onSubmit={props.onSubmit}
      className="login-form ui middle aligned center aligned grid">
      <div className="column">
        <h2 className="ui header image header">
          <div className="content">
            Log-in to your account
          </div>
        </h2>
        <form className="ui large form">
          <div className="ui">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder="E-mail address" />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Password" />
              </div>
            </div>
            <button 
              type="submit" 
              className="ui fluid large orange submit button">
              Login
            </button>
          </div>
          <div className="ui error message"></div>
        </form>
        <div className="ui signup-container">
          New to us? <a href="#">Sign Up</a>
        </div>
      </div>
    </form>
  );
};
