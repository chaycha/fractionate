import { useEffect, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";

const apiUrl = process.env.REACT_APP_API_URL;
const tokenContractAddress = process.env.REACT_APP_DEPLOYED_TOKEN_ADDRESS;

export const TransferPage = () => {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [ownedTokenList, setOwnedTokenList] = useState([]);
  const [user] = useLocalStorage("user", {});

  const handleTransfer = (event) => {
    event.preventDefault();
    transfer(receiver, token, amount);
    setToken("");
    setAmount("");
    setReceiver("");
  };

  const transfer = async (receiverAddress, tokenId, amount) => {
    try {
      // Provider to connect to Sepolia testnet from Alchemy
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer from metamask, assume it is already connected
      const signer = await metamaskProvider.getSigner();

      // Retrieve a contract instance using contract address, ABI, and provider
      const contract = new ethers.Contract(
        tokenContractAddress,
        [
          "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external",
        ],
        metamaskProvider
      );
      // if error could not get contract
      if (!contract) {
        console.log("Could not get contract");
        return;
      }

      const senderAddress = signer.address;
      // execute the transfer
      // note that the connect() function is NECESSARY here, without it you'll get an error "Contract runner does not support sending transactions"
      // when this line is executed, a metamask popup will appear asking for your confirmation to sign the transaction
      await contract
        .connect(signer)
        .safeTransferFrom(
          senderAddress,
          receiverAddress,
          tokenId,
          amount,
          "0x"
        );
      console.log(
        `Transfer request for ${amount} tokens of id ${tokenId} from ${senderAddress} to ${receiverAddress} is sent.`
      );
      alert(
        "Request for transfer is sent. Please approve the transaction in Metamask popup."
      );
    } catch (error) {
      console.log("Transfer failed", error);
      alert("Transfer failed");
    }
  };

  // Exactly the same function as fetchOwnedTokens in pages/MyAssets.js
  const fetchOwnedTokens = async () => {
    try {
      const response = await fetch(`${apiUrl}/asset/my-assets`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: user.linkedWallet,
        }),
      });
      const receivedResponse = await response.json();
      if (!response.ok) {
        throw new Error(receivedResponse.message);
      }
      console.log("Get owned tokens successfully:", receivedResponse);
      setOwnedTokenList(receivedResponse.ownedTokenList);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchOwnedTokens();
  }, []);

  const handleRefresh = () => {
    fetchOwnedTokens();
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
          <ArrowRightAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Transfer Tokens
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ mt: 1, mb: 2 }}
        >
          Refresh Data
        </Button>
        <Box
          component="form"
          onSubmit={handleTransfer}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="token-select-label">Choose Token</InputLabel>
            <Select
              labelId="token-select-label"
              value={token}
              label="Choose Token"
              onChange={(event) => setToken(event.target.value)}
            >
              {/* Fetch the list of owned tokens from backend */}
              {ownedTokenList.map((token) => (
                <MenuItem key={token.id} value={token.id}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount"
            name="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="receiver"
            label="Receiver's Wallet Address"
            id="receiver"
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            sx={{ mt: 1 }}
          />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap="16px"
            marginTop="16px"
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#3a34d2", mt: 1, mb: 2 }}
            >
              Transfer
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
