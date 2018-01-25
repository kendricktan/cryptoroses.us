const axios = require('axios')
const RoseContract = require('./build/contracts/CryptoRoses.json')
const contract = require('truffle-contract')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const express = require('express')
var bodyParser = require("body-parser");
const app = express()

// Truffle abstraction to interact with our
// deployed contract
var roseContract = contract(RoseContract)
roseContract.setProvider(web3.currentProvider)

// Dirty hack for web3@1.0.0 support for localhost testrpc
// see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof roseContract.currentProvider.sendAsync !== "function") {
  roseContract.currentProvider.sendAsync = function () {
    return roseContract.currentProvider.send.apply(
      roseContract.currentProvider, arguments
    );
  };
}

// Get accounts from web3
web3.eth.getAccounts((err, accounts) => {
  roseContract.deployed()
    .then((roseInstance) => {
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      app.post('/checkhash', (req, res) => {        
        var hash = req.body.hash
        
        if (hash === undefined) {
          res.status(400).send({'error': 'invalid hash'})
        }

        roseInstance.checkRose.call(hash, { from: accounts[0] })
        .then((resp) => res.send(resp))
      })

      app.post('/buyrosegrlc', (req, res) => {
        var txid = req.body.txid
        var memo = req.body.memo
        
        if (txid === undefined || memo === undefined) {
          res.status(400).send({'error': 'txid and memo field must be filled'})
        }

        var apiurl = 'https://explorer.grlc-bakery.fun/api/getrawtransaction?txid=' + txid + '&decrypt=1'

        // Call API to check how many GRLC they've sent
        axios.get(apiurl)
        .then((resp) => {

          // Check VOUT and count how much is sent to the address
          const sendAmount = resp.data.vout.reduce((total, vout) => {            
            try {
              if (vout.scriptPubKey.addresses[0] === 'GJ5ukdQRqVbVNftEYw4ZnRN5DxhBKdfEtZ') {
                return total + parseFloat(vout.value)
              }
            } catch (e) {
              return total
            }
            return total
          }, 0)          

          // Make sure it's at least >= 2 GRLC
          if (sendAmount < 2) {
            res.status(400).send({'error': 'sent amount too little'})
          }
          
          const haddress = web3.sha3(txid)          

          // Call contract
          roseInstance.buyRoseGRLC(haddress, memo, sendAmount, { from: accounts[0] })
          .then((roseResult) => {            
            res.send({'hash': haddress})
          })
          .catch((roseErr) => {
            res.status(500).send({'error': roseErr})
          })
        })

        .catch((err) => {
          res.status(500).send({'error': 'explorer seems to be down, try again later'})
        })
      })

      app.listen(3001, () => console.log('Example app listening on port 3001!'))
    })
    .catch((err) => {
      console.log(err)
    })
})