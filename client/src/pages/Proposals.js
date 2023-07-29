import { useParams, useNavigate } from "react-router-dom";
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DescriptionIcon from "@mui/icons-material/Description";
import VoteDialog from "../components/VoteDialog";

export const ProposalsPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  // Assume you have fetched the following data from your backend
  const assetInfo = {
    name: "Token Name",
    balance: "100",
    totalTokens: "1000000",
    currentBlock: "4700",
  };

  const activeProposals = [
    // Placeholder data, replace with your actual data
    {
      id: "1",
      proposer: "Alice",
      description: "Proposal 1",
      forVotes: "100",
      againstVotes: "50",
      totalTokens: "1000",
      endBlock: "5000",
    },
    {
      id: "2",
      proposer: "Bob",
      description: "Proposal 2",
      forVotes: "150",
      againstVotes: "30",
      totalTokens: "1000",
      endBlock: "6000",
    },
    // More proposals...
  ];

  const pastProposals = [
    // Placeholder data, replace with your actual data
    {
      id: "3",
      proposer: "Charlie",
      description: "Proposal 3",
      decision: "Passed",
      endBlock: "4000",
    },
    {
      id: "4",
      proposer: "Dave",
      description: "Proposal 4",
      decision: "Failed",
      endBlock: "4500",
    },
    // More proposals...
  ];

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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/my-assets")}
          sx={{ alignSelf: "flex-start", mb: 2 }}
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <DescriptionIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Proposals
        </Typography>
        <Typography component="h2" variant="h6">
          Asset Information
        </Typography>
        <Typography>Name: {assetInfo.name}</Typography>
        <Typography>Balance: {assetInfo.balance}</Typography>
        <Typography>Total Tokens: {assetInfo.totalTokens}</Typography>
        <Typography>Current Block: {assetInfo.currentBlock}</Typography>
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
              <TableCell>Total Tokens</TableCell>
              <TableCell>End Block</TableCell>
              <TableCell>Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeProposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>{proposal.id}</TableCell>
                <TableCell>{proposal.proposer}</TableCell>
                <TableCell>{proposal.description}</TableCell>
                <TableCell>{proposal.forVotes}</TableCell>
                <TableCell>{proposal.againstVotes}</TableCell>
                <TableCell>{proposal.totalTokens}</TableCell>
                <TableCell>{proposal.endBlock}</TableCell>
                <TableCell>
                  <VoteDialog proposal={proposal} tokenId={tokenId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography component="h2" variant="h6">
          Past Proposals
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Proposer</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Decision</TableCell>
              <TableCell>End Block</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastProposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>{proposal.id}</TableCell>
                <TableCell>{proposal.proposer}</TableCell>
                <TableCell>{proposal.description}</TableCell>
                <TableCell>{proposal.decision}</TableCell>
                <TableCell>{proposal.endBlock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};
