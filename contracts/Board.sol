// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Resources.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Board is Ownable {
    Resources private _resources;
    bytes1 private MAX_VERTEX = 0xab;
    bytes1[2] private testBytes;
    uint8 constant MAX_HEX = 19;
    uint8 constant MAX_PLAYERS = 4;
    uint8 public currentThrow = 0;
    bytes1 vertex;
    bytes1[2] vertices;
    bool public gameReady = false;
    // bool public gameStarted = false;

    uint8 public currentPlayerTurn;
    uint8 public currentSetupPlayer;

    enum Colours {
        Red,
        Yellow,
        Blue,
        Green
    }

    struct Player {
        bytes32 name;
        address ethAddress;
        Colours colour;
        uint8 victoryPoints;
        uint8 privateVictoryPoints;
    }

    struct Hex {
        Resources.ResourceTypes resourceType;
        bool hasRobber;
        uint8 roll;
        bytes1[6] vertices;
    }

    Player[] public _players;
    Hex[19] public _hexes;

    constructor(address resources) {
        _resources = Resources(resources);
        MAX_VERTEX = 0x34;
        vertex = 0x34;
        vertices = [0x01, 0x02];
    }

    function joinPlayer(bytes32 name, Colours colour) public {
        require(_players.length < MAX_PLAYERS, "Maximum players already");
        require(
            msg.sender != address(_resources._bank()),
            "Bank may not be a player"
        );
        bool colourAvailable = true;
        bool isAvailable = true;
        for (uint i = 0; i < _players.length; i++) {
            Player memory player = _players[i];
            if (player.name == name || player.ethAddress == msg.sender) {
                isAvailable = false;
            }
            if (player.colour == colour) {
                colourAvailable = false;
            }
        }
        require(isAvailable, "Matching player already exists");
        require(colourAvailable, "Colour already chosen");

        _players.push(Player(name, msg.sender, colour, 0, 0));
    }

    function getPlayers() public view returns (Player[] memory) {
        return _players;
    }

    function rollDice() public view returns (uint) {
        uint bts = block.timestamp;
        uint bd = block.difficulty;
        uint pl = _players.length;

        return rollSingleDice(bd, bts, pl) + rollSingleDice(bts, pl, bd);
    }

    /*
     * The below code is known to be insecure as timestamp and difficulty can be predicted or controlled by miners.
     * The correct code would instead implement randomness from an external oracle
     */
    function rollSingleDice(
        uint a,
        uint b,
        uint c
    ) public pure returns (uint) {
        uint initialUint = uint(keccak256(abi.encodePacked(a, b, c)));
        uint roll = initialUint % 6;
        if (roll == 0) roll = 6;
        return roll;
    }

    function chooseStartingPlayer() public view returns (uint) {
        uint bestThrow = 0;
        uint firstPlayer = 0;
        for (uint i = 0; i < _players.length; i++) {
            uint newRoll1 = rollSingleDice(
                block.difficulty,
                block.timestamp,
                i
            );
            uint newRoll2 = rollSingleDice(
                i,
                block.difficulty,
                block.timestamp
            );
            uint newRoll = newRoll1 + newRoll2;
            if (newRoll > bestThrow) {
                bestThrow = newRoll;
                firstPlayer = i;
            }
        }
        return firstPlayer;
    }

    function nonRandomSetup() internal {
        _hexes[0].vertices = [
            bytes1(0x00),
            bytes1(0x01),
            bytes1(0x02),
            bytes1(0x03),
            bytes1(0x04),
            bytes1(0x04)
        ];
        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;

        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;

        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;

        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;

        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;

        // _hexes[0].vertices[0] = 0x01;
        // _hexes[0].vertices[1] = 0x04;
        // _hexes[0].vertices[2] = 0x05;
        // _hexes[0].vertices[3] = 0x04;
        // _hexes[0].vertices[4] = 0x05;
        // _hexes[0].vertices[5] = 0x04;
    }
}
