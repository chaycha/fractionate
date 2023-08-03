import { useState } from "react";
import {
  Alert,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { ethers } from "ethers";
import { getDaoContract } from "../utils/contractUtils";

export default function RentalProposalDialog({
  tokenName,
  tokenId,
  handleClose,
}) {
  const [description, setDescription] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [tenantAddress, setTenantAddress] = useState("");
  const [rent, setRent] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    if (!tenantAddress) {
      setAlertMessage("Tenant address is required");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }
    if (!rent) {
      setAlertMessage("Rent is required");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    createRentProposal(description, tenantAddress, rent);
  };

  const handleCancel = () => {
    handleClose();
    setDescription("");
  };

  const createRentProposal = async (description, tenantAddress, rent) => {
    try {
      const daoContract = await getDaoContract([
        "function createRentProposal(uint256 tokenId, string memory description, address tenant, uint256 rent) public",
      ]);
      const rentInWei = ethers.parseEther(rent);
      await daoContract.createRentProposal(
        tokenId,
        description,
        tenantAddress,
        rentInWei
      );
      console.log(
        `Created new rent proposal for asset ${tokenId} with tenant address ${tenantAddress}, rent ${rent}, and description "${description}"`
      );
      setAlertMessage("Created new proposal successfully");
      setAlertSeverity("success");
      setAlertOpen(true);
      setDescription("");
      setTenantAddress("");
      setRent("");
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
          label="Tenant Address"
          fullWidth
          value={tenantAddress}
          onChange={(event) => setTenantAddress(event.target.value)}
        />
        <TextField
          margin="dense"
          label="Rent"
          fullWidth
          value={rent}
          onChange={(event) => setRent(event.target.value)}
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
