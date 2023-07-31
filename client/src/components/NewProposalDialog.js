import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ethers } from "ethers";

const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

export default function NewProposalDialog({
  open,
  handleClose,
  tokenName,
  tokenId,
}) {
  const [description, setDescription] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    createProposal(description);
  };

  const createProposal = async (description) => {
    try {
      // Provider to connect to Sepolia testnet from Metamask
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer from metamask, assume it is already connected
      const signer = await metamaskProvider.getSigner();

      // Retrieve a contract instance using contract address, ABI, and provider
      const contract = new ethers.Contract(
        daoContractAddress,
        [
          "function createProposal(uint256 tokenId, string memory description) public",
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
      await contract.connect(signer).createProposal(tokenId, description);
      console.log(
        `Created new proposal for asset ${tokenId} with description "${description}"`
      );
      alert("Created new proposal successfully");
      handleClose();
    } catch (error) {
      console.log("Error creating proposal", error);
      alert("Error creating proposal");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Proposal</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Asset ID"
          defaultValue={tokenId}
          fullWidth
          disabled
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Asset Name"
          defaultValue={tokenName}
          fullWidth
          disabled
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Quorum"
          defaultValue="50%"
          fullWidth
          disabled
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
