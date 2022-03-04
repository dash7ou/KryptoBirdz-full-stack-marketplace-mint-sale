import type { NextPage } from 'next';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import axios from "axios"
import Web3 from "web3modal";
import Image from 'next/image';
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from 'next/router';

import {
    nftAddress,
    nftMarketAddress
} from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        // authorization: 'Bearer ' + "6a5fd39831c349fcd4524899cd0efa16"
    },
    apiPath: "/api/v0/add"
});

const Home: NextPage = () => {
    const [fileUrl, setFileUrl] = useState<String | null>(null);
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: ""
    });

    const router = useRouter();

    const onChange = async (e: any) => {
        try {
            const file = e.target.files[0];
            const added = await client.add(
                file, {
                progress: prog => console.log(prog)
            }
            );

            const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`;
            setFileUrl(url);
        } catch (err) {
            console.log(err)
        }
    }


    const createMarket = async () => {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;


        try {
            const data = JSON.stringify({
                name, description, image: fileUrl
            });

            // upload to ipfs
            const added = await client.add(data);
            const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`;
            await createSale(url);
        } catch (err) {
            console.log(err)
        }
    }


    const createSale = async (url: string) => {
        try {
            const web3Modal = new Web3();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(nftAddress, NFT.abi, signer);
            const transaction = await contract.createToken(url);
            const tx = await transaction.wait();

            const event = tx.event[0];
            const value = event.args[2];
            const tokenId = +value;
            const price = ethers.utils.parseUnits(formInput.price, "ether");

            const marketContract = new ethers.Contract(nftMarketAddress, NFT.abi, signer);
            const listingPrice = (await marketContract.getListingPrice()).toString();

            const makeItemTransaction = await marketContract.makeMarketItem(nftAddress, tokenId, price, {
                value: listingPrice
            });

            await makeItemTransaction.wait();
            router.push("/");
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className='flex justify-center'>
            <div className="w-1/2 flex flex-col pb-12">
                <input placeholder="Asset Name" name="name" id="name" className='mt-8 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea placeholder="Asset Description" name="description" id="description" className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input placeholder="Asset Price in ETH" name="price" id="price" className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                {!fileUrl && <input type={"file"} name="asset" id="asset" className='mt-2 border rounded p-4'
                    onChange={onChange}
                />}
                {
                    fileUrl && (
                        <img src={fileUrl} alt="asset" className='rounded mt-4' width={"350px"} />
                    )
                }

                <button className='font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg' onClick={createMarket}>Mint NFT</button>
            </div>
        </div>
    )
}

export default Home