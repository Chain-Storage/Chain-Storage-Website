import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./Container/Home";
import { Profile } from "./Container/Profile";
import { BuyStorageClass } from "./Container/BuyStorage";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile/" component={Profile} />
          <Route exact path="/profile/buyStorage" component={BuyStorageClass} />
        </Switch>
      </div>
    );
  }
}

export default App;
