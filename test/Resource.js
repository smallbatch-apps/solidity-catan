const { expectRevert } = require("@openzeppelin/test-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const { expect } = require("chai");

describe("Resource", function () {
  
  let accounts, factory, instance, bankInstance;
  let owner, bank, alice, bob, hacker;

  const DEFAULT_NAME = 'STEEL';
  const DEFAULT_SYMBOL = 'CSTL';

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, bank, alice, bob, hacker] = accounts;

    factory = await ethers.getContractFactory("Resource");
  });

  beforeEach(async () => {
    instance = await factory.deploy(DEFAULT_NAME, DEFAULT_SYMBOL, bank.address);
    bankInstance = await instance.connect(bank);
  });
 
  describe("Deployment", function () {
    it("Should set the right symbol and name", async () => {
      const name = await instance.name();
      const symbol = await instance.symbol();

      expect(name).to.equal(DEFAULT_NAME);
      expect(symbol).to.equal(DEFAULT_SYMBOL);
    });
  });

  describe("ERC20 Token Support", function () {
    beforeEach(async () => {
      await bankInstance.transfer(alice.address, 5);
      await bankInstance.transfer(bob.address, 3);
    });

    it("Should allow transferring", async () => {
      const bobInstance = await instance.connect(bob);
      
      const bobBalanceBefore = await instance.balanceOf(bob.address);
      const bankBalanceBefore = await instance.balanceOf(bank.address);
      const aliceBalanceBefore = await instance.balanceOf(alice.address);
      
      await bobInstance.transfer(alice.address, 1);

      const bobBalanceAfter = await instance.balanceOf(bob.address);
      const bankBalanceAfter = await instance.balanceOf(bank.address);
      const aliceBalanceAfter = await instance.balanceOf(alice.address);

      expect(aliceBalanceBefore).to.equal(5);
      expect(bobBalanceBefore).to.equal(3);
      expect(bankBalanceBefore).to.equal(11);

      expect(aliceBalanceAfter).to.equal(6);
      expect(bobBalanceAfter).to.equal(2);
      expect(bankBalanceAfter).to.equal(11);

    });

    it("Should allow not transferring invalid amounts", async () => {
      expectRevert(instance.connect(bob).transfer(alice.address, 4));
    });
  });

});
