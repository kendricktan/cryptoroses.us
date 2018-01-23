const CryptoRoses = artifacts.require('./CryptoRoses.sol')

module.exports = function (deployer) {
  deployer.deploy(CryptoRoses)
}
