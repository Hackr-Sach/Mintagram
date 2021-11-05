// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mint_A_Gram is ERC1155 {

  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  string public _tokenURI;
  // uint256 public _lottoFee;

  constructor() public ERC1155(_tokenURI) {
    //_mint(msg.sender, 1, 1, ""); // test mint
  }

  function mintImage(string memory tokenURI) public payable returns (uint256){
    _tokenIds.increment(); 
    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId, 1, "");
    _tokenURI = tokenURI;
  return newItemId;
  }

}