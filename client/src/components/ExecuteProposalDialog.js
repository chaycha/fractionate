import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ethers } from "ethers";

const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

export default function ExecuteProposalDialog({ proposal }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleExecute = () => {
    executeProposal();
    handleClose();
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
        ["function executeProposal(uint256 proposalId) public"],
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
      await contract.connect(signer).executeProposal(proposal.id);
      console.log(`Executed proposal ${proposal.id}`);
    } catch (error) {
      console.log(`Error executing proposal ${proposal.id}`, error);
      alert("Error executing proposal");
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
    </div>
  );
}
