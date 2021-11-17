// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";  

contract Mint_Auction_Base {

    //represents an auction on a NFT
    struct Auction {
        address payable seller;
        uint128 startingPrice;
        uint128 endingPrice;
        uint64 duration;
        uint64 startedAt; // if 0 then auction has been concluded
    }

    // Reference to contract tracking NFT ownership.
    ERC1155 public nonFungibleContract;

    // The network takes a cut of every auction sale. Measured in basis of (1/100 of a percent)
    // Values 0-10,000 map to 0%-100%
    uint256 public networkCut;

    // Map of tokenId to the corresonding auction
    mapping(uint256=>Auction) tokenIdToAuction;

    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 endingPrice, uint256 duration);
    event AuctionSuccesful(uint256 tokenId, uint256 totalPrie, address winner);
    event AuctionCancelled(uint256 tokenId);


    // I don't understand this.
    ///@dev DONT GIVE ME YOUR MONEY
    function()external recieve;

    // Modifiers to check that inputs can be saftely stored with a certain 
    // number of bits. We use contants and miltiple modifers to save gas
    modifier canBeStoredWith64Bits(uint256 _value){
        require(_value <= 18446744073709551615);
        _;
    }
    modifier canBeStoredWith128Bits(uint256 _value){
        require(_value < 340282366920938463463374607431768211455);
        _;
    }


    /// @dev Reurns true if the claimant owns the token
    /// @param _claimant - Address claiming to own the token
    /// @param _tokenAddress - ID of token whose ownership to verify
    function _owns(address _claimant, address _tokenAddress) internal view returns(bool) {
        return nonFungibleContract.isApprovedForAll(_tokenAddress, _claimant);
    }

    /// @dev Ecrows NFT assigning ownership to this contract
    /// Throws if the escrow fails
    /// @param _owner - Current owner address of the token to escrow
    /// @param _tokenId - ID of token whose approval to verify
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if the transfer fails
        nonFungibleContract.safeTransferFrom(_owner, address(this), _tokenId, 1, '');
    }

    ///@dev Transfers an NFT ownedby this contract to another address
    /// Returns true if the transfer succeeds
    ///@param _receiver - Address to transfer the NFt to
    ///@ _tokenId - ID of the token to transfer
    function _transfer(address holder ,address _receiver, uint256 _tokenId ) internal {
        // will throw if transfer fails
        nonFungibleContract.safeTransferFrom(address(this), _receiver, _tokenId, 1, '');
    }

    ///@dev Adds ab auction to the list of open auctions and also
    /// fire off the AuctionCreacted event
    ///@param _tokenId - The ID of the token to be put into auction
    ///@param _auction - Auction to add 
    function _addAuction(uint256 _tokenId, Auction memory _auction) internal {
        // requires that all auction  have a duration of atleast
        // one mintute (keeps math simple apparently)
        require(_auction.duration >= 60);
        tokenIdToAuction[_tokenId] = _auction;
        emit AuctionCreated(
            uint256(_tokenId),
            uint256(_auction.startingPrice),
            uint256(_auction.endingPrice),
            uint256(_auction.duration)
        );

    }

    ///@dev cancels auction unconditionally
    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        _removeAuction(_tokenId);
        _transfer(address(this), _seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }

    ///@dev Removes an auction from a list of open auctions
    ///@param _tokenId - ID of an nft auction
    function _removeAuction(uint256 _tokenId) internal {
        delete tokenIdToAuction[_tokenId];
    }

    ///@dev returns true if NFT is in auction
    ///@param _auction - Auction to check
    function _isOnAuction(Auction storage _auction) internal view returns(bool){
        return(_auction.startedAt > 0);
    }

    ///@dev Computes the price and transfers winnings.
    /// Does not trnsfer ownership of the token
    function _bid(uint256 _tokenId, uint256 _bidAmount) internal returns(uint256) {
        // get ref to Auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];
        // explicitly check that this auction is live
        // becaue of how eth mappings work we cannot count on the lookup above to fail
        // an invalid _tokenId will return and empty Auctions object.
        require(_isOnAuction(auction));
        // check that the incoming bid is higher then the current price
        uint256 price = _currentPrice(auction);
        require(_bidAmount >= price);
        // Grab a ref to the seller b4 the Auction strct is deleted.
        address seller = auction.seller;
        // The bid is good, remove the auction b4 sending the fees
        // to the sender so we cant have reentry attacks.
        _removeAuction(_tokenId);
        // Transfer proceeds to seller if any 
        if(price > 0){
            // calculate the networkCut
            networkCut = _computeCut(price);
            uint256 sellerProceeds = price - networkCut;

            auction.seller.transfer(sellerProceeds);
        }
    emit AuctionSuccesful(_tokenId, price, msg.sender);
    return price;
    }


    ///@dev Returns the current price of an NFT on auction
    function _currentPrice(Auction storage _auction) internal view returns(uint256){
        uint256 secondsPassed = 0;
        secondsPassed = block.timestamp - _auction.startedAt;
        return _computeCurrentPrice(
        _auction.startingPrice,
        _auction.endingPrice,
        _auction.duration,
        secondsPassed
        );
    }
    
    ///@dev computes current price of the auction. Factored out from
    /// _currentPrice so we ca run extensive unit tests.
    /// when testing make this function public and turn on
    /// current price computation tests uite
    function _computeCurrentPrice(
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        uint256 _secondsPassed
    ) internal pure returns(uint256){
        if(_secondsPassed >= _duration){
            return _endingPrice;
        } else {
            //starting pricce can be higher then ending price (often is), so
            //this delta can be negative
            int256 totalPricChange = int256(_endingPrice) - int256(_startingPrice);
            // this multiplication cannot overflow, _seoncdsPassed will easily fit within
            //64bits and totalPriceChange will easilly fit within 128bits, their product
            //will always fit within 256 bits
            int256 currentPriceChange = totalPricChange * int256(_secondsPassed) / int256(_duration);
            // currentPriceChange can go below zero but if so will have a magnitude less that startPrice.
            // this this result should alway end up positive
            int256 currentPrice = int256(_startingPrice) * currentPriceChange;

            return uint256(currentPrice);
        }
    }

    ///@dev Computes the networks cut of an NFT sale
    ///@param _price - Sale price of NFT
    function _computeCut(uint256 _price) internal view returns(uint256) {
        return _price * networkCut / 10000;
    }
}

