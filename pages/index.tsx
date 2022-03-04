import type { NextPage } from 'next';
import {ethers} from "ethers";
import { useEffect, useState } from 'react';
import axios from "axios"
import Web3 from "web3modal";

import {
  nftAddress,
  nftMarketAddress
} from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";

const Home: NextPage = () => {
  const [nfts, setNfTs] = useState<Array<any>>([]);
  const [loadingState, setLoadingState] = useState<Boolean>(true);

  const loadNfts = async (): Promise<any> =>{
    try{
      const provider = new ethers.providers.JsonRpcProvider();
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(nftMarketAddress, KBMarket.abi, provider);
      const items = [];

      for await(let item of await marketContract.fetchMarketTokens()){
        const tokenUri = await tokenContract.tokenURI(item.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), "ether");

        items.push({
          price: price,
          tokenId: +item.tokenId,
          seller: item.seller,
          owner: item.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        });
      };

      setNfTs(items);
      setLoadingState(false);
    }catch(err: any){
      console.log(err);
      setLoadingState(false);
    }
  }


  const buyNFT = async (nft: any): Promise<any> =>{
    try{
      const web3Modal = new Web3();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftMarketAddress, KBMarket.abi, signer);

      const price = ethers.utils.parseUnits((+nft.price).toString(), "ether");
      const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
        value: price
      })
      await transaction.wait();

      await loadNfts();
    }catch(err){

    }
  }

  useEffect(()=>{
    const getData = async _=>{
      try{
        await loadNfts()
      }catch(err){

      }
    }

    getData()
  }, [])

  return (
    loadingState ? (
      <h1 className="px-20 py-7 text-4x1">loading</h1>
    ): (
      !loadingState && nfts.length > 0 ? (
        <div className="flex justify-center">
          <div style={{maxWidth: "1600px"}} className="px-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i)=>(
                <div className="border shadow rounded-x1 overflow-hidden" key={i}>
                  <img src={nft?.image} alt={nft?.name} />
                  <div className="P-4">
                    <p style={{height: "64px"}} className="text-3x1 font-semibold">
                      {nft?.name}
                    </p>
                    <div style={{ height:"72px", overflow:"hidden"}}>
                      <p className="text-gray-400">
                        {nft?.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-3x-1 mb-4 font-bold text-white">
                      {nft?.price} ETH
                    </p>
                    <button onClick={()=> buyNFT(nft)} className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'>
                      Buy
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      ):(
        <h1 className="px-20 py-7 text-4x1">No NFTs in marketplace!</h1>
      )
    )
  )
}

export default Home
