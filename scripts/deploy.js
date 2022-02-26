const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("KBMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();


  let config = `export const nftMarketAddress = "${nftMarket.address}";
export const nftAddress = "${nft.address}";`;

  const data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });