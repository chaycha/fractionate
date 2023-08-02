// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./RealEstateTokens.sol";

contract RealEstateDAO {
    RealEstateTokens public tokens;

    enum ProposalType {
        Regular,
        Rent
    }

    struct Proposal {
        uint256 id;
        address proposer;
        uint256 tokenId;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 totalTokens;
        uint256 endBlock;
        bool executed;
        ProposalType proposalType;
        address tenant;
        uint256 rent;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public proposalCount = 0;

    // votingDuration is in terms of number of blocks on the blockchain.
    // In Ethereum mainnet, a block is mined every 15 seconds on average.
    // So 8 blocks is roughly 2 minutes.
    uint256 public votingDuration = 8;

    event ProposalCreated(
        uint256 proposalId,
        address proposer,
        uint256 tokenId,
        string description,
        uint256 endBlock
    );
    event Voted(uint256 proposalId, address voter, bool vote, uint256 weight);
    event ProposalExecuted(uint256 proposalId);

    constructor(RealEstateTokens _tokenContract) {
        tokens = _tokenContract;
    }

    // Used by proposer to create new proposal
    function createProposal(uint256 tokenId, string memory description) public {
        require(
            tokens.balanceOf(msg.sender, tokenId) > 0,
            "Must be a token holder to create proposal"
        );

        uint256 totalTokens = tokens.totalSupply(tokenId);

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            tokenId: tokenId,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            totalTokens: totalTokens,
            endBlock: block.number + votingDuration,
            executed: false,
            proposalType: ProposalType.Regular,
            tenant: address(0),
            rent: 0
        });

        proposalCount++;

        emit ProposalCreated(
            proposalCount - 1,
            msg.sender,
            tokenId,
            description,
            block.number + votingDuration
        );
    }

    function createRentProposal(
        uint256 tokenId,
        string memory description,
        address tenant,
        uint256 rent
    ) public {
        require(
            tokens.balanceOf(msg.sender, tokenId) > 0,
            "Must be a token holder to create proposal"
        );

        uint256 totalTokens = tokens.totalSupply(tokenId);

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            tokenId: tokenId,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            totalTokens: totalTokens,
            endBlock: block.number + votingDuration,
            executed: false,
            proposalType: ProposalType.Rent,
            tenant: tenant,
            rent: rent
        });

        proposalCount++;

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
        require(
            !hasVoted[proposalId][msg.sender],
            "You have already voted on this proposal"
        );

        uint256 weight = tokens.balanceOf(msg.sender, p.tokenId);

        require(weight > 0, "Must be a token holder to vote");

        if (decision) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }

        hasVoted[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, decision, weight);
    }

    function executeProposal(uint256 proposalId) public payable {
        Proposal storage p = proposals[proposalId];
        if (p.proposalType == ProposalType.Rent) {
            require(
                msg.sender == p.tenant,
                "Only the tenant can execute this proposal"
            );
        }
        require(block.number > p.endBlock, "Voting period has not ended");
        require(!p.executed, "Proposal has been executed");

        if (p.forVotes > p.againstVotes && p.forVotes > p.totalTokens / 2) {
            p.executed = true;

            // For Rent proposal, the tenant must send the rent amount to the DAO contract
            // and it will be distributed proportionally to token holders
            if (p.proposalType == ProposalType.Rent) {
                require(msg.value == p.rent, "Rent amount is incorrect");
                uint256 numTokenHolders = tokens.getTokenHoldersLength(
                    p.tokenId
                );
                // Distribute the rent to the token holders
                for (uint256 i = 0; i < numTokenHolders; i++) {
                    address payable holder = payable(
                        tokens.tokenHolders(p.tokenId, i)
                    ); // Replace with the actual address of the token holder
                    uint256 holderBalance = tokens.balanceOf(holder, p.tokenId);
                    uint256 holderShare = (p.rent * holderBalance) /
                        p.totalTokens;
                    // Transfer SepoliaETH to the token holder
                    holder.transfer(holderShare);
                }
            }
            emit ProposalExecuted(proposalId);
        }
    }

    function getActiveProposals() public view returns (Proposal[] memory) {
        Proposal[] memory tempProposals = new Proposal[](proposalCount);
        uint256 count = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            Proposal storage p = proposals[i];
            if (!p.executed && block.number <= p.endBlock) {
                tempProposals[count] = p;
                count++;
            }
        }

        // Create a new array with the exact length needed
        // Proposals are now sorted descending by id
        Proposal[] memory activeProposals = new Proposal[](count);
        for (uint256 i = 0; i < count; i++) {
            activeProposals[count - i - 1] = tempProposals[i];
        }

        return activeProposals;
    }

    function getPastProposals() public view returns (Proposal[] memory) {
        Proposal[] memory tempProposals = new Proposal[](proposalCount);
        uint256 count = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            Proposal storage p = proposals[i];
            if (block.number > p.endBlock) {
                tempProposals[count] = p;
                count++;
            }
        }

        // Create a new array with the exact length needed
        // Proposals are now sorted descending by id
        Proposal[] memory pastProposals = new Proposal[](count);
        for (uint256 i = 0; i < count; i++) {
            pastProposals[count - i - 1] = tempProposals[i];
        }

        return pastProposals;
    }
}
