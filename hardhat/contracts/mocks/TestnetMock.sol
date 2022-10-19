// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../extensions/SmartCommunityWallet.sol";

contract TestnetMock is SmartCommunityWallet {
  constructor()
  SmartCommunityWallet(
    // _diamondHandsHolderTimeFrame
    10 minutes,

    // _whaleRoleThreshold
    5,

    // _transferCooldownAfterWithdrawal
    5 minutes,

    // _addressInactivityTimeFrame
    20 minutes,

    // WETH address on Goerli network
    address(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6),

    // _hashLipsLabStartupShare
    2,

    // _hashLipsLabAddress
    address(0xF5DD58DbC2D24cf8F44350796152434b9599F4b0),

    // _mepAddress
    address(0xa2d22f96e29793d1a4dD48F5B609860FEa23C0B4)
  )
  NftToken(
    // _name
    "TestnetMock",

    // _symbol
    "TM",

    // _maxSupply
    1990,

    // _tokenPrice
    0.01 ether,

    // _maxBatchSize
    10,

    // _hiddenMetadataUri
    "ipfs://__CID__/hidden.json"
  ) {
    // Initial airdrops
    _mint(0x5B4dbF2Ee55930c9389EaDDa0f1fAC899f8F1bB4, 29);
  }
}
