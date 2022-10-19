import { ethers } from 'hardhat';

async function main() {
  const OpenDevsCrew = await ethers.getContractFactory('TestnetMock');
  const openDevsCrew = await OpenDevsCrew.deploy();

  await openDevsCrew.deployed();

  console.log(`Collection deployed to ${openDevsCrew.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
