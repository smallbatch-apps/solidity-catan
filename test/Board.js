// const { expectRevert } = require("@openzeppelin/test-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
require("@nomiclabs/hardhat-ethers");
const { expect } = require("chai");

const toBytes = ethers.utils.formatBytes32String;
const fromBytes = ethers.utils.parseBytes32String;

describe("Board", function () {
  
  let accounts, resourcesFactory, factory, resourcesInstance, instance, bankInstance;
  let owner, bank, alice, bob, hacker, steve;

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, bank, alice, bob, hacker, steve] = accounts;
    resourcesFactory = await ethers.getContractFactory("Resources");
    factory = await ethers.getContractFactory("Board");
  });

  beforeEach(async () => {
    resourcesInstance = await resourcesFactory.deploy(bank.address);
    instance = await factory.deploy(resourcesInstance.address);
    bankInstance = await instance.connect(bank);
  });
 

  describe("Board Setup", function () {
    beforeEach(async () => {
      await instance.connect(alice).joinPlayer(toBytes('Alice'), 0);
    })
    it("Should allow joining", async () => {
      const players = await instance.getPlayers();
      expect(players.length).to.equal(1, 'Should only be one player');
      expect(fromBytes(players[0].name)).to.equal('Alice', 'Player name should be alice');
      expect(players[0].colour).to.equal(0, 'Player colour should be 0 value');
    });

    it("Should allow multiple players", async () => {
      await instance.connect(bob).joinPlayer(toBytes('Bob'), 1);
      await instance.connect(hacker).joinPlayer(toBytes('Hacker'), 2);
      await instance.connect(steve).joinPlayer(toBytes('Steve'), 3);

      const players = await instance.getPlayers();
      expect(players.length).to.equal(4, 'Should be four players');
      expect(fromBytes(players[0].name)).to.equal('Alice', 'Player name should be alice');
      expect(fromBytes(players[1].name)).to.equal('Bob', 'Player name should be bob');
      expect(fromBytes(players[2].name)).to.equal('Hacker', 'Player name should be hacker');
      expect(fromBytes(players[3].name)).to.equal('Steve', 'Player name should be steve');
    });
    
    it("should not allow duplicate address", async () => {
      const errorMessage = "Matching player already exists";
      await expect(instance.connect(alice).joinPlayer(toBytes('Steve'), 1)).to.be.revertedWith(errorMessage);
    });

    it("should not allow duplicate name", async () => {
      const errorMessage = "Matching player already exists"
      await expect(instance.connect(bob).joinPlayer(toBytes('Alice'), 1)).to.be.revertedWith(errorMessage);
    });

    it("should not allow duplicate colours", async () => {
      const errorMessage = "Colour already chosen";
      await expect(instance.connect(bob).joinPlayer(toBytes('Bob'), 0)).to.be.revertedWith(errorMessage);
    });
    
    it("should not allow bank to join", async () => {
      const errorMessage = "Bank may not be a player";
      await expect(bankInstance.joinPlayer(toBytes('Steve'), 1)).to.be.revertedWith(errorMessage);
    });

    it("should not allow five players to join", async () => {
      const errorMessage = "Maximum players already";

      await instance.connect(bob).joinPlayer(toBytes('Bob'), 1);
      await instance.connect(hacker).joinPlayer(toBytes('Hacker'), 2);
      await instance.connect(steve).joinPlayer(toBytes('Steve'), 3);
      await expect(instance.connect(accounts[7]).joinPlayer(toBytes('Nancy'), 1)).to.be.revertedWith(errorMessage);
    });

  });

  describe.only("rolling dice", function () {
    it("can roll dice", async () => {
      const dice = await instance.rollDice();
      expect(dice).to.be.below(13).and.to.be.above(1);
    });
    
    it("can select first player", async () => {
      await instance.connect(bob).joinPlayer(toBytes('Bob'), 1);
      await instance.connect(hacker).joinPlayer(toBytes('Hacker'), 2);
      await instance.connect(steve).joinPlayer(toBytes('Steve'), 3);
      const firstPlayer = await instance.chooseStartingPlayer();
      console.log(firstPlayer)
      expect(firstPlayer).to.be.below(4);
    });
  });

});
