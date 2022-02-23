// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    // counters allow us to keep track of tokenIds
    Counters.Counter private _tokenIds;

    // address of marketplace for NFTs to interact
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("KryptoBirdz", "KBIRDS") {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // mint item id
        _mint(msg.sender, newItemId);
        // save item id with token url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users.
        setApprovalForAll(contractAddress, true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
    }
}
