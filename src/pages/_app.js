import React from "react";
import "./../styles/global.scss";
import NavbarCustom from "./../components/NavbarCustom";
import IndexPage from "./index";
import DashboardPage from "./dashboard";
import SettingsPage from "./settings";
import AuthPage from "./auth";
import { Switch, Route, Router } from "./../util/router.js";
import FirebaseActionPage from "./firebase-action.js";
import NotFoundPage from "./not-found.js";
import "./../util/analytics.js";
import { ProvideAuth } from "./../util/auth.js";

function App(props) {
  return (
    <ProvideAuth>
      <Router>
        <>
          <NavbarCustom
            bg="white"
            variant="light"
            expand="md"
            logo="https://uploads.divjoy.com/logo.svg"
          />

          <Switch>
            <Route exact path="/" component={IndexPage} />

            <Route exact path="/dashboard" component={DashboardPage} />

            <Route exact path="/settings/:section" component={SettingsPage} />

            <Route exact path="/auth/:type" component={AuthPage} />

            <Route
              exact
              path="/firebase-action"
              component={FirebaseActionPage}
            />

            <Route component={NotFoundPage} />
          </Switch>
        </>
      </Router>
    </ProvideAuth>
  );
}

export default App;
