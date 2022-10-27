// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../OpenDevsCrew.sol";

contract NonPayableContractWalletMock is IERC721Receiver {
  OpenDevsCrew immutable COLLECTION_CONTRACT;

  constructor(address _collectionContractAddress) {
    COLLECTION_CONTRACT = OpenDevsCrew(payable(_collectionContractAddress));
  }

  function mint(uint256 _amount) public payable {
    COLLECTION_CONTRACT.mint{ value: msg.value }(_amount);
  }

  function withdraw(uint256 _diamondHandsHolderTokenId, uint256[] memory _tokenIds) public {
    COLLECTION_CONTRACT.withdraw(_diamondHandsHolderTokenId, _tokenIds);
  }

  function withdrawInactiveFunds(uint256 _diamondHandsHolderTokenId, uint256[] memory _tokenIds) public {
    COLLECTION_CONTRACT.withdrawInactiveFunds(_diamondHandsHolderTokenId, _tokenIds);
  }

  function onERC721Received(
    address /* _operator */,
    address /* _from */,
    uint256 /* _tokenId */,
    bytes calldata /* _data */
  ) external pure returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
  }
}
