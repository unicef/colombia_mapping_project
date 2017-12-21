/* eslint-disable no-unused-vars*/
import React, {
  Component
} from 'react';
/* eslint-enable no-unused-vars*/
import './App.css';
// import {connect} from 'react-redux'
import MyMap from './components/MyMap'
import YearlyCalendar from './components/YearlyCalendar'
import Auth from './Auth.js';
/**
 * Main App
 */
class App extends Component {
  /**
   * render - Render component
   * auth.login - runs auth0 authentication
   *
   * @return {type}  description
   */
  render() {
    let auth = new Auth();
    auth.login();
    return (
      <div>
        <MyMap />
        <YearlyCalendar />
      </div>
    );
  }
}

export default App;
