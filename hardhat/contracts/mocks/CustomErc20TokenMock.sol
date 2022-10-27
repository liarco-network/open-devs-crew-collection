// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomErc20TokenMock is ERC20 {
  address deployer;

  constructor() ERC20("Custom Token", "CT") {
    deployer = msg.sender;
  }

  function mint(address _to, uint256 _amount) public {
    _mint(_to, _amount);
  }

  function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
    // Used to trigger a failed transfer
    if (recipient == address(0) || recipient == deployer) {
      return false;
    }

    _transfer(_msgSender(), recipient, amount);

    return true;
  }
}
