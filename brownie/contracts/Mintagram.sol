// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // for testings conveniece
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract Mint_A_Gram is
    ERC1155,
    Ownable,
    VRFConsumerBase,
    KeeperCompatibleInterface,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    // Mint factory variables
    Counters.Counter private x_tokenIds;
    mapping(uint256 => string) private x_uris;
    mapping(address => uint256) public x_userMintCount;
    // Mint Lottery variables
    bytes32 public x_keyHash;
    uint256 public x_chainlinkFee;
    uint256 public x_ticketFee;
    uint256 public x_lastTimeStamp;
    uint256 public x_interval;
    address public x_theWinner;
    address payable[] public x_usersEntered;
    lotteryState public x_lotteryState;
    enum lotteryState {
        OPEN,
        Drawing_Winner
    }
    // Mint Auction variables
    // Mint DAC variables

    // Lottery events
    event enteredDraw(address indexed player);
    event requestedDrawWinner(bytes32 indexed requestId);
    event winnerChosen(address indexed player);

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _chainlinkFee,
        uint256 _ticketFee,
        uint256 _interval
    ) public ERC1155("") VRFConsumerBase(_vrfCoordinator, _linkToken) {
        x_lastTimeStamp = block.timestamp;
        x_keyHash = _keyHash;
        x_chainlinkFee = _chainlinkFee;
        x_ticketFee = _ticketFee;
        x_interval = _interval;
        x_theWinner = 0x0000000000000000000000000000000000000000;
        x_lotteryState = lotteryState.OPEN;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (x_uris[tokenId]);
    }

    function setTokenURI(uint256 tokenId, string memory uri) public payable {
        require(
            bytes(x_uris[tokenId]).length == 0,
            "uri can only be set once."
        );
        x_uris[tokenId] = uri;
    }

    // Mint factory
    function mintImage() public payable returns (uint256) {
        x_tokenIds.increment();
        uint256 newItemId = x_tokenIds.current();
        _mint(msg.sender, newItemId, 1, "");
        x_userMintCount[msg.sender] = x_userMintCount[msg.sender] + 1;
        if (x_userMintCount[msg.sender] % 3 == 0) {
            x_usersEntered.push(payable(msg.sender));
            emit enteredDraw(msg.sender);
        }
        return newItemId;
    }

    function setApprovals(address _operator, bool _approved) public {
        this.setApprovalForAll(_operator, _approved);
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    // Mint Lottery functions START
    // TODO Set a fixed price using chainlink price feeds.
    function enterLottery() public payable {
        //require(msg.value >= x_ticketFee, "Not enough value sent to enter");
        require(x_lotteryState == lotteryState.OPEN, "Lottery is not open");
        x_usersEntered.push(payable(msg.sender));
        emit enteredDraw(msg.sender);
    }

    // checkUpkeep Lottery status
    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        view
        override
        returns (bool upKeepNeeded, bytes memory performData)
    {
        bool hasLink = LINK.balanceOf(address(this)) >= x_chainlinkFee;
        bool isOpen = lotteryState.OPEN == x_lotteryState;
        upKeepNeeded = (((x_lastTimeStamp + x_interval) <= block.timestamp) &&
            isOpen &&
            hasLink);
        performData = bytes("");
    }

    // perform upkeep Lottery
    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        require(
            LINK.balanceOf(address(this)) >= x_chainlinkFee,
            "Not enough Link"
        );
        require(address(this).balance >= 0, "Not enough ETH");
        (bool upKeepNeeded, ) = checkUpkeep("");
        require(upKeepNeeded, "No upkeep needed");
        x_lastTimeStamp = block.timestamp;
        x_lotteryState = lotteryState.Drawing_Winner;
        bytes32 requestId = requestRandomness(x_keyHash, x_chainlinkFee);
        emit requestedDrawWinner(requestId);
    }

    // reward random user lottery prize
    function fulfillRandomness(
        bytes32, /*requestId*/
        uint256 randomness
    ) internal override {
        uint256 index = randomness % x_usersEntered.length;
        address payable theWinner = x_usersEntered[index];
        x_theWinner = theWinner;
        x_usersEntered = new address payable[](0);
        (bool success, ) = theWinner.call{value: address(this).balance}("");
        require(success, "transfer failed");
        x_lotteryState = lotteryState.OPEN;
        emit winnerChosen(theWinner);
    }

    // testing helper functions
    function withdraw() public onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function withdrawLink() public onlyOwner nonReentrant {
        LinkTokenInterface linkToken = LinkTokenInterface(LINK);
        require(
            linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function getNumLotteryEntries() public view returns (uint256) {
        return x_usersEntered.length;
    }

    // function getPlayerStats() public view {
    // loop over the player array and return a count of a players entries.
    // return the number of entries from player x / y entries.
    // }

    // Mint Lottery functions END

    // Mint DAC START

    // Mint DAC END

    receive() external payable {}
}
