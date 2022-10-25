// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";

abstract contract NftToken is Ownable, ERC721AQueryable, IERC2981 {
  uint256 public immutable MAX_SUPPLY;
  uint256 public immutable TOKEN_PRICE;
  uint8 public immutable MAX_BATCH_SIZE;

  error InvalidMintPrice();
  error RequestedAmountExceedsMaxBatchSize();
  error RequestedAmountExceedsMaxSupply();
  error MetadataIsFrozen();
  error CannotFreezeMetadataBeforeReveal();

  bool public isMetadataFrozen = false;
  string uriPrefix = "";
  string hiddenMetadataUri = "";

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _maxSupply,
    uint256 _tokenPrice,
    uint8 _maxBatchSize,
    string memory _hiddenMetadataUri
  ) ERC721A(_name, _symbol) {
    MAX_SUPPLY = _maxSupply;
    TOKEN_PRICE = _tokenPrice;
    MAX_BATCH_SIZE = _maxBatchSize;

    setHiddenMetadataUri(_hiddenMetadataUri);
  }

  function _beforeMint(uint256 _startTokenId, uint256 _quantity) internal virtual;

  function _startTokenId() override internal view virtual returns (uint256) {
    return 1;
  }

  function mint(uint256 _amount) public payable {
    if (msg.value != TOKEN_PRICE * _amount) {
      revert InvalidMintPrice();
    }

    if (_amount > MAX_BATCH_SIZE) {
      revert RequestedAmountExceedsMaxBatchSize();
    }

    if (totalSupply() + _amount > MAX_SUPPLY) {
      revert RequestedAmountExceedsMaxSupply();
    }

    _beforeMint(_nextTokenId(), _amount);
    _safeMint(msg.sender, _amount);
  }

  function freezeMetadata() public onlyOwner {
    if (bytes(uriPrefix).length == 0) {
      revert CannotFreezeMetadataBeforeReveal();
    }

    isMetadataFrozen = true;
  }

  function setUriPrefix(string memory _uriPrefix) public onlyOwner {
    if (isMetadataFrozen) {
      revert MetadataIsFrozen();
    }

    uriPrefix = _uriPrefix;
  }

  function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
    if (isMetadataFrozen) {
      revert MetadataIsFrozen();
    }

    hiddenMetadataUri = _hiddenMetadataUri;
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
    if (!_exists(_tokenId)) {
      revert URIQueryForNonexistentToken();
    }

    if (bytes(uriPrefix).length == 0) {
      return hiddenMetadataUri;
    }

    return string(abi.encodePacked(uriPrefix, Strings.toString(_tokenId), ".json"));
  }

  function royaltyInfo(uint256 /* _tokenId */, uint256 _salePrice) public view virtual override returns (address, uint256) {
    /*
     * 10% of any secondary market sale goes back to the Smart Community Wallet
     * and is split among all holders without intermediaries.
     */

    return (address(this), _salePrice / 10);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, IERC165) returns (bool) {
    return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }
}
