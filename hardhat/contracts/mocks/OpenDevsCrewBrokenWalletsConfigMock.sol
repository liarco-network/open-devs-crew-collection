// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../extensions/SmartCommunityWallet.sol";

contract OpenDevsCrewBrokenHashLipsWalletsMock is SmartCommunityWallet {
  constructor(address _emptyContractAddress)
  SmartCommunityWallet(
    90 days,
    20,
    24 hours,
    2 * 365 days,
    address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2),
    2,
    _emptyContractAddress,
    address(0)
  )
  NftToken(
    "OpenDevsCrew",
    "ODC",
    1990,
    0.1 ether,
    10,
    "ipfs://__CID__/hidden.json",
    block.timestamp - 1 // Allow mint immediately after deployment
  ) {}
}

contract OpenDevsCrewMepWalletMock is SmartCommunityWallet {
  constructor(address _emptyContractAddress)
  SmartCommunityWallet(
    90 days,
    20,
    24 hours,
    2 * 365 days,
    address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2),
    2,
    address(0),
    _emptyContractAddress
  )
  NftToken(
    "OpenDevsCrew",
    "ODC",
    1990,
    0.1 ether,
    10,
    "ipfs://__CID__/hidden.json",
    block.timestamp - 1 // Allow mint immediately after deployment
  ) {}
}
