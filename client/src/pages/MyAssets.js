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
import { ethers } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatWithCommas, formatWithSepoliaETH } from "../utils/numberUtils";
import { getTokenContract } from "../utils/contractUtils";

export const MyAssetsPage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const [userTokenData, setUserTokenData] = useState([]);

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
      setUserTokenData(formattedResponse);
      console.log(`Retrieved all tokens of ${user.linkedWallet} successfully`);
    } catch (err) {
      console.error(`Retrieve tokens failed:`, err.message);
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
              <TableCell>Price Per Token</TableCell>
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
                    {formatWithSepoliaETH(
                      formatWithCommas(
                        ethers.formatEther(BigInt(token.pricePerToken))
                      )
                    )}
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
