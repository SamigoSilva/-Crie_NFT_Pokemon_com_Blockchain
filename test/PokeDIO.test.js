const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PokeDIO - Pokemon NFT Battle Game", function () {
  let PokeDIO;
  let pokeDIO;
  let owner, player1, player2;

  before(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    
    PokeDIO = await ethers.getContractFactory("PokeDIO");
    pokeDIO = await PokeDIO.deploy();
    await pokeDIO.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pokeDIO.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await pokeDIO.name()).to.equal("PokeDIO");
      expect(await pokeDIO.symbol()).to.equal("PKD");
    });
  });

  describe("Minting Pokemons", function () {
    it("Should allow owner to mint new Pokemons", async function () {
      await expect(pokeDIO.connect(owner).mintPokemon("Pikachu", player1.address, "ipfs://pikachu"))
        .to.emit(pokeDIO, "PokemonCreated")
        .withArgs(0, "Pikachu", player1.address);

      expect(await pokeDIO.totalPokemons()).to.equal(1);
    });

    it("Should prevent non-owners from minting", async function () {
      await expect(
        pokeDIO.connect(player1).mintPokemon("Charmander", player1.address, "ipfs://charmander")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should store Pokemon data correctly", async function () {
      const pokemon = await pokeDIO.getPokemon(0);
      expect(pokemon.name).to.equal("Pikachu");
      expect(pokemon.level).to.equal(1);
      expect(pokemon.imgUri).to.equal("ipfs://pikachu");
    });
  });

  describe("Pokemon Battles", function () {
    before(async function () {
      // Mint a second Pokemon for testing battles
      await pokeDIO.connect(owner).mintPokemon("Bulbasaur", player2.address, "ipfs://bulbasaur");
    });

    it("Should allow Pokemon owners to battle", async function () {
      await expect(pokeDIO.connect(player1).battle(0, 1))
        .to.emit(pokeDIO, "PokemonBattled")
        .withArgs(0, 1, 3, 2); // Pikachu (lvl1+2) vs Bulbasaur (lvl1+1)

      const pikachu = await pokeDIO.getPokemon(0);
      const bulbasaur = await pokeDIO.getPokemon(1);
      
      expect(pikachu.level).to.equal(3);
      expect(bulbasaur.level).to.equal(2);
    });

    it("Should prevent battles with non-owned Pokemons", async function () {
      await expect(
        pokeDIO.connect(player2).battle(0, 1) // player2 doesn't own Pikachu (id 0)
      ).to.be.revertedWith("PokeDIO: Only the owner can battle with this Pokemon");
    });

    it("Should prevent battles with invalid Pokemons", async function () {
      await expect(
        pokeDIO.connect(player1).battle(0, 99) // Invalid ID
      ).to.be.revertedWith("PokeDIO: Invalid Pokemon IDs");
    });

    it("Should prevent self-battles", async function () {
      await expect(
        pokeDIO.connect(player1).battle(0, 0)
      ).to.be.revertedWith("PokeDIO: A Pokemon cannot battle itself");
    });
  });

  describe("NFT Ownership", function () {
    it("Should correctly track token ownership", async function () {
      expect(await pokeDIO.ownerOf(0)).to.equal(player1.address);
      expect(await pokeDIO.ownerOf(1)).to.equal(player2.address);
    });

    it("Should allow token transfers", async function () {
      await pokeDIO.connect(player1).transferFrom(player1.address, player2.address, 0);
      expect(await pokeDIO.ownerOf(0)).to.equal(player2.address);
    });
  });
});
