// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 
  const resourceFactory = await hre.ethers.getContractFactory("Resource");
  const sheep = await resourceFactory.deploy('Sheep', 'CSHP');
  // const brick = await resourceFactory.deploy('Brick', 'CBRK');
  // const wood = await resourceFactory.deploy('Wood', 'CWOOD');
  // const stone = await resourceFactory.deploy('Stone', 'CSTONE');
  // const wheat = await resourceFactory.deploy('Wheat', 'CWHT');

  await sheep.deployed();
  // await brick.deployed();
  // await wood.deployed();
  // await stone.deployed();
  // await wheat.deployed();

  console.log(`Resources deployed`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
