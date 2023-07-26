import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const apiUrl = process.env.REACT_APP_API_URL;

export const MyAssetsPage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const [userTokenData, setUserTokenData] = useState([]);

  const getAssets = async () => {
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
    getAssets();
  }, [user.linkedWallet]);

  const handleRefresh = () => {
    getAssets();
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2} // Add margin to the top
      >
        <Box display="flex" alignItems="center">
          <HolidayVillageIcon />
          <Typography variant="h4" component="h2" ml={1}>
            My Assets
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Refresh Data
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Token ID</TableCell>
            <TableCell>Token Name</TableCell>
            <TableCell>Token Price</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>View</TableCell> {/* New column for the "View" button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {userTokenData.map((token) => (
            <TableRow key={token.id}>
              <TableCell>{token.id}</TableCell>
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.pricePerToken}</TableCell>
              <TableCell>{token.balance}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary" // Set color to "primary" to make it filled with the primary color
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
