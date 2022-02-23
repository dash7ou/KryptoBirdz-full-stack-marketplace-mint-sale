require("@nomiclabs/hardhat-waffle");

const projectId = "dc9cda40af85461e8c3d3105c6a4bf78";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: ["50b4282c999b7c8524e70f7fa0a2185024552bfbf235fb53252a2ab176cd1ea9"]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: ["50b4282c999b7c8524e70f7fa0a2185024552bfbf235fb53252a2ab176cd1ea9"]
    }
  },
  solidity: {
    version: "0.8.4",
    setting: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};