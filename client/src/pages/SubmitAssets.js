import * as React from "react";
import PublishIcon from "@mui/icons-material/Publish";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLocalStorage } from "../hooks/useLocalStorage";

const apiUrl = process.env.REACT_APP_API_URL;

export const SubmitAssetsPage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const handleSubmitAsset = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const assetName = data.get("name");
    const assetPrice = data.get("price");
    //TODO send HTTP request to hardhat server to create new token
    try {
      const response = await fetch(`${apiUrl}/asset/new-asset`, {
        method: "POST",
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
      console.log(receivedResponse);
      console.log("Tokenise asset successfully:", receivedResponse);
      alert(`Tokenise asset ${receivedResponse.token} successfully`);
    } catch (err) {
      console.error(err.message);
    }
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="price"
            label="Asset Price"
            id="price"
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
    </Container>
  );
};
