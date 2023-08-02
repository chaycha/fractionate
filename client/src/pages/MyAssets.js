import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import {
  Avatar,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatWithCommas, formatWithSepoliaETH } from "../utils/numberUtils";

const apiUrl = process.env.REACT_APP_API_URL;

export const MyAssetsPage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const [userTokenData, setUserTokenData] = useState([]);

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
      console.log("Get assets successfully:", receivedResponse);
      setUserTokenData(receivedResponse.ownedTokenList);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchOwnedTokens();
  }, [user.linkedWallet]);

  const handleRefresh = () => {
    fetchOwnedTokens();
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <HolidayVillageIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          My Assets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ mt: 1, mb: 2 }}
        >
          Refresh Data
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Token Price</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTokenData.length > 0 ? (
              userTokenData.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>{token.id}</TableCell>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>
                    {formatWithSepoliaETH(token.pricePerToken)}
                  </TableCell>
                  <TableCell>{formatWithCommas(token.balance)}</TableCell>
                  <TableCell>
                    <Link
                      to={`/dashboard/my-assets/${token.id}?name=${token.name}&balance=${token.balance}`}
                    >
                      <Button variant="contained" color="primary">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Assets Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};
