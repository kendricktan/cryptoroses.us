var axios = require('axios')
var RoseContract = require('./build/contracts/CryptoRoses.json')
var contract = require('truffle-contract')

var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Truffle abstraction to interact with our
// deployed contract
var roseContract = contract(RoseContract)
roseContract.setProvider(web3.currentProvider)

// Dirty hack for web3@1.0.0 support for localhost testrpc
// see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof roseContract.currentProvider.sendAsync !== "function") {
  roseContract.currentProvider.sendAsync = function() {
    return roseContract.currentProvider.send.apply(
      roseContract.currentProvider, arguments
    );
  };
}

// Get accounts from web3
web3.eth.getAccounts((err, accounts) => {
  roseContract.deployed()
  .then((roseInstance) => {
    // Watch event and respond to event
    // With a callback function  
    roseInstance.ECheckGarlicTx()
    .watch((err, result) => {
        // Should print out the parameters
        console.log(result)
      })
    })    
  .catch((err) => {
    console.log(err)  
  })
})