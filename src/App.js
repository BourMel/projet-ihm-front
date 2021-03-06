import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { /*FormattedMessage,*/ injectIntl } from 'react-intl';
import Radium, { StyleRoot } from 'radium';

import { colors } from './utils.js';
import './styles.css';

import LoginContainer from './scenes/LoginContainer/';
import MenuContainer from './scenes/MenuContainer/';

/*****************/
/****Component****/
/*****************/

class App extends Component {
  render() {
    var appStyle = {
      backgroundColor: colors.whiteColor,
      fontFamily: 'Magra',
      width: '100%',
    };

    return (
      <div style={appStyle}>
        <StyleRoot>
          <Router>
            <div style={appStyle.page}>
              <Route exact path="/login" component={LoginContainer} />
              <Route exact path="/register" component={LoginContainer} />

              <Route path="/" component={MenuContainer} />
            </div>
          </Router>
        </StyleRoot>
      </div>
    );
  }
}

export default injectIntl(Radium(App));
