import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider, useMoralis } from "react-moralis";
import App from "./App";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Home } from "./HomeFeed";
import { UploadMint } from "./UploadMint";
import { Auctions } from "./Auctions";
import { UserProfile } from "./Profile";
import { CreateAuction } from "./AuctionsCreate";

const appId = process.env.REACT_APP_MORALIS_APP_ID!;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL!;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <BrowserRouter>
        <div id="app-wrapper">
          <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/Home" component={App} />
            <Route exact path="/Mint-Images" component={UploadMint} /> 
            <Route exact path="/Auctions" component={Auctions} />
            <Route exact path="/CreateAuction" component={CreateAuction} />
            <Route exact path="/Profile" component={UserProfile} />
          </Switch>
        </div>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
