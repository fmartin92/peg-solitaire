import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { App } from "./App.js";
import { DebugTools } from "./DebugTools.js";

export class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/about">
            <h1>holis</h1>
          </Route>
          <Route path="/dev">
            <DebugTools />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
