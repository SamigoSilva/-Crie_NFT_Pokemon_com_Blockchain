# PokeDIO - NFT Pokemon Battle Game

![Solidity](https://img.shields.io/badge/Solidity-0.8.0-blue)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.9-green)

A blockchain-based Pokemon NFT game where players can battle their digital collectibles.

## Features
- 🎮 ERC-721 compliant Pokemon NFTs
- ⚔️ Battle system with level progression
- 🔒 Secure ownership controls
- 📡 Full event tracking for all game actions

## Smart Contract Functions

### Core Functions
| Function | Description |
|----------|-------------|
| `mintPokemon(name, to, imgUri)` | (Owner only) Creates a new Pokemon NFT |
| `battle(attackerId, defenderId)` | Makes two Pokemons battle, increasing their levels |

### View Functions
| Function | Description |
|----------|-------------|
| `getPokemon(tokenId)` | Returns all data for a specific Pokemon |
| `totalPokemons()` | Returns the current number of minted Pokemons |

## Development

### Requirements
- Node.js ≥ 16
- Hardhat

### Installation
```bash
npm install @openzeppelin/contracts
```

Testing
How to use:
Installation:
```bash
npm install --save-dev hardhat chai @nomicfoundation/hardhat-toolbox
```
```bash
npx hardhat test
```
