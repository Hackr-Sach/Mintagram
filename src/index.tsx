import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import Moralis from "moralis";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const appId = process.env.REACT_APP_MORALIS_APP_ID!;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL!;

console.log("Moralis", Moralis.Web3)

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
