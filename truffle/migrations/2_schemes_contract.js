const Schemes  = artifacts.require('Schemes');

module.exports = function (deployer) {
    deployer.deploy(Schemes);
  };
  