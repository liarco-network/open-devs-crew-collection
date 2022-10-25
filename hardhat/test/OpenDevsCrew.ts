import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { BigNumber, Signer } from 'ethers';
import { ethers, network } from 'hardhat';
import { OpenDevsCrew } from '../typechain-types';
const DEPLOYER_WALLET_ADDRESS = '0x5212df6F5C3B51077b8Be438CA9E8E17f8eDafB0';
const AIRDROP_OFFSET = 29;

const communityShareFunction = (untrackedFunds: BigNumber, maxSupply: BigNumber, totalSupply: BigNumber) => {
  return untrackedFunds.div(maxSupply).mul(totalSupply);
}

describe('OpenDevsCrew', function () {
  let deployerWallet!: Signer;
  let nonPayableContractOwner!: Signer;
  let minterOfPartiallyMintedCollection1!: Signer;
  let minterOfPartiallyMintedCollection2!: Signer;
  let minterOfFullyMintedCollection!: Signer;
  let wallet5!: Signer;
  let wallet6!: Signer;
  let wallet7!: Signer;
  let wallet8!: Signer;
  let wallet9!: Signer;
  let wallet10!: Signer;

  before(async () => {
    [
      nonPayableContractOwner,
      minterOfPartiallyMintedCollection1,
      minterOfPartiallyMintedCollection2,
      minterOfFullyMintedCollection,
      wallet5,
      wallet6,
      wallet7,
      wallet8,
      wallet9,
      wallet10,
    ] = await ethers.getSigners();

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [DEPLOYER_WALLET_ADDRESS],
    });

    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [
        DEPLOYER_WALLET_ADDRESS,
        ethers.utils.parseEther('10000').toHexString().replace(/0x0+/, '0x'),
      ],
    });

    deployerWallet = await ethers.provider.getSigner(DEPLOYER_WALLET_ADDRESS);
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixtures() {
    const wethFixture = await deployWethFixture();
    const erc20TokenMockFixture = await deployErc20TokenMockFixture();
    const collectionFixture = await deployCollectionFixture();

    return {
      ...await impersonateAccountsFixture(collectionFixture.openDevsCrew),
      ...wethFixture,
      ...erc20TokenMockFixture,
      ...collectionFixture,
      ...await deployNonPayableContracts(collectionFixture.openDevsCrew),
      ...await deployPartiallyMintedCollectionFixture(),
      ...await deployFullyMintedCollectionFixture(),
      ...await deployCollectionWithFundsFixture(),
    };
  }

  async function deployWethFixture() {
    const wethDeployerAddress = '0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876';
    const wethDeploymentTxNonce = 446;

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [wethDeployerAddress],
    });

    await network.provider.request({
      method: 'hardhat_setNonce',
      params: [
        wethDeployerAddress,
        BigNumber.from(wethDeploymentTxNonce).toHexString().replace(/0x0+/, '0x'),
      ],
    });

    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [
        wethDeployerAddress,
        ethers.utils.parseEther('10000').toHexString().replace(/0x0+/, '0x'),
      ],
    });

    const wethDeployer = await ethers.provider.getSigner(wethDeployerAddress);

    const WETH9 = await ethers.getContractFactory('WETH9');
    const weth = await WETH9.connect(wethDeployer).deploy({nonce: wethDeploymentTxNonce});

    return { weth, wethDeployer };
  }

  async function deployErc20TokenMockFixture() {
    let erc20DeployerAddress!: Signer;

    [erc20DeployerAddress] = await ethers.getSigners()

    const Erc20TokenMockFactory = await ethers.getContractFactory(
      'CustomErc20TokenMock',
      erc20DeployerAddress,
    );
    const erc20TokenMock = await Erc20TokenMockFactory.deploy();

    return {
      erc20TokenMock,
      erc20DeployerAddress,
    };
  }

  async function impersonateAccountsFixture(openDevsCrew: OpenDevsCrew) {
    const MEP_ADDRESS = await openDevsCrew.MEP_ADDRESS();
    const HASHLIPS_LAB_ADDRESS = await openDevsCrew.HASHLIPS_LAB_ADDRESS();

    // MEP
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [MEP_ADDRESS],
    });

    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [
        MEP_ADDRESS,
        ethers.utils.parseEther('10000').toHexString().replace(/0x0+/, '0x'),
      ],
    });

    const mepWallet = await ethers.provider.getSigner(MEP_ADDRESS);

    // HashLips Lab
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [HASHLIPS_LAB_ADDRESS],
    });

    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [
        HASHLIPS_LAB_ADDRESS,
        ethers.utils.parseEther('10000').toHexString().replace(/0x0+/, '0x'),
      ],
    });

    const hashLipsWallet = await ethers.provider.getSigner(HASHLIPS_LAB_ADDRESS);

    return { mepWallet, hashLipsWallet }
  }

  async function deployCollectionFixture() {
    const OpenDevsCrew = await ethers.getContractFactory('OpenDevsCrew', deployerWallet);
    const openDevsCrew = await OpenDevsCrew.deploy();

    return { openDevsCrew };
  }

  async function deployNonPayableContracts(openDevsCrew: OpenDevsCrew) {
    const NonPayableContractWalletMock = await ethers.getContractFactory(
      'NonPayableContractWalletMock',
      nonPayableContractOwner,
    );
    const nonPayableContractWalletMock = await NonPayableContractWalletMock.deploy(openDevsCrew.address);

    const NotPayableContractMock = await ethers.getContractFactory('NonPayableContractMock', nonPayableContractOwner);
    const nonPayableContractMock = await NotPayableContractMock.deploy();

    const OpenDevsCrewBrokenHashLipsWalletsMock = await ethers.getContractFactory(
      'OpenDevsCrewBrokenHashLipsWalletsMock',
      deployerWallet,
    );
    const openDevsCrewBrokenHashLipsWalletsMock = await OpenDevsCrewBrokenHashLipsWalletsMock.deploy(
      nonPayableContractMock.address,
    );

    const OpenDevsCrewMepWalletMock = await ethers.getContractFactory('OpenDevsCrewMepWalletMock', deployerWallet);
    const openDevsCrewMepWalletMock = await OpenDevsCrewMepWalletMock.deploy(nonPayableContractMock.address);

    return {
      nonPayableContractWalletMock,
      openDevsCrewBrokenHashLipsWalletsMock,
      openDevsCrewMepWalletMock,
    };
  }

  async function deployPartiallyMintedCollectionFixture() {
    const OpenDevsCrew = await ethers.getContractFactory('OpenDevsCrew', deployerWallet);
    const partiallyMintedCollection = await OpenDevsCrew.deploy();

    await partiallyMintedCollection.connect(minterOfPartiallyMintedCollection1).mint(
      5,
      { value: ethers.utils.parseEther('0.1').mul(5) },
    );

    await partiallyMintedCollection.connect(minterOfPartiallyMintedCollection2).mint(
      5,
      { value: ethers.utils.parseEther('0.1').mul(5) },
    );

    return { partiallyMintedCollection };
  }

  async function deployFullyMintedCollectionFixture() {
    const OpenDevsCrew = await ethers.getContractFactory('OpenDevsCrew', deployerWallet);
    const fullyMintedCollection = await OpenDevsCrew.deploy();
    let minted = AIRDROP_OFFSET;

    while (minted < 1990) {
      const nextMint = Math.min(10, 1990 - minted);

      await fullyMintedCollection.connect(minterOfFullyMintedCollection).mint(
        nextMint,
        { value: ethers.utils.parseEther('0.1').mul(nextMint) },
      );

      minted += nextMint;
    }

    return { fullyMintedCollection };
  }

  async function deployCollectionWithFundsFixture() {
    const OpenDevsCrew = await ethers.getContractFactory('OpenDevsCrew', deployerWallet);
    const collectionWithFunds = await OpenDevsCrew.deploy();

    await deployerWallet.sendTransaction({
      from: deployerWallet.getAddress(),
      to: collectionWithFunds.address,
      value: ethers.utils.parseEther('199'),
    });

    await collectionWithFunds.refreshWalletBalance();

    return { collectionWithFunds };
  }

  describe('Deployment', function () {
    it('Verify ownership', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      expect(await openDevsCrew.owner()).to.equal(await deployerWallet.getAddress());
    });
  });

  describe('SmartCommunityWallet', function () {
    it('Refresh wallet balance (empty)', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      expect(await openDevsCrew.communityBalance()).to.be.equal(BigNumber.from(0));
      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(BigNumber.from(0));
      await openDevsCrew.refreshWalletBalance();

      expect(await openDevsCrew.communityBalance()).to.be.equal(BigNumber.from(0));
      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(BigNumber.from(0));
    });

    it('Refresh wallet (sold-out)', async function () {
      const { fullyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const ownerContract = openDevsCrew.connect(deployerWallet);

      const mintFundsBalance = await openDevsCrew.mintFundsBalance()
      await ownerContract.withdrawMintFunds(mintFundsBalance);

      await deployerWallet.sendTransaction({
        from: deployerWallet.getAddress(),
        to: openDevsCrew.address,
        value: ethers.utils.parseEther('100'),
      });

      const finalUntrackedFunds = await openDevsCrew.getUntrackedFunds();
      const initialCommunityBalance = await openDevsCrew.communityBalance();

      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(BigNumber.from(0));

      await openDevsCrew.refreshWalletBalance();

      expect(await openDevsCrew.communityBalance()).to.be.equal(initialCommunityBalance.add(finalUntrackedFunds));
      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(BigNumber.from(0));
    });

    it('Check events emission (receiving funds)', async function () {
      const { mepWallet, hashLipsWallet, partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const genericWallet = wallet5;

      // Fallback function
      await expect(deployerWallet.sendTransaction({
        from: deployerWallet.getAddress(),
        to: openDevsCrew.address,
        value: ethers.utils.parseEther('10'),
      })).to.emit(openDevsCrew, 'UntrackedFundsReceived').withArgs(
        await deployerWallet.getAddress(),
        ethers.utils.parseEther('10'),
      );

      // Donation
      await expect(openDevsCrew.connect(genericWallet).donate({
        value: ethers.utils.parseEther('3'),
      })).to.emit(openDevsCrew, 'Donation').withArgs(
        await genericWallet.getAddress(),
        ethers.utils.parseEther('3'),
      );
    });

    it('Check untracked funds distribution on empty collection', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const MAX_SUPPLY = await openDevsCrew.MAX_SUPPLY();
      const totalSupply = await openDevsCrew.totalSupply();

      await deployerWallet.sendTransaction({
        from: deployerWallet.getAddress(),
        to: openDevsCrew.address,
        value: ethers.utils.parseEther('10'),
      });

      const initialUntrackedFunds = await openDevsCrew.getUntrackedFunds();

      const expectedValue = ethers.utils.parseEther('10').sub(ethers.utils.parseEther('10').mod(BigNumber.from(1990)));

      expect(initialUntrackedFunds).to.be.equal(expectedValue);
      expect(await openDevsCrew.communityBalance()).to.be.equal(BigNumber.from(0));
      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(BigNumber.from(0));

      await openDevsCrew.refreshWalletBalance();

      const expectedCommunityBalance = communityShareFunction(initialUntrackedFunds, MAX_SUPPLY, totalSupply);

      expect(await openDevsCrew.getUntrackedFunds()).to.be.equal(BigNumber.from(0));
      expect(await openDevsCrew.communityBalance()).to.be.equal(expectedCommunityBalance);
      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(initialUntrackedFunds.sub(expectedCommunityBalance));
    });

    it('Check funds distribution during mint', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);
      const minter1 = wallet5;
      const minter2 = wallet6;

      await openDevsCrew.connect(minter1).mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      await deployerWallet.sendTransaction({
        from: deployerWallet.getAddress(),
        to: openDevsCrew.address,
        value: ethers.utils.parseEther('10'),
      });

      await openDevsCrew.connect(minter2).mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      const tokensOfMinter1 = await openDevsCrew.tokensOfOwner(minter1.getAddress());
      const tokensOfMinter2 = await openDevsCrew.tokensOfOwner(minter2.getAddress());

      expect(tokensOfMinter1.length).eq(5);
      expect(tokensOfMinter2.length).eq(5);

      expect(await Promise.all(tokensOfMinter1.map(async tokenId => await openDevsCrew.getBalanceOfToken(tokenId))))
        .deep.eq(new Array(tokensOfMinter1.length).fill(
          ethers.utils.parseEther('10').add(ethers.utils.parseEther('0.1').mul(5)).div(1990),
        ));
      expect(await Promise.all(tokensOfMinter2.map(async tokenId => await openDevsCrew.getBalanceOfToken(tokenId))))
        .deep.eq(new Array(tokensOfMinter2.length).fill(BigNumber.from(0)));

      await openDevsCrew.connect(minter1).mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      expect(await Promise.all(tokensOfMinter1.map(async tokenId => await openDevsCrew.getBalanceOfToken(tokenId))))
        .deep.eq(new Array(tokensOfMinter1.length).fill(
          ethers.utils.parseEther('10').add(ethers.utils.parseEther('0.1').mul(10))
          // We have to add the reminder of divison from the previous mint
          .add(ethers.utils.parseEther('10').add(ethers.utils.parseEther('0.1').mul(10)).mod(1990))
          .div(1990),
        ));
      expect(await Promise.all(tokensOfMinter2.map(async tokenId => await openDevsCrew.getBalanceOfToken(tokenId))))
        .deep.eq(new Array(tokensOfMinter2.length).fill(
          ethers.utils.parseEther('0.1').mul(5)
          // We have to add the reminder of divison from the previous mint
          .add(ethers.utils.parseEther('10').add(ethers.utils.parseEther('0.1').mul(10)).mod(1990))
          .div(1990)
        ));
    });

    // getBalanceOfToken()

    it('Check balance of not minted token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      await expect(openDevsCrew.getBalanceOfToken(50)).to.be.revertedWithCustomError(openDevsCrew, 'InvalidTokenId');
    });

    it('Check balance of not existing token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      await expect(openDevsCrew.getBalanceOfToken(3000)).to.be.revertedWithCustomError(openDevsCrew, 'InvalidTokenId');
    });

    // withdrawMintFunds()

    it('Check startup funds withdraw', async function () {
      const { collectionWithFunds: openDevsCrew, mepWallet, hashLipsWallet } = await loadFixture(fixtures);

      const withdrawAmount = ethers.utils.parseEther('10');
      const initialStartupBalance = await openDevsCrew.mintFundsBalance();
      const mepAddress = mepWallet.getAddress();
      const hashLipsAddress = hashLipsWallet.getAddress();

      let previousMepBalance = await ethers.provider.getBalance(mepAddress);
      let previousHashLipsBalance = await ethers.provider.getBalance(hashLipsAddress);
      let hashLipsLabShare = withdrawAmount.mul(await openDevsCrew.HASHLIPS_LAB_MINT_SHARE()).div(100);

      await openDevsCrew.withdrawMintFunds(withdrawAmount);

      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(initialStartupBalance.sub(withdrawAmount));
      expect(await ethers.provider.getBalance(mepAddress)).eq(
        previousMepBalance
          .add(withdrawAmount.sub(hashLipsLabShare))
      );
      expect(await ethers.provider.getBalance(hashLipsAddress)).eq(
        previousHashLipsBalance
          .add(hashLipsLabShare)
      );

      previousMepBalance = await ethers.provider.getBalance(mepAddress);
      previousHashLipsBalance = await ethers.provider.getBalance(hashLipsAddress);
      hashLipsLabShare = withdrawAmount.mul(await openDevsCrew.HASHLIPS_LAB_MINT_SHARE()).div(100);

      await openDevsCrew.withdrawMintFunds(withdrawAmount);
      await openDevsCrew.withdrawMintFunds(withdrawAmount);

      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(initialStartupBalance.sub(withdrawAmount.mul(3)));
      expect(await ethers.provider.getBalance(mepAddress)).eq(
        previousMepBalance
          .add(withdrawAmount.sub(hashLipsLabShare))
          .add(withdrawAmount.sub(hashLipsLabShare))
      );
      expect(await ethers.provider.getBalance(hashLipsAddress)).eq(
        previousHashLipsBalance
          .add(hashLipsLabShare)
          .add(hashLipsLabShare)
      );

      previousMepBalance = await ethers.provider.getBalance(mepAddress);
      previousHashLipsBalance = await ethers.provider.getBalance(hashLipsAddress);

      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(initialStartupBalance.sub(withdrawAmount.mul(3)));
      expect(await ethers.provider.getBalance(mepAddress)).eq(previousMepBalance);
      expect(await ethers.provider.getBalance(hashLipsAddress)).eq(previousHashLipsBalance);
    });

    it('Check startup funds full withdraw', async function () {
      const { collectionWithFunds: openDevsCrew } = await loadFixture(fixtures);

      const initialStartupBalance = await openDevsCrew.mintFundsBalance();
      await openDevsCrew.withdrawMintFunds(initialStartupBalance);

      expect(await openDevsCrew.mintFundsBalance()).to.be.equal(0);
    });

    it('Check startup funds withdraw over limit', async function () {
      const { collectionWithFunds: openDevsCrew } = await loadFixture(fixtures);

      const initialStartupBalance = await openDevsCrew.mintFundsBalance();

      await expect(openDevsCrew.withdrawMintFunds(initialStartupBalance.add('1'))).to.be.revertedWithCustomError(
        openDevsCrew,
        'InsufficientFunds',
      );
    });

    it('Check events emission (startup funds)', async function () {
      const { mepWallet, hashLipsWallet, partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const withdrawAmount = await openDevsCrew.mintFundsBalance();
      const mepAddress = await mepWallet.getAddress();
      const hashLipsAddress = await hashLipsWallet.getAddress();

      // Make sure some funds are available
      expect(withdrawAmount).gt(BigNumber.from(0));

      let hashLipsLabShare = withdrawAmount.mul(await openDevsCrew.HASHLIPS_LAB_MINT_SHARE()).div(100);

      await expect(openDevsCrew.withdrawMintFunds(withdrawAmount))
        .to.emit(openDevsCrew, 'Withdrawal').withArgs(
          BigNumber.from(2),
          mepAddress,
          withdrawAmount.sub(hashLipsLabShare),
        ).and.to.emit(openDevsCrew, 'Withdrawal').withArgs(
          BigNumber.from(2),
          hashLipsAddress,
          hashLipsLabShare,
        );
    });

    // withdraw()

    it('Check withdraw of hodled minted token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      const previousWalletBalance = await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress());
      const previousToken1Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[0]);
      const previousToken2Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[1]);
      const txReceipt = await (await openDevsCrew.connect(minterOfPartiallyMintedCollection1).withdraw(
        partialMintedTokens[0],
        [partialMintedTokens[0], partialMintedTokens[1]],
      )).wait();

      expect(await openDevsCrew.getBalanceOfToken(partialMintedTokens[0])).eq(BigNumber.from('0'));
      expect(await openDevsCrew.getBalanceOfToken(partialMintedTokens[1])).eq(BigNumber.from('0'));
      expect(await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress())).eq(
        previousWalletBalance
          .add(previousToken1Balance)
          .add(previousToken2Balance)
          .sub(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))
      );
    });

    it('Check withdraw of 0 tokens', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      const previousWalletBalance = await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress());
      const previousToken1Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[0]);
      const txReceipt = await (await openDevsCrew.connect(minterOfPartiallyMintedCollection1)
        .withdraw(partialMintedTokens[0], [])).wait();

      expect(await openDevsCrew.getBalanceOfToken(partialMintedTokens[0])).eq(previousToken1Balance);
      expect(await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress())).eq(
        previousWalletBalance
          .sub(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))
      );
    });

    it('Check withdrawing the same token multiple times', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());
      const minterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection1);

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      const previousWalletBalance = await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress());
      const previousToken1Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[0]);
      const txReceipt = await (await minterContract.withdraw(
        partialMintedTokens[0],
        [
          partialMintedTokens[0],
          partialMintedTokens[0],
          partialMintedTokens[0],
          partialMintedTokens[0],
          partialMintedTokens[0],
        ],
      )).wait();

      expect(previousToken1Balance.toNumber()).gt(0);
      expect(await openDevsCrew.getBalanceOfToken(partialMintedTokens[0])).eq(0);
      expect(await ethers.provider.getBalance(minterOfPartiallyMintedCollection1.getAddress())).eq(
        previousWalletBalance
          .add(previousToken1Balance)
          .sub(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))
      );
    });

    it('Check withdraw of minted token not holded for long enough', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).sub(60 * 60 * 24));

      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1)
        .withdraw(partialMintedTokens[0], [partialMintedTokens[0], partialMintedTokens[1]]))
        .to.be.revertedWithCustomError(openDevsCrew, 'InvalidDiamondHandsHolderToken');
    });

    it('Check withdraw of not minted token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1).withdraw(partialMintedTokens[0], [1000, 1001]))
        .to.be.revertedWithCustomError(openDevsCrew, 'OwnerQueryForNonexistentToken');
    });

    it('Check withdraw of unordered token list', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1)
        .withdraw(partialMintedTokens[0], [partialMintedTokens[3], partialMintedTokens[2], partialMintedTokens[1]]))
        .to.be.fulfilled;
    });

    it('Check withdraw of not owned token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const mintedTokenOne = AIRDROP_OFFSET + 1;

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1).withdraw(mintedTokenOne, [10]))
        .to.be.revertedWithCustomError(openDevsCrew, 'TokenOwnershipDoesNotMatch');
    });

    it('Check withdraw of not owned hodled token', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1).withdraw(10, [1, 2]))
        .to.be.revertedWithCustomError(openDevsCrew, 'TokenOwnershipDoesNotMatch');
    });

    it('Check withdraw for not existing hodler', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const nonHolder = wallet5;

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await expect(openDevsCrew.connect(nonHolder).withdraw(1, [1]))
        .to.be.revertedWithCustomError(openDevsCrew, 'TokenOwnershipDoesNotMatch');
    });

    it('Check events emission (regular)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection1.getAddress());
      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));
      const previousToken1Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[0]);
      const previousToken2Balance = await openDevsCrew.getBalanceOfToken(partialMintedTokens[1]);
      await expect(openDevsCrew.connect(minterOfPartiallyMintedCollection1).withdraw(
        partialMintedTokens[0],
        [partialMintedTokens[0], partialMintedTokens[1]],
      )).to.emit(openDevsCrew, 'Withdrawal').withArgs(
        BigNumber.from(0),
        await minterOfPartiallyMintedCollection1.getAddress(),
        previousToken1Balance.add(previousToken2Balance),
      );
    });

    // withdrawInactiveFunds()

    it('Check withdrawal of inactive funds', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[1], partialMintedTokens[0]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      const ownerBalance = await whaleWallet.getBalance();
      const tokenBalance = await partialMinterContract.getBalanceOfToken(partialMintedTokens[0]);
      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      const txReceipt = await (await whaleContract.withdrawInactiveFunds(whaleTokens[0], [partialMintedTokens[0]])).wait();

      expect(await whaleWallet.getBalance()).to.be.equal(
        ownerBalance
          .add(tokenBalance)
          .sub(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)));
    });

    it('Check withdrawal of inactive funds (multiple tokens)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);
      const partialMintedTokens = (await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection2.getAddress()))
        .concat(await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection1.getAddress()));

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[1], partialMintedTokens[0]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      const ownerBalance = await whaleWallet.getBalance();
      let tokenBalance = BigNumber.from(0);

      for (const tokenId of partialMintedTokens) {
        tokenBalance = tokenBalance.add(await partialMinterContract.getBalanceOfToken(tokenId));
      }

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      const txReceipt = await (await whaleContract.withdrawInactiveFunds(
        whaleTokens[0],
        partialMintedTokens.map(tokenId => tokenId),
      )).wait();

      expect(await whaleWallet.getBalance()).to.be.equal(
        ownerBalance
          .add(tokenBalance)
          .sub(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)),
      );
    });

    it('Check withdrawal of inactive funds (not whale)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber() - 1; i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[1], partialMintedTokens[0]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], [partialMintedTokens[0]]))
        .to.be.revertedWithCustomError(
          whaleContract,
          'OnlyWhalesCanWithdrawOnBehalfOfInactiveAddresses',
        );
    });

    it('Check withdrawal of inactive funds (not diamond hands holder)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[1], partialMintedTokens[0]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], [partialMintedTokens[0]]))
        .to.be.revertedWithCustomError(
          whaleContract,
          'OnlyWhalesCanWithdrawOnBehalfOfInactiveAddresses',
        );
    });

    it('Check withdrawal of inactive funds (not inactive)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[0], partialMintedTokens[1]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).sub(60 * 60 * 24));

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], [partialMintedTokens[0]]))
        .to.be.revertedWithCustomError(
          whaleContract,
          'TokenIsOwnedByAnActiveAddress',
        );
    });

    it('Check withdrawal of inactive funds (never withdrawn)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      for (const tokenId of partialMintedTokens) {
        expect((await openDevsCrew.getLatestWithdrawalTimestamp(await openDevsCrew.ownerOf(tokenId))).toNumber()).equals(0);
      }

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).div(2));

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], partialMintedTokens.map(tokenId => tokenId)))
        .to.be.revertedWithCustomError(whaleContract, 'TokenIsOwnedByAnActiveAddress');
    });

    it('Check withdrawal of inactive funds (brand new holder)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const newHolderWallet = wallet6;
      const newHolderContract = openDevsCrew.connect(newHolderWallet);
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection2.getAddress());
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);

      await newHolderContract.refreshLatestWithdrawalTimestamp();

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      for (const tokenId of partialMintedTokens) {
        (await partialMinterContract.transferFrom(
          minterOfPartiallyMintedCollection2.getAddress(),
          newHolderWallet.getAddress(),
          tokenId,
        )).wait();

        expect(await openDevsCrew.ownerOf(tokenId)).equals(await newHolderWallet.getAddress());
      }

      expect((await openDevsCrew.getLatestWithdrawalTimestamp(newHolderWallet.getAddress())).toNumber()).not.equals(0);

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], partialMintedTokens.map(tokenId => tokenId)))
        .to.be.revertedWithCustomError(whaleContract, 'TokenIsOwnedByAnActiveAddress');
    });

    it('Check events emission (inactive funds)', async function () {
      const { partiallyMintedCollection: openDevsCrew } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();
      const whaleWallet = wallet5;
      const whaleContract = openDevsCrew.connect(whaleWallet);
      const partialMinterContract = openDevsCrew.connect(minterOfPartiallyMintedCollection2);
      const partialMintedTokens = (await openDevsCrew.tokensOfOwner(await minterOfPartiallyMintedCollection2.getAddress()))
        .concat(await openDevsCrew.tokensOfOwner(minterOfPartiallyMintedCollection1.getAddress()));

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await whaleContract.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await partialMinterContract.withdraw(partialMintedTokens[0], [partialMintedTokens[1], partialMintedTokens[0]]);

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      const ownerBalance = await whaleWallet.getBalance();
      let tokenBalance = BigNumber.from(0);

      for (const tokenId of partialMintedTokens) {
        tokenBalance = tokenBalance.add(await partialMinterContract.getBalanceOfToken(tokenId));
      }

      const whaleTokens = await openDevsCrew.tokensOfOwner(whaleWallet.getAddress());

      await expect(whaleContract.withdrawInactiveFunds(whaleTokens[0], partialMintedTokens.map(tokenId => tokenId)))
        .to.emit(openDevsCrew, 'Withdrawal').withArgs(
          BigNumber.from(1),
          await whaleWallet.getAddress(),
          tokenBalance,
        );
    });

    // Non payable wallets

    it('Check startup non payable wallet withdraw', async function () {
      const {
        openDevsCrewBrokenHashLipsWalletsMock,
        openDevsCrewMepWalletMock,
      } = await loadFixture(fixtures);

      await openDevsCrewBrokenHashLipsWalletsMock.donate({
        value: ethers.utils.parseEther('20')}
      );
      await openDevsCrewMepWalletMock.donate({
        value: ethers.utils.parseEther('20')}
      );

      await openDevsCrewBrokenHashLipsWalletsMock.refreshWalletBalance();

      await expect(openDevsCrewBrokenHashLipsWalletsMock.withdrawMintFunds(1)).to.be.revertedWithCustomError(
        openDevsCrewBrokenHashLipsWalletsMock,
        'FailedWithdrawingFunds',
      );
      await expect(openDevsCrewMepWalletMock.withdrawMintFunds(1)).to.be.revertedWithCustomError(
        openDevsCrewMepWalletMock,
        'FailedWithdrawingFunds',
      );
    });

    it('Check withdraw with non payable wallet', async function () {
      const { openDevsCrew, nonPayableContractWalletMock } = await loadFixture(fixtures);

      await nonPayableContractWalletMock.mint(5, {value: ethers.utils.parseEther('0.1').mul(5)});

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(nonPayableContractWalletMock.address);

      await expect(nonPayableContractWalletMock.withdraw(partialMintedTokens[0], [partialMintedTokens[0]]))
        .to.be.revertedWithCustomError(openDevsCrew, 'FailedWithdrawingFunds');
    });

    it('Check withdraw inactive funds with non payable wallet', async function () {
      const { openDevsCrew, nonPayableContractWalletMock } = await loadFixture(fixtures);
      const whaleThreshold = await openDevsCrew.WHALE_ROLE_THRESHOLD();

      const genericWallet = wallet6;
      const genericWalletContract = await openDevsCrew.connect(genericWallet);

      await genericWalletContract.mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await genericWallet.getAddress());

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      for (let i = 0; i < whaleThreshold.toNumber(); i++) {
        await nonPayableContractWalletMock.mint(1, { value: ethers.utils.parseEther('0.1') })
      }

      await time.increase((await openDevsCrew.ADDRESS_INACTIVITY_TIME_FRAME()).add(1));

      const nonPayableContractWalletMockTokens = await openDevsCrew.tokensOfOwner(nonPayableContractWalletMock.address);

      await expect(nonPayableContractWalletMock.withdrawInactiveFunds(
          nonPayableContractWalletMockTokens[0],
          [partialMintedTokens[1]],
        )).to.be.revertedWithCustomError(openDevsCrew, 'FailedWithdrawingFunds');
    });

    // _beforeTokenTransfers()

    it('Check transfer right after withdraw', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);
      const genericWallet = wallet5;
      const genericReceiver = wallet6;

      const genericWalletContract = openDevsCrew.connect(genericWallet);

      await genericWalletContract.mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));

      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await genericWallet.getAddress());

      await genericWalletContract.withdraw(
        partialMintedTokens[0],
        [
          partialMintedTokens[0],
          partialMintedTokens[1],
          partialMintedTokens[2],
          partialMintedTokens[3],
          partialMintedTokens[4],
        ],
      );

      await expect(genericWalletContract.transferFrom(
        genericWallet.getAddress(),
        genericReceiver.getAddress(),
        partialMintedTokens[0]),
      ).to.be.revertedWithCustomError(genericWalletContract, 'TransferringTooEarlyAfterWithdrawal');
    });

    it('Check transfer after cooldown', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);
      const genericWallet = wallet5;
      const genericReceiver = wallet6;
      const transferCooldown = await openDevsCrew.TRANSFER_COOLDOWN_AFTER_WITHDRAWAL();

      const genericWalletContract = openDevsCrew.connect(genericWallet);

      await genericWalletContract.mint(5, { value: ethers.utils.parseEther('0.1').mul(5) });

      await time.increase((await openDevsCrew.DIAMOND_HANDS_HOLDER_TIME_FRAME()).add(1));
      const partialMintedTokens = await openDevsCrew.tokensOfOwner(await genericWallet.getAddress());

      await genericWalletContract.withdraw(
        partialMintedTokens[0],
        [
          partialMintedTokens[0],
          partialMintedTokens[1],
          partialMintedTokens[2],
          partialMintedTokens[3],
          partialMintedTokens[4],
        ],
      );

      await time.increase(transferCooldown.add(1));

      expect(await genericWalletContract.transferFrom(
        genericWallet.getAddress(),
        genericReceiver.getAddress(),
        partialMintedTokens[0],
      )).to.not.be.reverted;
    });

    // WETH

    it('Check WETH transfer', async function () {
      const { openDevsCrew, weth } = await loadFixture(fixtures);

      const genericWallet = wallet6;
      const genericWethContract = await weth.connect(genericWallet);
      const ethToWethValue = ethers.utils.parseEther('10');

      expect(await weth.balanceOf(await genericWallet.getAddress())).to.be.equal(ethers.utils.parseEther('0'));

      await genericWethContract.deposit({ value: ethToWethValue });

      expect(await weth.balanceOf(await genericWallet.getAddress())).to.be.equal(ethToWethValue);

      await genericWethContract.transfer(openDevsCrew.address, ethToWethValue);

      await openDevsCrew.refreshWalletBalance();

      expect(await weth.balanceOf(await genericWallet.getAddress())).to.be.equal(ethers.utils.parseEther('0'));
    });

    it('Check WETH distribution', async function () {
      const { openDevsCrew, weth } = await loadFixture(fixtures);

      const genericWallet = wallet6;
      const genericWethContract = await weth.connect(genericWallet);
      const ethToWethValue = ethers.utils.parseEther('10');
      const MAX_SUPPLY = await openDevsCrew.MAX_SUPPLY();
      const totalSupply = await openDevsCrew.totalSupply();

      await genericWethContract.deposit({ value: ethToWethValue });

      await genericWethContract.transfer(openDevsCrew.address, ethToWethValue);
      await openDevsCrew.refreshWalletBalance();

      const initialCommunityBalance = await openDevsCrew.communityBalance();
      const initialStartupBalance = await openDevsCrew.mintFundsBalance();

      const initialUntrackedFunds = await openDevsCrew.getUntrackedFunds();
      const expectedCommunityBalance = communityShareFunction(initialUntrackedFunds, MAX_SUPPLY, totalSupply);

      expect(await openDevsCrew.communityBalance()).to.be.equal(expectedCommunityBalance.add(initialCommunityBalance));

      expect(await openDevsCrew.mintFundsBalance())
        .to.be.equal(expectedCommunityBalance.sub(initialUntrackedFunds).add(initialStartupBalance));
    });

    // Custom ERC20

    it('Check ERC20 withdraw', async function () {
      const { openDevsCrew,  erc20TokenMock } = await loadFixture(fixtures);
      const genericWallet = wallet6;
      const secondaryWallet = wallet7;
      const secondaryWalletAddress = await secondaryWallet.getAddress();

      const erc20TokensNumber = BigNumber.from(5);

      const genericErc20Contract = await erc20TokenMock.connect(genericWallet);

      expect(await genericErc20Contract.balanceOf(openDevsCrew.address)).to.be.equal(BigNumber.from(0));

      await genericErc20Contract.mint(openDevsCrew.address, erc20TokensNumber);

      expect(await genericErc20Contract.balanceOf(openDevsCrew.address)).to.be.equal(erc20TokensNumber);

      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(secondaryWalletAddress);

      const secondaryOpenDevsContract = await openDevsCrew.connect(secondaryWallet);

      await secondaryOpenDevsContract.withdrawCustomErc20Funds(
        [erc20TokenMock.address]
      );

      expect(await genericErc20Contract.balanceOf(openDevsCrew.address)).to.be.equal(BigNumber.from(0));
      expect(await genericErc20Contract.balanceOf(secondaryWalletAddress)).to.be.equal(erc20TokensNumber);
    });

    it('Check ERC20 withdraw not allowed', async function () {
      const { openDevsCrew,  erc20TokenMock } = await loadFixture(fixtures);
      const genericWallet = wallet6;

      const genericOpenDevsContract = await openDevsCrew.connect(genericWallet);

      await expect(genericOpenDevsContract.withdrawCustomErc20Funds(
        [erc20TokenMock.address]
      )).to.be.revertedWithCustomError(openDevsCrew, 'CustomErc20TokensWithdrawalDenied');
    });

    it('Check ERC20 empty withdraw', async function () {
      const { openDevsCrew, erc20TokenMock } = await loadFixture(fixtures);
      const genericWallet = wallet6;
      const secondaryWallet = wallet7;
      const secondaryWalletAddress = await secondaryWallet.getAddress();

      const erc20TokensNumber = BigNumber.from(5);

      const genericErc20Contract = await erc20TokenMock.connect(genericWallet);

      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(secondaryWalletAddress);

      const secondaryOpenDevsContract = await openDevsCrew.connect(secondaryWallet);

      await genericErc20Contract.mint(openDevsCrew.address, erc20TokensNumber);

      expect(await secondaryOpenDevsContract.withdrawCustomErc20Funds(
        []
      )).to.not.throw;
    });

    it('Check ERC20 WETH withdraw', async function () {
      const { openDevsCrew, weth } = await loadFixture(fixtures);
      const genericWallet = wallet6;
      const genericWalletAddress = await genericWallet.getAddress();

      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(genericWalletAddress);

      const genericOpenDevsContract = await openDevsCrew.connect(genericWallet);

      await expect(genericOpenDevsContract.withdrawCustomErc20Funds(
        [weth.address]
      )).to.be.revertedWithCustomError(openDevsCrew, 'CannotWithdrawWethFundsDirectly');
    });

    it('Check ERC20 and WETH withdraw', async function () {
      const { openDevsCrew, weth, erc20TokenMock } = await loadFixture(fixtures);
      const genericWallet = wallet6;
      const genericWalletAddress = await genericWallet.getAddress();

      const genericErc20Contract = await erc20TokenMock.connect(genericWallet);

      await genericErc20Contract.mint(openDevsCrew.address, 5);

      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(genericWalletAddress);

      const genericOpenDevsContract = await openDevsCrew.connect(genericWallet);

      await expect(genericOpenDevsContract.withdrawCustomErc20Funds(
        [erc20TokenMock.address, weth.address]
      )).to.be.revertedWithCustomError(openDevsCrew, 'CannotWithdrawWethFundsDirectly');
    });

    it('Check ERC20 invalid withdraw', async function () {
      const { openDevsCrew, erc20TokenMock, erc20DeployerAddress } = await loadFixture(fixtures);

      const erc20DeployerWallet = await erc20DeployerAddress.getAddress();

      const erc20DeployerOpenDevsContract = await openDevsCrew.connect(erc20DeployerAddress);
      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(erc20DeployerWallet);

      await expect(erc20DeployerOpenDevsContract.withdrawCustomErc20Funds(
        [erc20TokenMock.address],
      )).to.be.revertedWithCustomError(openDevsCrew, 'FailedWithdrawingFunds');
    });

    it('Check ERC20 freeze allowed withdraw', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);
      const genericWallet = wallet6;

      expect(await openDevsCrew.canUpdateAllowedAddressForCustomErc20TokensWithdrawal()).to.be.true;

      await openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(await genericWallet.getAddress());

      await openDevsCrew.freezeAllowedAddressForCustomErc20TokensWithdrawal();

      expect(await openDevsCrew.canUpdateAllowedAddressForCustomErc20TokensWithdrawal()).to.be.false;

      await expect(
        openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(openDevsCrew.address)
      ).to.be.revertedWithCustomError(openDevsCrew, 'AllowedAddressForCustomErc20TokensWithdrawalIsFrozen');
    });

    it('Check events emission (custom ERC20 tokens)', async function () {
      const { openDevsCrew,  erc20TokenMock } = await loadFixture(fixtures);
      const genericWallet = wallet6;
      const secondaryWallet = wallet7;
      const secondaryWalletAddress = await secondaryWallet.getAddress();

      const erc20TokensNumber = BigNumber.from(5);

      const genericErc20Contract = await erc20TokenMock.connect(genericWallet);

      await genericErc20Contract.mint(openDevsCrew.address, erc20TokensNumber);

      await expect(openDevsCrew.updateAllowedAddressForCustomErc20TokensWithdrawal(secondaryWalletAddress))
        .to.emit(openDevsCrew, 'UpdatedAllowedAddressForCustomErc20TokensWithdrawal').withArgs(
          secondaryWalletAddress,
        );

      const secondaryOpenDevsContract = await openDevsCrew.connect(secondaryWallet);

      await expect(secondaryOpenDevsContract.withdrawCustomErc20Funds([erc20TokenMock.address]))
        .to.emit(openDevsCrew, 'CustomErc20Withdrawal').withArgs(
          erc20TokenMock.address,
          await secondaryWallet.getAddress(),
          erc20TokensNumber,
        );
    });

    // TokenData

    it('Check TokenData queries', async function () {
      const { partiallyMintedCollection, fullyMintedCollection } = await loadFixture(fixtures);
      type TokenData = {
        tokenId: BigNumber;
        ownerAddress: string;
        ownershipStartTimestamp: BigNumber;
        tokenBalance: BigNumber;
        ownerLatestActivityTimestamp: BigNumber;
      }
      const verifyTokenData = async (data: TokenData, tokenId: BigNumber, contract: OpenDevsCrew): Promise<boolean> => {
        const ownerAddress = await contract.ownerOf(tokenId);

        return data.tokenId.eq(tokenId) &&
          data.ownerAddress === ownerAddress &&
          data.ownershipStartTimestamp.eq((await contract.explicitOwnershipOf(tokenId)).startTimestamp) &&
          data.tokenBalance.eq(await contract.getBalanceOfToken(tokenId)) &&
          data.ownerLatestActivityTimestamp.eq(await contract.getLatestWithdrawalTimestamp(ownerAddress));
      };

      await partiallyMintedCollection.refreshWalletBalance();
      await partiallyMintedCollection.connect(minterOfPartiallyMintedCollection1).refreshLatestWithdrawalTimestamp();

      // Non-existent token
      await expect(partiallyMintedCollection.getTokenData(0)).to.revertedWithCustomError(partiallyMintedCollection, 'OwnerQueryForNonexistentToken');
      await expect(partiallyMintedCollection.getTokenData((await partiallyMintedCollection.totalSupply()).add(1)))
        .to.revertedWithCustomError(partiallyMintedCollection, 'OwnerQueryForNonexistentToken');

      // Single query
      expect(await verifyTokenData(
        await partiallyMintedCollection.getTokenData(1),
        BigNumber.from(1),
        partiallyMintedCollection
      )).true;
      expect(await verifyTokenData(
        await partiallyMintedCollection.getTokenData(33),
        BigNumber.from(33),
        partiallyMintedCollection
      )).true;

      // Multiple query (specific tokens)
      const specificTokensData = await partiallyMintedCollection.getTokensData([1, 33]);
      expect(await verifyTokenData(specificTokensData[0], BigNumber.from(1), partiallyMintedCollection)).true;
      expect(await verifyTokenData(specificTokensData[1], BigNumber.from(33), partiallyMintedCollection)).true;
      expect(specificTokensData.length).eq(2);

      // Multiple query (range)
      const tokensDataInRange = await partiallyMintedCollection.getTokensDataInRange(33, 36);
      expect(await verifyTokenData(tokensDataInRange[0], BigNumber.from(33), partiallyMintedCollection)).true;
      expect(await verifyTokenData(tokensDataInRange[1], BigNumber.from(34), partiallyMintedCollection)).true;
      expect(await verifyTokenData(tokensDataInRange[2], BigNumber.from(35), partiallyMintedCollection)).true;
      expect(await verifyTokenData(tokensDataInRange[3], BigNumber.from(36), partiallyMintedCollection)).true;
      expect(tokensDataInRange.length).eq(4);

      // Multiple query (full range)
      const partialMintTotalSupply = await partiallyMintedCollection.totalSupply();
      const fullPartialMintTokensDataInRange = await partiallyMintedCollection.getTokensDataInRange(1, partialMintTotalSupply);
      expect(fullPartialMintTokensDataInRange.length).eq(partialMintTotalSupply);
      expect(await Promise.all(fullPartialMintTokensDataInRange.map(
        async (data, index) => await verifyTokenData(data, BigNumber.from(index + 1), partiallyMintedCollection),
      ))).deep.eq(new Array(partialMintTotalSupply.toNumber()).fill(true));

      const totalSupply = await fullyMintedCollection.totalSupply();
      const fullTokensDataInRange = await fullyMintedCollection.getTokensDataInRange(1, totalSupply);
      expect(fullTokensDataInRange.length).eq(totalSupply);
      expect(await Promise.all(fullTokensDataInRange.map(
        async (data, index) => await verifyTokenData(data, BigNumber.from(index + 1), fullyMintedCollection),
      ))).deep.eq(new Array(totalSupply.toNumber()).fill(true));

      // Invalid range
      await expect(partiallyMintedCollection.getTokensDataInRange(0, 12))
        .to.revertedWithCustomError(partiallyMintedCollection, 'InvalidQueryRange');
      await expect(partiallyMintedCollection.getTokensDataInRange(0, 42))
        .to.revertedWithCustomError(partiallyMintedCollection, 'InvalidQueryRange');
      await expect(partiallyMintedCollection.getTokensDataInRange(1, 42))
        .to.revertedWithCustomError(partiallyMintedCollection, 'InvalidQueryRange');
      await expect(partiallyMintedCollection.getTokensDataInRange(33, 10))
        .to.revertedWithCustomError(partiallyMintedCollection, 'InvalidQueryRange');
    });
  });

  describe('NftToken', function () {
    it('Check mint with invalid price', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const TOKEN_PRICE = await openDevsCrew.TOKEN_PRICE();

      // Paying more than expected
      await expect(openDevsCrew.mint(2, { value: TOKEN_PRICE.mul(3) }))
        .to.be.revertedWithCustomError(openDevsCrew, 'InvalidMintPrice');

      // Paying less than expected
      await expect(openDevsCrew.mint(2, { value: TOKEN_PRICE }))
        .to.be.revertedWithCustomError(openDevsCrew, 'InvalidMintPrice');
    });

    it('Check mint with over max batch', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const TOKEN_PRICE = await openDevsCrew.TOKEN_PRICE();
      const MAX_BATCH = await openDevsCrew.MAX_BATCH_SIZE();

      await expect(openDevsCrew.mint(MAX_BATCH + 1, { value: TOKEN_PRICE.mul(MAX_BATCH + 1) }))
        .to.be.revertedWithCustomError(openDevsCrew, 'RequestedAmountExceedsMaxBatchSize');
    });

    it('Check mint over max supply', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const TOKEN_PRICE = await openDevsCrew.TOKEN_PRICE();
      const maxInterableSupply = await (await openDevsCrew.MAX_SUPPLY()).sub(AIRDROP_OFFSET);

      for(let i = 0; i < maxInterableSupply.toNumber(); i++) {
        await openDevsCrew.mint(1, { value: TOKEN_PRICE });
      }

      await expect(openDevsCrew.mint(1, { value: TOKEN_PRICE }))
        .to.be.revertedWithCustomError(openDevsCrew, 'RequestedAmountExceedsMaxSupply');
    });

    it('Check setUri with metadata freeze', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      await expect(openDevsCrew.freezeMetadata())
        .to.be.revertedWithCustomError(openDevsCrew, 'CannotFreezeMetadataBeforeReveal');

      await openDevsCrew.setUriPrefix('testPrefix');
      await openDevsCrew.setHiddenMetadataUri('testHiddenPrefix');

      await expect(openDevsCrew.freezeMetadata()).to.not.be.reverted;

      await expect(openDevsCrew.setUriPrefix('test')).to.be.revertedWithCustomError(openDevsCrew, 'MetadataIsFrozen');
      await expect(openDevsCrew.setHiddenMetadataUri('testHidden'))
        .to.be.revertedWithCustomError(openDevsCrew, 'MetadataIsFrozen');
    });

    it('Check tokenUri', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const TEST_TOKEN_ID = AIRDROP_OFFSET + 1;

      const testHiddenMetadataUri = 'hiddenMetadataUriTest';
      await openDevsCrew.setHiddenMetadataUri(testHiddenMetadataUri);

      await expect(openDevsCrew.tokenURI(TEST_TOKEN_ID))
        .to.be.revertedWithCustomError(openDevsCrew, 'URIQueryForNonexistentToken');

      const token_price = await openDevsCrew.TOKEN_PRICE();

      await openDevsCrew.mint(1, { value: token_price });

      expect(await openDevsCrew.tokenURI(TEST_TOKEN_ID)).to.be.equal(testHiddenMetadataUri);

      const testPrefixUri = 'uriPrefixTestID';
      await openDevsCrew.setUriPrefix(testPrefixUri);

      expect(await openDevsCrew.tokenURI(TEST_TOKEN_ID)).to.be.equal(testPrefixUri + TEST_TOKEN_ID + '.json');
    });

    it('Check royaltyInfo', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);
      const salePrice = ethers.utils.parseEther('0.3');

      const expectedResult = [
        openDevsCrew.address,
        salePrice.div(10),
      ];

      const royaltyInfoResult = await openDevsCrew.royaltyInfo(1, salePrice);

      expect(royaltyInfoResult[0] === expectedResult[0]).to.be.true;
      expect(royaltyInfoResult[1].eq(expectedResult[1])).to.be.true;
    });

    it('Check interfaces support', async function () {
      const { openDevsCrew } = await loadFixture(fixtures);

      const ERC165  = 0x01ffc9a7;
      const IERC721 = 0x80ac58cd;
      const ERC721Metadata = 0x5b5e139f;
      const IERC2981 = 0x2a55205a;

      const brokenIERC2981 = 0x3a55205a;

      expect(await openDevsCrew.supportsInterface(ethers.utils.hexlify(ERC165))).to.be.true;
      expect(await openDevsCrew.supportsInterface(ethers.utils.hexlify(IERC721))).to.be.true;
      expect(await openDevsCrew.supportsInterface(ethers.utils.hexlify(ERC721Metadata))).to.be.true;
      expect(await openDevsCrew.supportsInterface(ethers.utils.hexlify(IERC2981))).to.be.true;

      expect(await openDevsCrew.supportsInterface(ethers.utils.hexlify(brokenIERC2981))).to.be.false;
    });
  });
});
