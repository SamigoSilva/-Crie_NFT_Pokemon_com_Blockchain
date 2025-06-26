// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PokeDIO is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    struct Pokemon {
        string name;
        uint256 level;
        string imgUri;  // Changed from 'img' for clarity
    }

    Counters.Counter private _tokenIdCounter;
    Pokemon[] private _pokemons;

    event PokemonCreated(uint256 indexed tokenId, string name, address owner);
    event PokemonBattled(uint256 indexed attackerId, uint256 indexed defenderId, uint256 newAttackerLevel, uint256 newDefenderLevel);

    constructor() ERC721("PokeDIO", "PKD") {
        // Owner set automatically by Ownable
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "PokeDIO: Only the owner can battle with this Pokemon");
        _;
    }

    // Battle function with improved logic and events
    function battle(uint256 attackerId, uint256 defenderId) public onlyTokenOwner(attackerId) {
        require(_exists(attackerId) && _exists(defenderId), "PokeDIO: Invalid Pokemon IDs");
        require(attackerId != defenderId, "PokeDIO: A Pokemon cannot battle itself");

        Pokemon storage attacker = _pokemons[attackerId];
        Pokemon storage defender = _pokemons[defenderId];

        if (attacker.level >= defender.level) {
            attacker.level += 2;
            defender.level += 1;
        } else {
            attacker.level += 1;
            defender.level += 2;
        }

        emit PokemonBattled(attackerId, defenderId, attacker.level, defender.level);
    }

    // Minting function with improved access control
    function mintPokemon(string memory name, address to, string memory imgUri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _pokemons.push(Pokemon(name, 1, imgUri));
        _safeMint(to, tokenId);
        _tokenIdCounter.increment();
        
        emit PokemonCreated(tokenId, name, to);
    }

    // Getter functions
    function getPokemon(uint256 tokenId) public view returns (Pokemon memory) {
        require(_exists(tokenId), "PokeDIO: Pokemon does not exist");
        return _pokemons[tokenId];
    }

    function totalPokemons() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
