import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider, useMoralis } from "react-moralis";
import App from "./App";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Home } from "./HomeFeed";

const appId = process.env.REACT_APP_MORALIS_APP_ID!;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL!;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <BrowserRouter>
        <div id="app-wrapper">
          <Switch>
            <Route exact path="/Home" component={App} />
            <Route exact path="/Mint-Images" component={Home} />
            <Route exact path="/Favorites" component={Home} />
            <Route exact path="/Auctions" component={Home} />
            <Route exact path="/Profile" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
