import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";

export default function VoteDialog({ proposal, tokenId }) {
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [voteType, setVoteType] = useState("");
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (!voted) {
      navigate(`/dashboard/my-assets/${tokenId}`);
    }
  };

  const handleVote = (type) => {
    setVoteType(type);
    setVoted(true);
    setAlertOpen(true);
    setOpen(false);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    navigate(`/dashboard/my-assets/${tokenId}`);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        disabled={voted}
      >
        Vote
      </Button>
      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ mb: 2 }}>
          Voted {voteType} proposal {proposal.id} successfully
        </Alert>
      </Dialog>
    </div>
  );
}
