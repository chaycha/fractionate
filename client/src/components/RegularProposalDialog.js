/*
import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";

const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

export default function NewProposalDialog({
  open,
  handleClose,
  tokenName,
  tokenId,
}) {
  const [description, setDescription] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleCreate = (event) => {
    event.preventDefault();
    createProposal(description);
  };

  const handleCancel = () => {
    handleClose();
    setDescription("");
  };

  const createProposal = async (description) => {
    try {
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      const signer = await metamaskProvider.getSigner();

      const contract = new ethers.Contract(
        daoContractAddress,
        [
          "function createProposal(uint256 tokenId, string memory description) public",
        ],
        metamaskProvider
      );
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      await contract.connect(signer).createProposal(tokenId, description);
      console.log(
        `Created new proposal for asset ${tokenId} with description "${description}"`
      );
      setAlertMessage("Created new proposal successfully");
      setAlertSeverity("success");
      setAlertOpen(true);
      setDescription("");
      handleClose();
    } catch (error) {
      console.log("Error creating proposal", error);
      setAlertMessage("Error creating proposal");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Dialog>
    </Container>
  );
}
*/

import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";

const daoContractAddress = process.env.REACT_APP_DEPLOYED_DAO_ADDRESS;

export default function RegularProposalDialog({
  tokenName,
  tokenId,
  handleClose,
}) {
  const [description, setDescription] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleCreate = (event) => {
    event.preventDefault();
    createProposal(description);
  };

  const handleCancel = () => {
    console.log(handleClose);
    handleClose();
    setDescription("");
  };

  const createProposal = async (description) => {
    try {
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      const signer = await metamaskProvider.getSigner();

      const contract = new ethers.Contract(
        daoContractAddress,
        [
          "function createProposal(uint256 tokenId, string memory description) public",
        ],
        metamaskProvider
      );
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      await contract.connect(signer).createProposal(tokenId, description);
      console.log(
        `Created new proposal for asset ${tokenId} with description "${description}"`
      );
      setAlertMessage("Created new proposal successfully");
      setAlertSeverity("success");
      setAlertOpen(true);
      setDescription("");
    } catch (error) {
      console.log("Error creating proposal", error);
      setAlertMessage("Error creating proposal");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
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
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Dialog>
    </Container>
  );
}
