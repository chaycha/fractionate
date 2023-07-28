// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract RealEstateDAO {
    ERC1155Supply public tokens;

    struct Proposal {
        address proposer;
        uint256 tokenId;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endBlock;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;

    uint256 public proposalCount = 0;

    // votingDuration is in terms of number of blocks on the blockchain
    // In Ethereum mainnet, a block is mined every 15 seconds on average
    // So 100 blocks is roughly 25 minutes
    uint256 public votingDuration = 100;

    event ProposalCreated(
        uint256 proposalId,
        address proposer,
        uint256 tokenId,
        string description,
        uint256 endBlock
    );
    event Voted(uint256 proposalId, address voter, bool vote, uint256 weight);
    event ProposalExecuted(uint256 proposalId);

    constructor(ERC1155Supply _tokens) {
        tokens = _tokens;
    }

    // Used by proposer to create new proposal
    function createProposal(uint256 tokenId, string memory description) public {
        require(
            tokens.balanceOf(msg.sender, tokenId) > 0,
            "Must be a token holder to create proposal"
        );

        proposals[proposalCount++] = Proposal({
            proposer: msg.sender,
            tokenId: tokenId,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            endBlock: block.number + votingDuration,
            executed: false
        });

        emit ProposalCreated(
            proposalCount - 1,
            msg.sender,
            tokenId,
            description,
            block.number + votingDuration
        );
    }

    // Used by token holders to vote on a proposal
    function vote(uint256 proposalId, bool decision) public {
        Proposal storage p = proposals[proposalId];

        require(block.number <= p.endBlock, "Voting period has ended");
        require(!p.executed, "Proposal has been executed");

        uint256 weight = tokens.balanceOf(msg.sender, p.tokenId);

        require(weight > 0, "Must be a token holder to vote");

        if (decision) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, decision, weight);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage p = proposals[proposalId];

        require(block.number > p.endBlock, "Voting period has not ended");
        require(!p.executed, "Proposal has been executed");

        if (
            p.forVotes > p.againstVotes &&
            p.forVotes > tokens.totalSupply(p.tokenId) / 2
        ) {
            p.executed = true;

            // Here you can add code to perform whatever action the proposal represents

            emit ProposalExecuted(proposalId);
        }
    }
}
