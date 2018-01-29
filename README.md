# cryptoroses.us

## What is this?

This is a side project that I made simply because I wanted to make something that interacts with Garlicoin (GRLC).

Example of purchased rose: https://cryptoroses.us/check?hash=0xacbc535fc764af0a8fd29a99cb74beda32c354fef7354eb84bd7f7a589748aaf

## Getting started

1. Make sure you're using node v8.9.x
```
git clone https://github.com/kendricktan/cryptoroses.us.git
cd cryptoroses.us
```
2. Set up env var
```bash
export ETH_MNEMONIC_KEY='XXXXXX' # Mnemonic key for your ETH account
export INFURA_API_KEY='XXXXXX' # Used to deploy contract via infura
```
3. You have the option to deploy to 4 different networks (testrpc, ropsten, rinkeby, or mainnet). Note you'll need some ETH (around 0.1 ETH) to deploy the contract onto the mainnet.
```bash
truffle migrate # testrpc
truffle migrate --network ropsten # ropsten
truffle migrate --network rinkeby # rinkeby
truffle migrate --network mainnet # mainnet
```
4. Installing packages
```
npm install
cd client npm install
cd ..
```
5. You'll need to spawn two tabs: 1 for the oracle and one for the web app

- Terminal 1
```
node garlicoinOracle.js
```

- Terminal 2
```
npm run build
npm run start
```

6. Navigate to `http://localhost:3000`