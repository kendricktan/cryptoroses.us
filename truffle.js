var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = process.env.INFURA_API_KEY;
var mnemonic = process.env.ETH_MNEMONIC_KEY;

module.exports = {
  networks: {
    development: {
      gas: 900000,
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      network_id: 3,
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey),
      gas: 900000
    },
    rinkeby: {
      network_id: 4,
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + infura_apikey),
      gas: 900000
    },
    mainnet: {
      network_id: 1,
      provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/" + infura_apikey),
      gas: 900000
    },
  },
  solc: {
    // Turns on the Solidity optimizer. For development the optimizer's
    // quite helpful, just remember to be careful, and potentially turn it
    // off, for live deployment and/or audit time. For more information,
    // see the Truffle 4.0.0 release notes.
    //
    // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
