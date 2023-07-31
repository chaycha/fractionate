import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DescriptionIcon from "@mui/icons-material/Description";
import { ethers } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
import VoteDialog from "../components/VoteDialog";
import NewProposalDialog from "../components/NewProposalDialog";
import ExecuteProposalDialog from "../components/ExecuteProposalDialog";

const tokenContractAddress = process.env.REACT_APP_DEPLOYED_TOKEN_ADDRESS;
const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

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
      // Provider to connect to Sepolia testnet from Metamask
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer from metamask, assume it is already connected
      const signer = await metamaskProvider.getSigner();

      // Retrieve a contract instance using contract address, ABI, and provider
      const contract = new ethers.Contract(
        daoContractAddress,
        [
          "function getActiveProposals() public view returns (tuple(uint256 id, address proposer, uint256 tokenId, string description, uint256 forVotes, uint256 againstVotes, uint256 totalTokens, uint256 endBlock, bool executed)[] memory)",
          "function getPastProposals() public view returns (tuple(uint256 id, address proposer, uint256 tokenId, string description, uint256 forVotes, uint256 againstVotes, uint256 totalTokens, uint256 endBlock, bool executed)[] memory)",
        ],
        metamaskProvider
      );
      // if error could not get contract
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      // create the proposal
      // note that the connect() function is NECESSARY here, without it you'll get an error "Contract runner does not support sending transactions"
      // when this line is executed, a metamask popup will appear asking for your confirmation to sign the transaction
      const retrievedActiveProposals = await contract
        .connect(signer)
        .getActiveProposals();
      const retrievedPastProposals = await contract
        .connect(signer)
        .getPastProposals();
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
        };
      });
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
      // Provider to connect to Sepolia testnet from Metamask
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer from metamask, assume it is already connected
      const signer = await metamaskProvider.getSigner();

      // Retrieve a contract instance using contract address, ABI, and provider
      const contract = new ethers.Contract(
        tokenContractAddress,
        ["function totalSupply(uint256 id) public view returns (uint256)"],
        metamaskProvider
      );
      // if error could not get contract
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      // Get total supply of tokens
      const retrievedTotalTokens = await contract
        .connect(signer)
        .totalSupply(tokenId);
      setTotalTokens(Number(retrievedTotalTokens));
      console.log(`Total tokens for asset ${tokenId} retrieved successfully`);

      // Get the current block number
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
              <Typography>Id: {tokenId}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Name: {tokenName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Balance: {tokenBalance}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Total Tokens: {totalTokens}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Current Block: {currentBlock}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography component="h2" variant="h6">
          Active Proposals
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Proposer</TableCell>
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
                  <TableCell>{proposal.description}</TableCell>
                  <TableCell>{proposal.forVotes}</TableCell>
                  <TableCell>{proposal.againstVotes}</TableCell>
                  <TableCell>{proposal.endBlock}</TableCell>
                  <TableCell>
                    <VoteDialog proposal={proposal} tokenId={tokenId} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
              <TableCell>ID</TableCell>
              <TableCell>Proposer</TableCell>
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
                  <TableCell>{proposal.description}</TableCell>
                  <TableCell>{proposal.forVotes}</TableCell>
                  <TableCell>{proposal.againstVotes}</TableCell>
                  <TableCell>{proposal.endBlock}</TableCell>
                  <TableCell>
                    {proposal.forVotes <= totalTokens / 2 ? (
                      "Failed"
                    ) : proposal.executed ? (
                      "Executed"
                    ) : proposal.proposer === user.linkedWallet ? (
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
                <TableCell colSpan={8} align="center">
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
