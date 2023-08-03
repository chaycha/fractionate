import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DescriptionIcon from "@mui/icons-material/Description";
import { ethers } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
import VoteDialog from "../components/VoteDialog";
import NewProposalDialog from "../components/NewProposalDialog";
import ExecuteProposalDialog from "../components/ExecuteProposalDialog";
import { formatWithCommas, formatWithSepoliaETH } from "../utils/numberUtils";
import { getTokenContract, getDaoContract } from "../utils/contractUtils";

export const ProposalsPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const location = useLocation();
  const [user] = useLocalStorage("user", "");

  const searchParams = new URLSearchParams(location.search);
  const tokenName = searchParams.get("name");
  const tokenBalance = searchParams.get("balance");

  const fetchProposals = async () => {
    try {
      const contract = await getDaoContract([
        "function getActiveProposals() public view returns (tuple(uint256 id, address proposer, uint256 tokenId, string description, uint256 forVotes, uint256 againstVotes, uint256 totalTokens, uint256 endBlock, bool executed, uint256 proposalType, address tenant, uint256 rent)[] memory)",
        "function getPastProposals() public view returns (tuple(uint256 id, address proposer, uint256 tokenId, string description, uint256 forVotes, uint256 againstVotes, uint256 totalTokens, uint256 endBlock, bool executed, uint256 proposalType, address tenant, uint256 rent)[] memory)",
      ]);
      const retrievedActiveProposals = await contract.getActiveProposals();
      const retrievedPastProposals = await contract.getPastProposals();
      const formattedActiveProposals = retrievedActiveProposals.map(
        (proposal) => {
          return {
            id: Number(proposal.id),
            proposer: proposal.proposer,
            tokenId: Number(proposal.tokenId),
            description: proposal.description,
            forVotes: Number(proposal.forVotes),
            againstVotes: Number(proposal.againstVotes),
            totalTokens: Number(proposal.totalTokens),
            endBlock: Number(proposal.endBlock),
            executed: proposal.executed,
            proposalType:
              Number(proposal.proposalType) === 0 ? "Regular" : "Rent",
            tenant: proposal.tenant,
            rent: ethers.formatEther(proposal.rent),
          };
        }
      );
      const formattedPastProposals = retrievedPastProposals.map((proposal) => {
        return {
          id: Number(proposal.id),
          proposer: proposal.proposer,
          tokenId: Number(proposal.tokenId),
          description: proposal.description,
          forVotes: Number(proposal.forVotes),
          againstVotes: Number(proposal.againstVotes),
          totalTokens: Number(proposal.totalTokens),
          endBlock: Number(proposal.endBlock),
          executed: proposal.executed,
          proposalType:
            Number(proposal.proposalType) === 0 ? "Regular" : "Rent",
          tenant: proposal.tenant,
          rent: ethers.formatEther(proposal.rent),
        };
      });
      console.log(formattedActiveProposals);
      console.log(formattedPastProposals);
      setActiveProposals(formattedActiveProposals);
      setPastProposals(formattedPastProposals);
      console.log(
        `Active and past proposals for asset ${tokenId} retrieved successfully`
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchChainInfo = async () => {
    try {
      const contract = await getTokenContract([
        "function totalSupply(uint256 id) public view returns (uint256)",
      ]);
      const retrievedTotalTokens = await contract.totalSupply(tokenId);
      setTotalTokens(Number(retrievedTotalTokens));
      console.log(`Total tokens for asset ${tokenId} retrieved successfully`);

      // Get the current block number
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);
      const blockNumber = await metamaskProvider.getBlockNumber();
      setCurrentBlock(blockNumber);
      console.log(`Current block number retrieved successfully`);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchProposals();
    fetchChainInfo();
  }, []);

  const handleRefresh = () => {
    fetchProposals();
    fetchChainInfo();
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashboard/my-assets")}
            startIcon={<ArrowBackIosIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(true)}
          >
            New proposal
          </Button>
        </Box>
        <NewProposalDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          tokenName={tokenName}
          tokenId={tokenId}
        />
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <DescriptionIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Proposals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ mt: 1, mb: 2 }}
        >
          Refresh Data
        </Button>
        <Typography component="h2" variant="h6">
          Asset Information
        </Typography>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Asset ID: {tokenId}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Name: {tokenName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Balance: {formatWithCommas(tokenBalance)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Total Tokens: {formatWithCommas(totalTokens)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Current Block: {formatWithCommas(currentBlock)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography component="h2" variant="h6">
          Active Proposals
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proposal ID</TableCell>
              <TableCell>Proposer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>For Votes</TableCell>
              <TableCell>Against Votes</TableCell>
              <TableCell>End Block</TableCell>
              <TableCell>Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeProposals.length > 0 ? (
              activeProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell>{proposal.proposer}</TableCell>
                  <TableCell>{proposal.proposalType}</TableCell>
                  <TableCell>{proposal.tenant}</TableCell>
                  <TableCell>{formatWithSepoliaETH(proposal.rent)}</TableCell>
                  <TableCell>{proposal.description}</TableCell>
                  <TableCell>{formatWithCommas(proposal.forVotes)}</TableCell>
                  <TableCell>
                    {formatWithCommas(proposal.againstVotes)}
                  </TableCell>
                  <TableCell>{formatWithCommas(proposal.endBlock)}</TableCell>
                  <TableCell>
                    <VoteDialog proposal={proposal} tokenId={tokenId} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No active proposals
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Typography component="h2" variant="h6" sx={{ mt: 2 }}>
          Past Proposals
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proposal ID</TableCell>
              <TableCell>Proposer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>For Votes</TableCell>
              <TableCell>Against Votes</TableCell>
              <TableCell>End Block</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastProposals.length > 0 ? (
              pastProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell>{proposal.proposer}</TableCell>
                  <TableCell>{proposal.proposalType}</TableCell>
                  <TableCell>{proposal.tenant}</TableCell>
                  <TableCell>{formatWithSepoliaETH(proposal.rent)}</TableCell>
                  <TableCell>{proposal.description}</TableCell>
                  <TableCell>{formatWithCommas(proposal.forVotes)}</TableCell>
                  <TableCell>
                    {formatWithCommas(proposal.againstVotes)}
                  </TableCell>
                  <TableCell>{formatWithCommas(proposal.endBlock)}</TableCell>
                  <TableCell>
                    {proposal.forVotes <= totalTokens / 2 ? (
                      "Failed"
                    ) : proposal.executed ? (
                      "Executed"
                    ) : (proposal.proposalType === "Regular" &&
                        proposal.proposer === user.linkedWallet) ||
                      (proposal.proposalType === "Rent" &&
                        proposal.tenant === user.linkedWallet) ? (
                      <>
                        Passed
                        <ExecuteProposalDialog proposal={proposal}>
                          Execute
                        </ExecuteProposalDialog>
                      </>
                    ) : (
                      "Passed"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No past proposals
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};
