const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Proposal contract", function () {
  // This is a "fixture", which runs only once
  // For subsequent loadFixture() calls, it doesn't re-run,
  // but instead reset the state of network to what it was at the point after the fixture was initially executed.
  async function deployTokenFixture() {
    const [acc0, acc1, acc2, acc3, acc4] = await ethers.getSigners();
    const tokenContract = await ethers.deployContract("RealEstateTokens");
    const tokenContractAddress = await tokenContract.getAddress();
    const DAOContract = await ethers.deployContract("RealEstateDAO", [
      tokenContractAddress,
    ]);
    return { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract };
  }

  it("Mint new token and transfer to other accounts", async function () {
    const { acc0, acc1, tokenContract } = await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    expect(await tokenContract.balanceOf(acc0.address, 0)).to.equal(70);
    expect(await tokenContract.balanceOf(acc1.address, 0)).to.equal(30);
  });

  it("Adding event listener should work", async function () {
    const { acc0, tokenContract, DAOContract } = await loadFixture(
      deployTokenFixture
    );
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    // Event listener must be added before calling createProposal
    DAOContract.on(
      "ProposalCreated",
      (proposalId, proposer, tokenId, description, endBlock) => {
        console.log(
          `Proposal #${proposalId} created by ${proposer} with description: ${description}`
        );
      }
    );
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");
  });

  it("Creating proposal should emit ProposalCreated events", async function () {
    const { acc0, tokenContract, DAOContract } = await loadFixture(
      deployTokenFixture
    );
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await expect(
      DAOContract.createProposal(0, "Sample proposal 1 for token #0")
    ).to.emit(DAOContract, "ProposalCreated");
  });

  it("Voting on proposal should emit Voted events", async function () {
    const { acc0, tokenContract, DAOContract } = await loadFixture(
      deployTokenFixture
    );
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");
    await expect(DAOContract.connect(acc0).vote(0, true)).to.emit(
      DAOContract,
      "Voted"
    );
  });

  it("Non token-holder must not be allowed to vote", async function () {
    const { acc0, acc1, tokenContract, DAOContract } = await loadFixture(
      deployTokenFixture
    );
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");
    DAOContract.on("Voted", (proposalId, voter, vote, weight) => {
      console.log(
        `Proposal #${proposalId} voted by ${voter} with vote: ${vote} and weight: ${weight}`
      );
    });
    await expect(DAOContract.connect(acc1).vote(0, true)).to.be.revertedWith(
      "Must be a token holder to vote"
    );
  });

  it("Should execute proposal successfully if it receives enough 'for' votes", async function () {
    const { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract } =
      await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc2.address,
      0,
      20,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc3.address,
      0,
      7,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc4.address,
      0,
      3,
      "0x"
    );
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");

    // acc0 & acc1 vote for the proposal
    // total 70 votes
    await DAOContract.connect(acc0).vote(0, true);
    await DAOContract.connect(acc1).vote(0, true);
    await DAOContract.connect(acc2).vote(0, false);
    await DAOContract.connect(acc3).vote(0, false);
    await DAOContract.connect(acc4).vote(0, false);

    // Use a loop to mine new blocks until the voting period is over
    // Note that votingDuration() is a getter function,
    // automatically created by Solidity when declaring a public attribute
    for (let i = 0; i < (await DAOContract.votingDuration()); i++) {
      await network.provider.send("evm_mine");
    }

    // Execute the proposal
    await DAOContract.executeProposal(0);

    // Assert that the proposal has been executed
    expect((await DAOContract.proposals(0)).executed).to.equal(true);
  });

  it("Should fail to execute proposal if the number of 'for' votes doesn't reach quorum", async function () {
    const { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract } =
      await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc2.address,
      0,
      20,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc3.address,
      0,
      7,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc4.address,
      0,
      3,
      "0x"
    );
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");

    // only acc0 vote for the proposal
    // total 40 votes out of 100 possible votes
    await DAOContract.connect(acc0).vote(0, true);

    // Use a loop to mine new blocks until the voting period is over
    // Note that votingDuration() is a getter function,
    // automatically created by Solidity when declaring a public attribute
    for (let i = 0; i < (await DAOContract.votingDuration()); i++) {
      await network.provider.send("evm_mine");
    }

    // Execute the proposal
    await DAOContract.executeProposal(0);

    // Assert that the proposal has been executed
    expect((await DAOContract.proposals(0)).executed).to.equal(false);
  });

  it("Should fail to execute proposal if too many 'against' votes", async function () {
    const { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract } =
      await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc2.address,
      0,
      20,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc3.address,
      0,
      7,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc4.address,
      0,
      3,
      "0x"
    );
    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");

    // only acc1 vote for the proposal
    // total 30 votes out of 100 possible votes
    await DAOContract.connect(acc0).vote(0, false);
    await DAOContract.connect(acc1).vote(0, true);
    await DAOContract.connect(acc2).vote(0, false);
    await DAOContract.connect(acc3).vote(0, false);
    await DAOContract.connect(acc4).vote(0, false);

    // Use a loop to mine new blocks until the voting period is over
    // Note that votingDuration() is a getter function,
    // automatically created by Solidity when declaring a public attribute
    for (let i = 0; i < (await DAOContract.votingDuration()); i++) {
      await network.provider.send("evm_mine");
    }

    // Execute the proposal
    await DAOContract.executeProposal(0);

    // Assert that the proposal has been executed
    expect((await DAOContract.proposals(0)).executed).to.equal(false);
  });

  it("Should not execute proposal twice", async function () {
    const { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract } =
      await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc2.address,
      0,
      20,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc3.address,
      0,
      7,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc4.address,
      0,
      3,
      "0x"
    );

    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");

    // acc0 & acc1 vote for the proposal
    // total 70 votes
    await DAOContract.connect(acc0).vote(0, true);
    await DAOContract.connect(acc1).vote(0, true);
    await DAOContract.connect(acc2).vote(0, false);
    await DAOContract.connect(acc3).vote(0, false);
    await DAOContract.connect(acc4).vote(0, false);

    // Use a loop to mine new blocks until the voting period is over
    // Note that votingDuration() is a getter function,
    // automatically created by Solidity when declaring a public attribute
    for (let i = 0; i < (await DAOContract.votingDuration()); i++) {
      await network.provider.send("evm_mine");
    }

    // Execute the proposal
    await DAOContract.executeProposal(0);

    // Trying to execute the proposal again should fail
    await expect(DAOContract.executeProposal(0)).to.be.revertedWith(
      "Proposal has been executed"
    );
  });

  it("Should not be able to execute proposal before voting period ends", async function () {
    const { acc0, acc1, acc2, acc3, acc4, tokenContract, DAOContract } =
      await loadFixture(deployTokenFixture);
    await tokenContract.mint(acc0.address, 0, 100, "0x");
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc1.address,
      0,
      30,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc2.address,
      0,
      20,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc3.address,
      0,
      7,
      "0x"
    );
    await tokenContract.safeTransferFrom(
      acc0.address,
      acc4.address,
      0,
      3,
      "0x"
    );

    await DAOContract.createProposal(0, "Sample proposal 1 for token #0");

    // acc0 & acc1 vote for the proposal
    // total 70 votes
    await DAOContract.connect(acc0).vote(0, true);
    await DAOContract.connect(acc1).vote(0, true);
    await DAOContract.connect(acc2).vote(0, false);
    await DAOContract.connect(acc3).vote(0, false);
    await DAOContract.connect(acc4).vote(0, false);

    // Execute the proposal immediately (not waiting for the voting period to end) should fail
    await expect(DAOContract.executeProposal(0)).to.be.revertedWith(
      "Voting period has not ended"
    );
  });
});
