import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getDaoContract } from "../utils/contractUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function VoteDialog({ proposal, tokenId }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voted, setVoted] = useState(false);
  const [user] = useLocalStorage("user", {});

  const handleClickOpen = () => {
    if (voted) {
      alert("You have already voted on this proposal");
    } else {
      setDialogOpen(true);
    }
  };

  const handleVote = (type) => {
    vote(type);
  };

  const vote = async (type) => {
    try {
      const daoContract = await getDaoContract([
        "function vote(uint256 proposalId, bool decision) public",
      ]);
      const decision = type === "for";
      await daoContract.vote(proposal.id, decision);

      console.log(`Voted ${type} proposal ${proposal.id} successfully`);
      setVoted(true);
      setAlertMessage(`Voted ${type} proposal ${proposal.id} successfully`);
      setAlertSeverity("success");
      setAlertOpen(true);
      setDialogOpen(false);
    } catch (error) {
      console.log(`Error voting on proposal ${proposal.id}`, error);
      setAlertMessage(`Error voting on proposal ${proposal.id}`);
      setAlertSeverity("error");
      setAlertOpen(true);
      setDialogOpen(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const checkIfVoted = async () => {
      try {
        const daoContract = await getDaoContract([
          "function hasVoted(uint256 proposalId, address voterAddress) public view returns (bool)",
        ]);

        const voted = await daoContract.hasVoted(
          proposal.id,
          user.linkedWallet
        );
        setVoted(voted);
      } catch (error) {
        console.log(
          `Error checking if voted on proposal ${proposal.id}`,
          error
        );
      }
    };

    checkIfVoted();
  }, [proposal, user.linkedWallet]);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        disabled={voted}
      >
        {voted ? "Voted" : "Vote"}
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>Vote on Proposal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vote on proposal number {proposal.id} proposed by{" "}
            {proposal.proposer} {/* Display the proposal information */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleVote("for")}>For</Button>
          <Button onClick={() => handleVote("against")}>Against</Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Dialog>
    </div>
  );
}
