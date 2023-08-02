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

const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

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
      // Provider to connect to Sepolia testnet from Metamask
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer from metamask, assume it is already connected
      const signer = await metamaskProvider.getSigner();

      // Retrieve a contract instance using contract address, ABI, and provider
      const contract = new ethers.Contract(
        daoContractAddress,
        ["function executeProposal(uint256 proposalId) public payable"],
        metamaskProvider
      );
      // if error could not get contract
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      const attachedValue =
        proposal.proposalType === "Rent"
          ? ethers.parseEther(proposal.rent)
          : ethers.parseEther("0");
      // create the proposal
      // note that the connect() function is NECESSARY here, without it you'll get an error "Contract runner does not support sending transactions"
      // when this line is executed, a metamask popup will appear asking for your confirmation to sign the transaction
      await contract
        .connect(signer)
        .executeProposal(proposal.id, { value: attachedValue });
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
