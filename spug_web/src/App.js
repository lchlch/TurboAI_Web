import React, { Component, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/newlogin";
import Register from "./pages/newregister";
// import WebSSH from "./pages/ssh";
import Layout from "./layout";
import Purchase from "./pages/purchase";
import "./i18next";
// import gStore from "gStore";

class App extends Component {
  componentWillMount() {
    // let token = localStorage.getItem("token");
    // if (!token) {
    //   // window.location.href = `${window.location.origin}/login.html`;
    // }
    // gStore._getMenuList();
  }

  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" exact component={Register} />
          {/* <Route path="/ssh" exact component={WebSSH} /> */}
          <Route path="/purchase" exact component={Purchase} />
          <Route component={Layout} />
        </Switch>
      </Suspense>
    );
  }
}

export default App;
