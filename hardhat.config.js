require("@nomicfoundation/hardhat-toolbox");

task("resources", "Create the resources for a game")
  .setAction(async () => {
    const resourceFactory = await ethers.getContractFactory("Resource");

    await (await resourceFactory.deploy('Brick', 'CBRK')).deployed();
    await (await resourceFactory.deploy('Wood', 'CWOOD')).deployed();
    await (await resourceFactory.deploy('Stone', 'CSTONE')).deployed();
    await (await resourceFactory.deploy('Wheat', 'CWHT')).deployed();

    console.log('Deployed resources');
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};

