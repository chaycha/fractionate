import { useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTokenContract } from "../utils/contractUtils";
import { TOKEN_AMOUNT } from "../constants";
import { toFixed } from "../utils/numberUtils";

export const SubmitAssetsPage = () => {
  const [user] = useLocalStorage("user", {});
  const [assetName, setAssetName] = useState("");
  const [assetPrice, setAssetPrice] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleSubmitAsset = (event) => {
    event.preventDefault();

    if (!assetName) {
      setAlertMessage("Asset Name is required");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    if (!assetPrice) {
      setAlertMessage("Asset Price is required");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    submitAsset(assetName, assetPrice);
  };

  const submitAsset = async (assetName, assetPrice) => {
    try {
      const tokenContract = await getTokenContract([
        "function mintNew(string memory name, uint256 totalSupply, uint256 pricePerToken, address account) public",
      ]);
      const pricePerToken = ethers.parseEther(
        toFixed(assetPrice / TOKEN_AMOUNT).toString()
      );
      await tokenContract.mintNew(
        assetName,
        TOKEN_AMOUNT,
        pricePerToken,
        user.linkedWallet
      );
      console.log(`Tokenise ${assetName} successfully`);
      setAlertMessage(`Tokenise ${assetName} successfully`);
      setAlertSeverity("success");
      setAlertOpen(true);
      setAssetName("");
      setAssetPrice("");
    } catch (err) {
      console.error(err.message);
      setAlertMessage(`Tokenise asset failed`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <PublishIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Submit Asset
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmitAsset}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Asset Name"
            name="name"
            autoFocus
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="price"
            label="Asset Price (in SepoliaETH)"
            id="price"
            inputProps={{ type: "number" }}
            value={assetPrice}
            onChange={(e) => setAssetPrice(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ mb: 0 }}
        >
          {alertMessage}
        </Alert>
      </Dialog>
    </Container>
  );
};
