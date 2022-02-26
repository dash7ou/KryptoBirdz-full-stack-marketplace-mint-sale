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
  const [nft, setNfTs] = useState<Array<any>>([]);
  const [loadingState, setLoadingState] = useState<Boolean>(false);

  const loadNfts = async (): Promise<any> =>{
    try{
      setLoadingState(true)
      const provider = new ethers.providers.JsonRpcProvider();
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(nftMarketAddress, KBMarket.abi, provider);
      const items = [];

      for await(let item of await marketContract.fetchMarketItems()){
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
      setLoadingState(false);
    }
  }

  useEffect(()=>{

  }, [])

  return (
    <div>
     
    </div>
  )
}

export default Home
