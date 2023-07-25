const { expect } = require("chai");
const hre = require("hardhat");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const address0 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const address1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const address2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

// get the contract by using getContractAt from hardhat-ethers (not exist in ethers.js)
// this version, getContractAt(contractName, address) will give contract all the functions
// another version, getContractAt(abi, address) will only gives contract the functions provided in the abi

describe("Test Minting", function () {
  it("Should be able to mint new token", async function () {
    const contract = await hre.ethers.getContractAt(
      "RealEstateTokens",
      contractAddress
    );
    const balanceBefore = await contract.balanceOf(address2, 5);
    await contract.mint(address2, 5, 109, "0x"); // "0x" here is a DataHexString (just put there to avoid error), which satisfies the "bytes" type in the mint function
    const balanceAfter = await contract.balanceOf(address2, 5);
    expect(balanceAfter).to.equal(balanceBefore + 109n);
  });
});
