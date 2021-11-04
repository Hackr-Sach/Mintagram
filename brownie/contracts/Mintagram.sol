// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mint_A_Gram is ERC1155 {

  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  string internal _tokenURI;
  uint256 public _lottoFee;

  constructor() public ERC1155() {
    //_mint(msg.sender, 1, 1, ""); // test mint
  }

  function mintImage(address user, string memory tokenURI) public payable returns (uint256){
    _tokenIds.increment(); 
    uint256 newItemId = _tokenIds.current();
    _mint(user, newItemId, 1, "");
    _setURI(tokenURI);
  return newItemId;
  }

}