
import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './pages/login';
import WebSSH from './pages/ssh';
import Layout from './layout';
import "./i18next";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/ssh" exact component={WebSSH} />
        <Route component={Layout} />
      </Switch>
    );
  }
}

export default App;
