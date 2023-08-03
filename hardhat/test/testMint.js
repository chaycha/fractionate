const { expect } = require("chai");
const address2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

// get the contract by using getContractAt from hardhat-ethers (not exist in ethers.js)
// this version, getContractAt(contractName, address) will give contract all the functions
// another version, getContractAt(abi, address) will only gives contract the functions provided in the abi

describe("Test Minting", function () {
  it("Should be able to mint new token", async function () {
    const [owner] = await ethers.getSigners();

    const contract = await ethers.deployContract("RealEstateTokens");

    await contract.mintNew("HA", 5, 10200, address2);
    const balanceAfter = await contract.balanceOf(address2, 0);
    expect(balanceAfter).to.equal(5n);
  });
});
