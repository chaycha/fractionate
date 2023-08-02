import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import RegularProposalDialog from "./RegularProposalDialog";
import RentalProposalDialog from "./RentalProposalDialog";

export default function NewProposalDialog({
  open,
  handleClose,
  tokenName,
  tokenId,
}) {
  const [proposalType, setProposalType] = useState("regular");

  const handleProposalTypeChange = (event) => {
    setProposalType(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>New Proposal</DialogTitle>
      <Box ml={2}>
        <RadioGroup
          row
          value={proposalType}
          onChange={handleProposalTypeChange}
        >
          <FormControlLabel
            value="regular"
            control={<Radio />}
            label="Regular"
          />
          <FormControlLabel value="rental" control={<Radio />} label="Rental" />
        </RadioGroup>
        <Box mt={2}>
          {proposalType === "regular" ? (
            <RegularProposalDialog
              tokenName={tokenName}
              tokenId={tokenId}
              handleClose={handleClose}
            />
          ) : (
            <RentalProposalDialog
              tokenName={tokenName}
              tokenId={tokenId}
              handleClose={handleClose}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
