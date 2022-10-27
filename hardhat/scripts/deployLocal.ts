import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
  const wethContract = await deployWethFixture();

  const OpenDevsCrew = await ethers.getContractFactory("OpenDevsCrew");
  const openDevsCrew = await OpenDevsCrew.deploy();

  await openDevsCrew.deployed();

  console.log(`Collection deployed to ${openDevsCrew.address}`);
}

async function deployWethFixture() {
  const wethDeployerAddress = "0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876";
  const wethDeploymentTxNonce = 446;

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [wethDeployerAddress],
  });

  await network.provider.request({
    method: "hardhat_setNonce",
    params: [
      wethDeployerAddress,
      BigNumber.from(wethDeploymentTxNonce).toHexString().replace(/0x0+/, "0x"),
    ],
  });

  await network.provider.request({
    method: "hardhat_setBalance",
    params: [
      wethDeployerAddress,
      ethers.utils.parseEther("10000").toHexString().replace(/0x0+/, "0x"),
    ],
  });

  const wethDeployer = await ethers.provider.getSigner(wethDeployerAddress);

  const WETH9 = await ethers.getContractFactory("WETH9");
  const weth = await WETH9.connect(wethDeployer).deploy({nonce: wethDeploymentTxNonce});

  return { weth, wethDeployer };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
