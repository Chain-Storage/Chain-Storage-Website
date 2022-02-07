import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./Container/Home";
import { Profile } from "./Container/Profile";

// contract 0xAa499672AbBb77dCEFB21493CB95092F4FE40F9B

function App(): JSX.Element {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/profile/" component={Profile} />
      </Switch>
    </div>
  );
}

export default App;
