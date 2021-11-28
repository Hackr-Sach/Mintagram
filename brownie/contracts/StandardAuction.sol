// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./MintAuctionBase.sol";

// Auctions are set by a seller and automatically resolved via chainlink keepers. Atm this 
// resolution is done on a first come first serve basis. It would take a massive amount of auctions
// needing resolution to make this untollerable. In the future I hope to make this a little smoother
// by notifying checkupkeep work needs to be done and on who, rather then having to check for who.
// for more detail look in AuctionBase.sol
// for more detail look in AuctionBase.sol

contract StandardAuction is MintAuction, ERC1155Holder, VRFConsumerBase, KeeperCompatibleInterface {
    bytes32 public x_keyHash;
    uint256 public x_chainlinkFee;
    constructor(
        uint256 _networkCut,  // a fee that goes towards sustaining this autonomas platform.
        address _vrfCoordinator,  
        address _linkToken,     // link token address
        bytes32 _keyHash,       
        uint256 _chainlinkFee   // 0.01
        ) VRFConsumerBase(_vrfCoordinator, _linkToken) { 
        require(_networkCut <= 10000);
        networkFee = _networkCut;
        x_chainlinkFee = _chainlinkFee;
        x_keyHash = _keyHash;
    }
    // testing function 
    function withdrawlBalance(address _nft, uint256 _tokenId) external payable {
        ERC1155 nft = ERC1155(_nft);
        require(
            _ownerOf(_nft, _tokenId) ||
            msg.sender == address(nft)
        );
        payable(msg.sender).transfer(address(this).balance);
    }

    // create an auction
    function createAuction(
        address _nft,
        uint256 _tokenId,
        address _seller,
        uint128 _startPrice,
        uint256 _duration,
        uint256 _startedAt,
        uint128 _highestBid,
        address _highestBidder
    )public payable
    {
        require(_ownerOf(_nft,_tokenId));
        _escrow(msg.sender, _nft, _tokenId);
        Auction memory auction = Auction(
            payable(_nft),
            uint256(_tokenId),
            payable(_seller),
            uint128(_startPrice),
            uint256(_duration),
            uint256(_startedAt),
            uint128(_highestBid),
            payable(_highestBidder)
        );
        _addAuction(auction);
    }
    // make a bid
    function bid(address _nft, uint256 _tokenId) public payable{
        _bid(_nft, _tokenId);
    }
    // withdraw old bids.     
    function withdrawBid() public payable{
        _withdrawReturn();
    }

    // checks status / prob to be removed as we show this in getAuction
    function isOn(address _nft, uint256 _tokenId) public view returns(bool){
        bool x = _onAuction(_nft, _tokenId);
        return x;
    }
    // to be removed
    function onEndAuction(address _nft, uint256 _tokenId) public payable{
        _End(_nft,_tokenId);
    }

    // cancel auction
    function cancelAuction(address _nft, uint256 _tokenId) public {
        Auction storage auction = tokenAddressAndIdToAuction[_nft][_tokenId];
        require(msg.sender == auction.seller);
        require(_onAuction(_nft, _tokenId));
        _cancelAuction(auction.seller, _nft, _tokenId);
    }
    // get all auctions
    function getAuctions() public view returns(Auction[] memory){
        Auction[] memory ref;
        for(int i = 0; i < int(autoResolveQ.length); i++){
            ref[uint(i)] = autoResolveQ[uint(i)];
        }
        return ref;
    }
    // get an auction
    function getAuction(address _nft, uint256 _tokenId)
     public view returns(
        address,
        address,
        uint256,
        uint256,
        uint256,
        bool
        )
        {
            Auction storage auction = tokenAddressAndIdToAuction[_nft][_tokenId];
            require(_onAuction(_nft, _tokenId));
                return  (
                    address(auction.seller),
                    address(auction.nft),
                    uint256(auction.tokenId),
                    uint256(auction.highestBid),
                    uint256(auction.duration),
                    bool(_onAuction(_nft, _tokenId))
                );
        }
    // Im thinking that we use this to track ids still but in a more secondary way
    // using a memory reference to interface with autoResolveQ and stash indexs or send particular credentials ( NFT, tokenId )
    //uint[] public indexRef; 
    function checkUpkeep(bytes memory /*checkData*/)
        public
        view
        override
        returns (bool upKeepNeeded, bytes memory performData)
    {
        Auction[] memory ref = autoResolveQ;
        uint[] memory indexRef; 
        uint count = 0;
        bool go = false;
        for(int i = 0; i < int(ref.length); i++){
            address nft = ref[uint256(i)].nft;
            uint256 tokenId = ref[uint256(i)].tokenId;
            if(!_onAuction(nft, tokenId)){
                go = true;
                indexRef[count] = uint(i); 
                count++;
            }
        } 
        upKeepNeeded = (go);
        performData = abi.encode(indexRef); // bytes("");
    }
    event PerformedUPKEEP();
    function performUpkeep(bytes calldata performData) external override {
        uint[] memory ref = abi.decode(performData, (uint[]));
        //require(address(this).balance >= 0, "Not enough ETH");
        (bool upKeepNeeded, ) = checkUpkeep("");
        require(upKeepNeeded, "No upkeep needed");
        //resolve an auction
        for(int i = 0; i < int(ref.length); i++){
            uint idx = ref[uint(i)];
            Auction storage auc = autoResolveQ[idx]; // mock auction holding the id and address
            _End(auc.nft, auc.tokenId);
            autoResolveQ[idx] = autoResolveQ[autoResolveQ.length-1];
            autoResolveQ.pop();
        
        }
        //delete ref;
        emit PerformedUPKEEP(); 
    }

    // satisfies reqs
    function fulfillRandomness(
        bytes32, /*requestId*/
        uint256 randomness
    ) internal override {}
}