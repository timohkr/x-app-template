//                                      #######
//                                 ################
//                               ####################
//                             ###########   #########
//                            #########      #########
//          #######          #########       #########
//          #########       #########      ##########
//           ##########     ########     ####################
//            ##########   #########  #########################
//              ################### ############################
//               #################  ##########          ########
//                 ##############      ###              ########
//                  ############                       #########
//                    ##########                     ##########
//                     ########                    ###########
//                       ###                    ############
//                                          ##############
//                                    #################
//                                   ##############
//                                   #########

// This contract is provided as a template for VeBetterDAO and should not be used as the definitive version. Ensure proper review and testing before deployment.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721Enumerable, Ownable {
    uint256 public currentTokenId;

    // Struct to represent an item in the marketplace
    struct Item {
        string name;
        string description;
        uint256 price; // Price in wei
        uint256 rentPrice; // Rent price in wei
        address seller;
        bool isSold;
    }

    // Struct to represent rental info
    struct RentalInfo {
        address renter;
        uint256 rentalStartTime;
        uint256 rentalPeriod;
        uint256 downpayment;
        bool isRented;
    }

    // Mapping from tokenId to Item details
    mapping(uint256 => Item) public items;

    // Mapping from tokenId to rental info
    mapping(uint256 => RentalInfo) public rentals;

    // Mapping to track blacklisted addresses
    mapping(address => bool) public blacklist;

    event ItemListed(uint256 indexed tokenId, string name, string description, uint256 price, uint256 rentPrice, address seller);
    event ItemSold(uint256 indexed tokenId, address buyer);
    event ItemRented(uint256 indexed tokenId, address renter, uint256 rentalPeriod);
    event RentalEnded(uint256 indexed tokenId, address renter);
    event UserBlacklisted(address indexed user);

    constructor(address initialOwner) ERC721("NFTMarketplace", "NFTM") Ownable(initialOwner) {}

    // Function to mint and list an item
    function createListing(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _rentPrice
    ) external {
        require(_price > 0, "Price must be greater than zero");
        require(_rentPrice > 0, "Rent price must be greater than zero");

        currentTokenId++;

        // Mint a new token to the seller (caller)
        _safeMint(msg.sender, currentTokenId);

        // Add the item to the marketplace
        items[currentTokenId] = Item({
            name: _name,
            description: _description,
            price: _price,
            rentPrice: _rentPrice,
            seller: msg.sender,
            isSold: false
        });

        emit ItemListed(currentTokenId, _name, _description, _price, _rentPrice, msg.sender);
    }

    // Function to manually check if a token exists
    function _checkExists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }

    // Function to buy an item outright
    function buyItem(uint256 _tokenId) external payable {
        Item storage item = items[_tokenId];

        require(_checkExists(_tokenId), "Item does not exist");
        require(msg.value == item.price, "Incorrect payment amount");
        require(!item.isSold, "Item already sold");

        // Transfer the payment to the seller
        payable(item.seller).transfer(msg.value);

        // Transfer ownership of the NFT
        _transfer(item.seller, msg.sender, _tokenId);

        item.isSold = true;

        emit ItemSold(_tokenId, msg.sender);
    }

    // Function to rent an item
    function rentItem(uint256 _tokenId, uint256 _rentalPeriod) external payable {
        Item storage item = items[_tokenId];
        RentalInfo storage rental = rentals[_tokenId];

        require(_checkExists(_tokenId), "Item does not exist");
        require(!rental.isRented, "Item is already rented");
        require(msg.value >= item.rentPrice, "Incorrect downpayment");
        require(!blacklist[msg.sender], "You are blacklisted from renting");

        // Store rental information
        rental.renter = msg.sender;
        rental.rentalStartTime = block.timestamp;
        rental.rentalPeriod = _rentalPeriod;
        rental.downpayment = msg.value;
        rental.isRented = true;

        emit ItemRented(_tokenId, msg.sender, _rentalPeriod);
    }

    // Function to return an item after rental and refund the downpayment
    function endRental(uint256 _tokenId) external {
        RentalInfo storage rental = rentals[_tokenId];

        require(rental.isRented, "Item is not rented");
        require(rental.renter == msg.sender, "Only the renter can return the item");
        require(block.timestamp >= rental.rentalStartTime + rental.rentalPeriod, "Rental period has not ended");

        // Refund the renter the downpayment
        payable(rental.renter).transfer(rental.downpayment);

        // Clear rental data
        rental.isRented = false;

        emit RentalEnded(_tokenId, rental.renter);
    }

    // Function to forcefully end rental if time has expired (for owner)
    function forceEndRental(uint256 _tokenId) external onlyOwner {
        RentalInfo storage rental = rentals[_tokenId];

        require(rental.isRented, "Item is not rented");
        require(block.timestamp >= rental.rentalStartTime + rental.rentalPeriod, "Rental period has not ended");

        // Do not refund the downpayment; seller holds it
        // Payable to the seller
        payable(items[_tokenId].seller).transfer(rental.downpayment);

        // Blacklist the renter
        blacklist[rental.renter] = true;
        emit UserBlacklisted(rental.renter);

        // Clear rental data
        rental.isRented = false;

        emit RentalEnded(_tokenId, rental.renter);
    }

    // Function to override tokenURI to return metadata for each token
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_checkExists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        Item memory item = items[tokenId];
        return string(abi.encodePacked(
            '{"name":"', item.name, '",',
            '"description":"', item.description, '",',
            '"image":"', _getItemImageURI(tokenId), '"}'
        ));
    }

    // Set the image URI for each item (can be replaced with IPFS)
    function _getItemImageURI(uint256 tokenId) internal pure returns (string memory) {
        return string(abi.encodePacked("https://example.com/item/", uint2str(tokenId), ".png"));
    }

    // Utility to convert uint256 to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        return string(bstr);
    }
}
