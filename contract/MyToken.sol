// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract MyToken is ERC1155, Ownable, ERC1155Burnable {
    constructor() ERC1155("") {}
    
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint( uint256 id, uint256 amount)
        public
        onlyOwner
    {
        _mint(msg.sender, id, amount,"");
    }

    function transfer(address to, uint256 id, uint256 amount) public onlyOwner{
        _safeTransferFrom(msg.sender, to, id, amount,"");
    }

    function burn(uint256 id, uint256 amount) public onlyOwner{
        _burn(msg.sender, id, amount);
    }    
}
