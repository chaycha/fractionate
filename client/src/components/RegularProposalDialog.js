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
import { getDaoContract } from "../utils/contractUtils";

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
      const daoContract = await getDaoContract([
        "function createProposal(uint256 tokenId, string memory description) public",
      ]);
      await daoContract.createProposal(tokenId, description);
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
