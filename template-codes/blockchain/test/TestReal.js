const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Real Estate contract", function () {
  it("Should transfer tokens between accounts", async function () {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // get the contract by using getContractAt from hardhat-ethers (not exist in ethers.js)
    // this version, getContractAt(contractName, address) will give contract all the functions
    // another version, getContractAt(abi, address) will only gives contract the functions provided in the abi
    const contract = await ethers.getContractAt(
      "RealEstateTokens",
      contractAddress
    );

    // A test suite to check if the deployer have all the tokens
    const senderAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    expect(await contract.balanceOf(senderAddress, 0)).to.equal(
      1000000000000000000n
    );
  });
});
