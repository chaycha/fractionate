import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const LoginPage = () => {
  const { login } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({
      email: data.get("email"),
      password: data.get("password"),
    });
    connectWallet();
  };

  const [selectedAddress, setSelectedAddress] = useState();
  // Need to change to sepoia network id
  const HARDHAT_NETWORK_ID = `0xaa36a7`;

  const connectWallet = async () => {
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [obtainedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    /*
    // Check the network
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      switchChain();
    }

    const switchChain = async () => {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_NETWORK_ID }],
      });
    };
    */

    // We can then use selectedAddress in our application
    setSelectedAddress(obtainedAddress);

    console.log("Connected to wallet");
  };

  /* unused code for refresh token
  const handleRefresh = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const completedResponse = await response.json();
        console.log("refreshed successfully");
        console.log(completedResponse);
      } else {
        console.error("Refresh request failed:", response.status);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  */

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item>
              <RouterLink to="/signup">
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
