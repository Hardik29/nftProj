// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";



contract  Marketplace is ERC1155Holder {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _nftSold;
    IERC1155 private nftContract;
    address private owner;



    constructor(address _nftContract) {
        nftContract = IERC1155(_nftContract);
    }

    struct NFTMarketItem{
        uint256 nftId;
        uint256 amount;
        uint256 price;
        address payable seller;
        address payable owner;
        bool sold;
    }

    mapping(uint256 => NFTMarketItem) private marketItem;
     
    function listNft(uint256 nftId,uint256 amount, uint256 price, uint256 royalty) external {

        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        marketItem[tokenId] = NFTMarketItem(
            nftId,
            amount,
            price,
            payable(msg.sender),
            payable(msg.sender),
            false
        );

        IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), nftId, amount, "");
    }

   

    function buyNFT(uint256 nftId, uint256 amount) external payable {
        uint256 price = marketItem[nftId].price ;
        nftContract.safeTransferFrom(msg.sender, address(this), 0, price, "");
        marketItem[nftId].owner = payable(msg.sender);
        _nftSold.increment();
        onERC1155Received(address(this), msg.sender, nftId, amount, "");
        nftContract.safeTransferFrom(address(this), msg.sender, nftId, 1, "");


    }

}