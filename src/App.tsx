import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./Container/Home";
import { Profile } from "./Container/Profile";
import dotenv from "dotenv";

dotenv.config();

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
