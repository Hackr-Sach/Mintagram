// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract UserImage is ERC1155 {
  using SafeMath for uint256;

  uint256 public tokenCounter;
  constructor () public ERC1155 ("ipfs://QmfU7GJmNnULJ2YRfGyECAT1jWHnXWW1oeszLgV3Ls7Shy/images/{id}.json"){   
    tokenCounter = 0;
  }
  function mintImage(string memory tokenURI) public returns (uint256) {
    uint256 newItemId = tokenCounter;
    _mint(msg.sender, newItemId, 1, "");
    _setURI(tokenURI);
    tokenCounter = tokenCounter + 1;
    return newItemId;
  }
}