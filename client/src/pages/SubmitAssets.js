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
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ethers } from "ethers";

const apiUrl = process.env.REACT_APP_API_URL;
const tokenContractAddress = process.env.REACT_APP_DEPLOYED_TOKEN_ADDRESS;

export const SubmitAssetsPage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const [assetName, setAssetName] = useState("");
  const [assetPrice, setAssetPrice] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success"); // new state variable

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
    //try {
    /*
      const response = await fetch(`${apiUrl}/asset/new-asset`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetName: assetName,
          assetPrice: assetPrice,
          minerAddress: user.linkedWallet,
        }),
      });
      const receivedResponse = await response.json();
      if (!response.ok) {
        throw new Error(receivedResponse.message);
      }
      */
  };

  const submitAsset = async (assetName, assetPrice) => {
    //try {
    const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

    const signer = await metamaskProvider.getSigner();

    const contract = new ethers.Contract(
      tokenContractAddress,
      [
        "function mintNew(string memory name, uint256 totalSupply, uint256 pricePerToken, address account) public",
      ],
      metamaskProvider
    );
    if (!contract) {
      console.log("Could not get contract");
      return;
    }

    const pricePerToken = Math.floor(
      (assetPrice * process.env.REACT_APP_MULTIPLIER) /
        process.env.REACT_APP_TOKEN_AMOUNT
    );
    console.log(contract);
    console.log(
      assetName,
      process.env.REACT_APP_TOKEN_AMOUNT,
      pricePerToken,
      user.linkedWallet
    );
    await contract
      .connect(signer)
      .mintNew(
        assetName,
        process.env.REACT_APP_TOKEN_AMOUNT,
        pricePerToken,
        user.linkedWallet
      );
    console.log(`Tokenise ${assetName} successfully`);
    setAlertMessage(`Tokenise ${assetName} successfully`);
    setAlertSeverity("success");
    setAlertOpen(true);

    // Clear the form fields
    setAssetName("");
    setAssetPrice("");
    /*
    } catch (err) {
      console.error(err.message);
      setAlertMessage(`Tokenise asset failed`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
    */
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
            label="Asset Price"
            id="price"
            inputProps={{ type: "number", pattern: "[1-9][0-9]*" }}
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
