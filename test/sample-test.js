const {
  expect
} = require("chai");
const {
  ethers
} = require("hardhat");

describe("Greeter", function () {
  it("Should mint and trade NFTs", async function () {
    // test to receive contract address
    const Market = await ethers.getContractFactory("KBMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;


    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    // test to receive listing price and auction price
    const listingPrice = (await market.getListingPrice()).toString();
    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    // test minging
    const firstMintTx = await nft.mintToken("https-t1");
    const secondMintTx = await nft.mintToken("https-t2");

    await firstMintTx.wait();
    await secondMintTx.wait();

    await market.makeMarketItem(nftAddress, 1, auctionPrice, {
      value: listingPrice
    })
    await market.makeMarketItem(nftAddress, 2, auctionPrice, {
      value: listingPrice
    })


    // test for different addresses form different users - test accounts
    // return an array of howerver may addresses
    const [_, buyerAddress] = await ethers.getSigners();

    // create a market sale with address id and price
    await market.connect(buyerAddress).createMarketSale(nftAddress, 1, {
      value: auctionPrice
    });


    // test out all the items
    const items = [];
    for await (let item of await market.fetchMarketTokens()) {
      const tokenUrl = await nft.tokenURI(item.tokenId);
      items.push({
        price: item.price.toString(),
        tokenId: item.tokenId.toString(),
        seller: item.seller,
        owner: item.owner,
        tokenUrl
      })
    }


    console.log(items)
  });
});