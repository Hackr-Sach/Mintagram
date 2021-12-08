
Mintagram is essentially an inverse approach to opensea. The goal is to create a more inward driven user experience then other apps while providing all the same functionality and some. Community governed, censorship resitant environment where users are the only benifactors.  The overall mission is to reduce berrirs, and showcase how a dac can work in a social setting.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Acquire a Moralis account here -> https://moralis.io/ to obtain API keys to init the app

## Quick start
1. Install dependencies via `yarn install` (or `npm install`)
2. Copy `.env.example` to `.env` and add your keys:
3. Add `SKIP_PREFLIGHT_CHECK=true` to your .env to bypass the 8.1.0 babel-loader warning

# Your appId
REACT_APP_MORALIS_APP_ID="xxx"

#Your serverUrl
REACT_APP_MORALIS_SERVER_URL="xxx"

#Moralis API KEY
REACT_APP_Moralis_API_KEY="xxx"

#Etherscan API KEY
REACT_APP_ETHERSCAN_TOKEN="xxx"

#Contract address
REACT_APP_DEPLOYED_CONTRACT="xxx"
#Contract address
REACT_APP_DEPLOYED_AUCTION="xxx"

SKIP_PREFLIGHT_CHECK=true

4.gulp watch / Start the app with `yarn start` (or `npm run start`)

# Styling
Run `gulp watch` to init styling
Run `gulp build --production` to compile styling for production
