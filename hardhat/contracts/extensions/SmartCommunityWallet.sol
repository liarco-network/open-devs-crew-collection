// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "../external/IWETH9.sol";
import "./NftToken.sol";

abstract contract SmartCommunityWallet is NftToken {
  enum WithdrawalType {
    REGULAR,
    INACTIVE_FUNDS,
    STARTUP_FUNDS
  }

  uint256 public immutable DIAMOND_HANDS_HOLDER_TIME_FRAME;
  uint256 public immutable WHALE_ROLE_THRESHOLD;
  uint256 public immutable ADDRESS_INACTIVITY_TIME_FRAME;
  uint256 public immutable TRANSFER_COOLDOWN_AFTER_WITHDRAWAL;

  IWETH9 public immutable WETH_CONTRACT;

  address public immutable HASHLIPS_LAB_ADDRESS;
  uint256 public immutable HASHLIPS_LAB_STARTUP_SHARE;
  address public immutable MEP_ADDRESS;

  uint256 public communityBalance = 0;
  uint256 public startupFundsBalance = 0;
  uint256 public totalFundsRaisedByCommunity = 0;

  address public allowedAddressForCustomErc20TokensWithdrawal;

  bool public canUpdateAllowedAddressForCustomErc20TokensWithdrawal = true;

  mapping(uint256 => uint256) public tokenIdToWithdrawnAmount;

  event UntrackedFundsReceived(address indexed from, uint256 amount);
  event Deposit(address indexed from, uint256 amount);
  event Withdrawal(WithdrawalType indexed withrawalType, address indexed to, uint256 amount);
  event UpdatedAllowedAddressForCustomErc20TokensWithdrawal(address newAllowedAddress);

  error InsufficientFunds();
  error FailedWithdrawingFunds();
  error TokenOwnershipDoesNotMatch();
  error InvalidDiamondHandsHolderToken();
  error TransferringTooEarlyAfterWithdrawal();
  error InvalidTokenId();
  error OnlyWhalesCanWithdrawOnBehalfOfInactiveAddresses();
  error TokenIsOwnedByAnActiveAddress();
  error CustomErc20TokensWithdrawalDenied();
  error CannotWithdrawWethFundsDirectly();
  error AllowedAddressForCustomErc20TokensWithdrawalIsFrozen();

  constructor(
    uint256 _diamondHandsHolderTimeFrame,
    uint256 _whaleRoleThreshold,
    uint256 _transferCooldownAfterWithdrawal,
    uint256 _addressInactivityTimeFrame,
    address _wethContractAddress,
    uint256 _hashLipsLabStartupShare,
    address _hashLipsLabAddress,
    address _mepAddress
  ) {
    DIAMOND_HANDS_HOLDER_TIME_FRAME = _diamondHandsHolderTimeFrame;
    WHALE_ROLE_THRESHOLD = _whaleRoleThreshold;
    TRANSFER_COOLDOWN_AFTER_WITHDRAWAL = _transferCooldownAfterWithdrawal;
    ADDRESS_INACTIVITY_TIME_FRAME = _addressInactivityTimeFrame;

    WETH_CONTRACT = IWETH9(payable(_wethContractAddress));

    HASHLIPS_LAB_STARTUP_SHARE = _hashLipsLabStartupShare;
    HASHLIPS_LAB_ADDRESS = _hashLipsLabAddress;

    MEP_ADDRESS = _mepAddress;

    allowedAddressForCustomErc20TokensWithdrawal = address(0);
  }

  receive() external payable {
    /*
     * Newly received funds are treated as "untracked" until
     * refreshWalletBalance() is run.
     */

     emit UntrackedFundsReceived(msg.sender, msg.value);
  }

  function deposit() public payable {
    refreshWalletBalance();

    emit Deposit(msg.sender, msg.value);
  }

  function getUntrackedFunds() public view returns (uint256) {
    uint256 rawUntrackedFunds = address(this).balance - communityBalance - startupFundsBalance;

    return rawUntrackedFunds - (rawUntrackedFunds % MAX_SUPPLY);
  }

  function refreshWalletBalance() public {
    _unwrapEth();

    uint256 untrackedFunds = getUntrackedFunds();
    uint256 totalSupply = totalSupply();

    totalFundsRaisedByCommunity += untrackedFunds;

    if (MAX_SUPPLY == totalSupply) {
      communityBalance += untrackedFunds;

      return;
    }

    uint256 communityShare = (untrackedFunds / MAX_SUPPLY) * totalSupply;
    communityBalance += communityShare;
    startupFundsBalance += untrackedFunds - communityShare;
  }

  function getLatestWithdrawalTimestamp(address _owner) public view returns (uint64) {
    return _getAux(_owner);
  }

  function updateLatestWithdrawalTimestamp() public {
    _setAux(msg.sender, uint64(block.timestamp));
  }

  function getBalanceOfToken(uint256 _tokenId) public view returns (uint256) {
    if (!_exists(_tokenId)) {
      revert InvalidTokenId();
    }

    return _getBalanceOfToken(_tokenId);
  }

  function isDiamondHandsHolder(address _holder, uint256 _diamondHandsHolderTokenId) public view returns (bool) {
    TokenOwnership memory diamondHandsHolderTokenOwnership = _ownershipOf(_diamondHandsHolderTokenId);

    if (diamondHandsHolderTokenOwnership.addr != _holder) {
      revert TokenOwnershipDoesNotMatch();
    }

    if (diamondHandsHolderTokenOwnership.startTimestamp + DIAMOND_HANDS_HOLDER_TIME_FRAME > block.timestamp) {
      return false;
    }

    return true;
  }

  function isWhale(address _holder, uint256 _diamondHandsHolderTokenId) public view returns (bool) {
    return balanceOf(_holder) >= WHALE_ROLE_THRESHOLD && isDiamondHandsHolder(_holder, _diamondHandsHolderTokenId);
  }

  function withdraw(uint256 _diamondHandsHolderTokenId, uint256[] memory _tokenIds) public {
    uint256 withdrawableAmount = 0;

    if (!isDiamondHandsHolder(msg.sender, _diamondHandsHolderTokenId)) {
      revert InvalidDiamondHandsHolderToken();
    }

    updateLatestWithdrawalTimestamp();

    for (uint16 i = 0; i < _tokenIds.length; i++) {
      if (ownerOf(_tokenIds[i]) != msg.sender) {
        revert TokenOwnershipDoesNotMatch();
      }

      withdrawableAmount += _resetWithdrawableAmount(_tokenIds[i]);
    }

    communityBalance -= withdrawableAmount;

    (bool transferSuccess, ) = payable(msg.sender).call{value: withdrawableAmount}('');

    if (!transferSuccess) {
      revert FailedWithdrawingFunds();
    }

    emit Withdrawal(WithdrawalType.REGULAR, msg.sender, withdrawableAmount);
  }

  function withdrawInactiveFunds(uint256 _diamondHandsHolderTokenId, uint256[] memory _tokenIds) public {
    uint256 withdrawableAmount = 0;

    if (!isWhale(msg.sender, _diamondHandsHolderTokenId)) {
      revert OnlyWhalesCanWithdrawOnBehalfOfInactiveAddresses();
    }

    updateLatestWithdrawalTimestamp();

    for (uint16 i = 0; i < _tokenIds.length; i++) {
      /*
       * In order to avoid unauthorized withdrawals of new holders' funds we
       * have to make sure that both the latest withdrawal timestamp and the
       * ownership start timestamp are considered when verifying the latest
       * wallet activity.
       */
      uint64 latestWithdrawalTimestamp = getLatestWithdrawalTimestamp(ownerOf(_tokenIds[i]));
      uint64 ownershipStartTimestamp = _ownershipOf(_tokenIds[i]).startTimestamp;
      uint64 latestActivityTimestamp = latestWithdrawalTimestamp > ownershipStartTimestamp ? latestWithdrawalTimestamp : ownershipStartTimestamp;

      if (latestActivityTimestamp + ADDRESS_INACTIVITY_TIME_FRAME > block.timestamp) {
        revert TokenIsOwnedByAnActiveAddress();
      }

      withdrawableAmount += _resetWithdrawableAmount(_tokenIds[i]);
    }

    communityBalance -= withdrawableAmount;

    (bool transferSuccess, ) = payable(msg.sender).call{value: withdrawableAmount}('');

    if (!transferSuccess) {
      revert FailedWithdrawingFunds();
    }

    emit Withdrawal(WithdrawalType.INACTIVE_FUNDS, msg.sender, withdrawableAmount);
  }

  function withdrawStartupFunds(uint256 _amount) public onlyOwner {
    if (_amount > startupFundsBalance) {
      revert InsufficientFunds();
    }

    uint256 hashLipsLabAmount = _amount * HASHLIPS_LAB_STARTUP_SHARE / 100;
    uint256 mepAmount = _amount - hashLipsLabAmount;
    startupFundsBalance -= _amount;

    // HashLips Lab
    // =============================================================================
    (bool transferSuccess, ) = payable(HASHLIPS_LAB_ADDRESS).call{value: hashLipsLabAmount}('');

    if (!transferSuccess) {
      revert FailedWithdrawingFunds();
    }

    emit Withdrawal(WithdrawalType.STARTUP_FUNDS, HASHLIPS_LAB_ADDRESS, hashLipsLabAmount);
    // =============================================================================

    // MEP
    // =============================================================================
    (transferSuccess, ) = payable(MEP_ADDRESS).call{value: mepAmount}('');

    if (!transferSuccess) {
      revert FailedWithdrawingFunds();
    }

    emit Withdrawal(WithdrawalType.STARTUP_FUNDS, MEP_ADDRESS, mepAmount);
    // =============================================================================
  }

  function withdrawCustomErc20Funds(address[] memory _erc20TokenAddresses) public {
    if (msg.sender != allowedAddressForCustomErc20TokensWithdrawal) {
      revert CustomErc20TokensWithdrawalDenied();
    }

    for (uint8 i = 0; i < _erc20TokenAddresses.length; i++) {
      address erc20TokenAddress = _erc20TokenAddresses[i];

      if (address(WETH_CONTRACT) == erc20TokenAddress) {
        revert CannotWithdrawWethFundsDirectly();
      }

      IERC20 erc20Token = IERC20(erc20TokenAddress);

      if (!erc20Token.transfer(allowedAddressForCustomErc20TokensWithdrawal, erc20Token.balanceOf(address(this)))) {
        revert FailedWithdrawingFunds();
      }
    }
  }

  function updateAllowedAddressForCustomErc20TokensWithdrawal(address _newAllowedAddress) public onlyOwner {
    if (!canUpdateAllowedAddressForCustomErc20TokensWithdrawal) {
      revert AllowedAddressForCustomErc20TokensWithdrawalIsFrozen();
    }

    allowedAddressForCustomErc20TokensWithdrawal = _newAllowedAddress;

    emit UpdatedAllowedAddressForCustomErc20TokensWithdrawal(_newAllowedAddress);
  }

  function freezeAllowedAddressForCustomErc20TokensWithdrawal() public onlyOwner {
    canUpdateAllowedAddressForCustomErc20TokensWithdrawal = false;
  }

  function _getBalanceOfToken(uint256 _tokenId) internal view returns (uint256) {
    return (totalFundsRaisedByCommunity / MAX_SUPPLY) - tokenIdToWithdrawnAmount[_tokenId];
  }

  function _unwrapEth() private {
    uint256 wEthBalance = WETH_CONTRACT.balanceOf(address(this));

    if (wEthBalance != 0) {
      WETH_CONTRACT.withdraw(wEthBalance);
    }
  }

  function _resetWithdrawableAmount(uint256 _tokenId) internal returns (uint256) {
    uint256 withdrawableAmount = _getBalanceOfToken(_tokenId);

    tokenIdToWithdrawnAmount[_tokenId] += withdrawableAmount;

    return withdrawableAmount;
  }

  function _beforeTokenTransfers(
    address _from,
    address /* _to */,
    uint256 _startTokenId,
    uint256 _quantity
  ) internal override {
    if (_from == address(0)) {
      // Withdrawn funds of new tokens must be reset at mint
      refreshWalletBalance();

      for (uint256 i = _startTokenId; i <= _startTokenId + _quantity; i++) {
        _resetWithdrawableAmount(i);
      }

      return;
    }

    if (getLatestWithdrawalTimestamp(_from) + TRANSFER_COOLDOWN_AFTER_WITHDRAWAL > block.timestamp) {
      revert TransferringTooEarlyAfterWithdrawal();
    }
  }
}
