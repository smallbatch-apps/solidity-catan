const { expectRevert } = require("@openzeppelin/test-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
require("@nomiclabs/hardhat-ethers");
const { expect } = require("chai");

const toBytes = ethers.utils.formatBytes32String;

describe("Resources", function () {
  
  let accounts, factory, instance, bankInstance;
  let owner, bank, alice, bob, hacker;

  const SHEEP = 0;
  const BRICK = 1;
  const WOOD = 2;
  const STONE = 3;
  const WHEAT = 4;

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, bank, alice, bob, hacker] = accounts;

    factory = await ethers.getContractFactory("Resources");
  });

  beforeEach(async () => {
    instance = await factory.deploy(bank.address);
    bankInstance = await instance.connect(bank);
  });
 
  
  describe("ERC1155 Token Support", function () {

    beforeEach(async () => {
      await bankInstance.safeTransferFrom(bank.address, alice.address, SHEEP, 3, toBytes(""));
      await bankInstance.safeTransferFrom(bank.address, bob.address, SHEEP, 5, toBytes(""));
    });

    it("Should allow transferring", async () => {
      const { addresses, ids } = getBalancesForResource([alice.address, bob.address, bank.address], SHEEP);
      const sheepBalancesBefore = await bankInstance.balanceOfBatch(addresses, ids);

      await instance.connect(alice).safeTransferFrom(alice.address, bob.address, SHEEP, 1, toBytes(""));
      
      const sheepBalancesAfter = await bankInstance.balanceOfBatch(addresses, ids);
      
      expect(sheepBalancesBefore[0]).to.equal(3);
      expect(sheepBalancesBefore[1]).to.equal(5);
      expect(sheepBalancesBefore[2]).to.equal(11);

      expect(sheepBalancesAfter[0]).to.equal(2);
      expect(sheepBalancesAfter[1]).to.equal(6);
      expect(sheepBalancesAfter[2]).to.equal(11);

    });

  });

});

const getResourcesForAddress = address => {
  const ids = [0, 1, 2, 3, 4];
  return {
    addresses: ids.map(() => address),
    ids
  }
}

const getBalancesForResource = (addresses, resource) => {
  return {
    addresses,
    ids: addresses.map(() => resource)
  }
}

// const getAllBalances = (addresses) => {
//   const ids = [0, 1, 2, 3, 4];
//   return {
//     addresses,
//     ids: addresses.map(() => resource)
//   }
// }