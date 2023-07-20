const { expect } = require("chai");
const { ethers } = require("hardhat");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const address0 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const address1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// get the contract by using getContractAt from hardhat-ethers (not exist in ethers.js)
// this version, getContractAt(contractName, address) will give contract all the functions
// another version, getContractAt(abi, address) will only gives contract the functions provided in the abi

describe("Real Estate contract", function () {
  it("Should transfer tokens between accounts", async function () {
    const contract = await ethers.getContractAt(
      "RealEstateTokens",
      contractAddress
    );
    // A test suite to check if the deployer have all the tokens
    expect(await contract.balanceOf(address0, 0)).to.equal(
      1000000000000000000n
    );
  });

  it("Should be able to create a new token", async function () {
    const contract = await ethers.getContractAt(
      "RealEstateTokens",
      contractAddress
    );
    const balanceBefore = await contract.balanceOf(address1, 1);
    await contract.mint(address1, 1, 100, "0x"); // "0x" here is a DataHexString (just put there to avoid error), which satisfies the "bytes" type in the mint function
    const balanceAfter = await contract.balanceOf(address1, 1);
    expect(balanceAfter).to.equal(balanceBefore + 100n);
  });
});
