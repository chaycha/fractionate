import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ethers } from "ethers";
import { getDaoContract } from "../utils/contractUtils";

export default function ExecuteProposalDialog({ proposal }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleExecute = () => {
    executeProposal();
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const executeProposal = async () => {
    try {
      const daoContract = await getDaoContract([
        "function executeProposal(uint256 proposalId) public payable",
      ]);
      const attachedValue =
        proposal.proposalType === "Rent"
          ? ethers.parseEther(proposal.rent)
          : ethers.parseEther("0");
      await daoContract.executeProposal(proposal.id, { value: attachedValue });

      console.log(`Executed proposal ${proposal.id}`);
      setAlertMessage(`Executed proposal ${proposal.id}`);
      setAlertSeverity("success");
      setAlertOpen(true);
      setDialogOpen(false);
    } catch (error) {
      console.log(`Error executing proposal ${proposal.id}`, error);
      setAlertMessage(`Error executing proposal ${proposal.id}`);
      setAlertSeverity("error");
      setAlertOpen(true);
      setDialogOpen(false);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Execute
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Execute Proposal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Execute proposal number {proposal.id} proposed by{" "}
            {proposal.proposer}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExecute}>Execute</Button>
          <Button onClick={handleClose}>Cancel</Button>
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
