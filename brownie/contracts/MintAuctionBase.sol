// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MintAuction {
    event AuctionCreated(address, uint256, uint256, uint256, uint256, address);
    event Bid(uint128, address, uint256);
    event AuctionSuccessful(uint256, uint256, address);
    event AuctionCanceled(uint256);

    // structure defines an auction
    struct Auction {
        address payable nft; // address the nft was minted from.
        uint256 tokenId; // token ID
        address payable seller; // your public key if your the seller
        uint128 startPrice;
        uint256 duration; // > 60
        uint256 startedAt; // init 0
        uint128 highestBid; // init 0
        address payable highestBidder; //init to seller.
    }
    uint256 public networkFee; // rather then an owner/auctioneer cut. Network fees support the DAC protocol.
    mapping(address => uint256) pendingReturns; // tracks users pending returns.
    mapping(address => mapping(uint256 => Auction)) tokenAddressAndIdToAuction;
    Auction[] autoResolveQ; // queue of all auctions

    // testing function TOBE REMOVED
    function getAutoResolveQ(uint256 i)
        public
        view
        returns (
            bool,
            address,
            uint256
        )
    {
        return (
            _onAuction(autoResolveQ[i].nft, autoResolveQ[i].tokenId),
            autoResolveQ[i].nft,
            autoResolveQ[i].tokenId
        );
    }

    // checks if caller is the owner of an asset
    function _ownerOf(address _nft, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        ERC1155 nft = ERC1155(_nft);
        return nft.balanceOf(msg.sender, _tokenId) != 0;
    }

    // transfers ownership over to the contract
    function _escrow(
        address _owner,
        address _nft,
        uint256 _tokenId
    ) internal {
        ERC1155 nft = ERC1155(_nft);
        nft.safeTransferFrom(_owner, address(this), _tokenId, 1, "");
    }

    // transers an escrowed asset from the contract to a user
    function _transfer(
        address receiver,
        address _nft,
        uint256 _tokenId
    ) internal {
        ERC1155 nft = ERC1155(_nft);
        nft.safeTransferFrom(address(this), receiver, _tokenId, 1, "");
    }

    // withdraw pending returns, result of being outbid.
    // going to look to automate this after automating the auction resolution
    function _withdrawReturn() internal {
        require(pendingReturns[msg.sender] != 0); // make sure the msg sender is actually in pendingReturns
        uint256 amountOwed = pendingReturns[msg.sender];
        pendingReturns[msg.sender] = 0; // zero out the return state to protect from reentry attacks
        if (!payable(msg.sender).send(amountOwed))
            pendingReturns[msg.sender] = amountOwed;

        payable(msg.sender).transfer(amountOwed);
    }

    function _addAuction(Auction memory _auction) internal {
        require(_auction.duration >= 60);
        _auction.startedAt = block.timestamp; // declares the start time used in validating an auctions state.
        tokenAddressAndIdToAuction[_auction.nft][_auction.tokenId] = _auction;
        autoResolveQ.push(_auction);
        emit AuctionCreated(
            address(_auction.nft),
            uint256(_auction.tokenId),
            uint256(_auction.startPrice),
            uint256(_auction.highestBid),
            uint256(_auction.duration),
            address(msg.sender)
        );
    }

    // checks the state of an auction ON/OFF
    function _onAuction(address _nft, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        Auction storage auction = tokenAddressAndIdToAuction[_nft][_tokenId];
        return auction.startedAt + auction.duration > block.timestamp;
    }

    // internal only removes an auction from the collection of auctions.
    function _removeAuction(address _nft, uint256 _tokenId) internal {
        delete tokenAddressAndIdToAuction[_nft][_tokenId];
    }

    // prematurely ends an auction and resolves assets. todo - handle current highestBidders pending return? All others should already handled.
    function _cancelAuction(
        address seller,
        address _nft,
        uint256 _tokenId
    ) internal {
        _removeAuction(_nft, _tokenId);
        _transfer(seller, _nft, _tokenId);
        emit AuctionCanceled(_tokenId);
    }

    // Network fee is defined in the contructor and cannot be  changed unless some governance magic
    function _computeNetworkFee(uint256 _price)
        internal
        view
        returns (uint256)
    {
        return (_price * networkFee) / 10000;
    }

    // handles users bids.
    function _bid(address _nft, uint256 _tokenId) internal returns (uint256) {
        Auction storage auction = tokenAddressAndIdToAuction[_nft][_tokenId];
        require(_onAuction(_nft, _tokenId));
        require(msg.value > auction.highestBid);
        if (auction.highestBid != 0)
            pendingReturns[auction.highestBidder] += auction.highestBid; // let user withdrawl their returns. or keepers?
        auction.highestBid = uint128(msg.value);
        auction.highestBidder = payable(msg.sender);
        // Handle bids and returns
        emit Bid(
            uint128(auction.highestBid),
            address(auction.nft),
            uint256(_tokenId)
        );
        return auction.highestBid;
    }

    // called by the perform upkeep function, End() resolves the auction
    function _End(address _nft, uint256 _tokenId) internal {
        Auction storage auction = tokenAddressAndIdToAuction[_nft][_tokenId];
        require(!_onAuction(_nft, _tokenId));
        //get refs b4 auction struct is deleted.
        address payable seller = auction.seller;
        address payable winner = auction.highestBidder;
        uint128 finalPrice = auction.highestBid;

        _removeAuction(_nft, _tokenId);
        // process funds
        uint256 networksCut = _computeNetworkFee(finalPrice);
        uint256 sellersCut = finalPrice - networksCut;
        // precaution step
        delete pendingReturns[winner];
        // transfer funds
        seller.transfer(sellersCut);
        _transfer(winner, _nft, _tokenId);
        // SUCCESS
        emit AuctionSuccessful(
            uint256(_tokenId),
            uint256(finalPrice),
            address(winner)
        );
    }

    receive() external payable {}
}

interface IERC721 {
    function transfer(address, uint256) external;

    function transferFrom(
        address,
        address,
        uint256
    ) external;
}
