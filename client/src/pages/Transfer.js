import { useEffect, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTokenContract } from "../utils/contractUtils";

export const TransferPage = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [ownedTokenList, setOwnedTokenList] = useState([]);
  const [user] = useLocalStorage("user", {});

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleTransfer = (event) => {
    event.preventDefault();
    transfer(receiver, token, amount);
  };

  const transfer = async (receiverAddress, tokenId, amount) => {
    try {
      const tokenContract = await getTokenContract([
        "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external",
      ]);
      const senderAddress = user.linkedWallet;
      await tokenContract.safeTransferFrom(
        senderAddress,
        receiverAddress,
        tokenId,
        amount,
        "0x"
      );
      console.log(
        `Transfer request for ${amount} tokens of id ${tokenId} from ${senderAddress} to ${receiverAddress} is sent.`
      );
      setToken("");
      setAmount("");
      setReceiver("");
      setAlertMessage(`Transfer ${amount} tokens successfully.`);
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.log("Transfer failed", error);
      setAlertMessage(`Transfer failed`);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  // Exactly the same function as fetchOwnedTokens in pages/MyAssets.js
  const fetchOwnedTokens = async () => {
    try {
      const tokenContract = await getTokenContract([
        "function getTokensOfUser(address account) public view returns (tuple(uint256 id, string name, uint256 pricePerToken, uint256 balance)[] memory)",
      ]);
      const receivedResponse = await tokenContract.getTokensOfUser(
        user.linkedWallet
      );
      const formattedResponse = receivedResponse.map((token) => {
        return {
          id: Number(token.id),
          name: token.name,
          pricePerToken: Number(token.pricePerToken),
          balance: Number(token.balance),
        };
      });
      setOwnedTokenList(formattedResponse);
      console.log(`Retrieved all tokens of ${user.linkedWallet} successfully`);
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
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Dialog>
    </Container>
  );
};
